#run long time tasks.
#https://fernandofreitasalves.com/executing-time-consuming-tasks-asynchronously-with-django-and-celery/
#redirect all shell output 
#https://stackoverflow.com/questions/11229385/redirect-all-output-in-a-bash-script-when-using-set-x
from __future__ import absolute_import

import subprocess
import os
import stat

from . import config
from .models import *

from celery import shared_task
@shared_task  # Use this decorator to make this a asyncronous function
def verify_project(pid):
    cwd="%s/%s/" % (config.projects_root,pid)
    cwd=os.path.abspath(cwd)
    args="simpit -e=config.json.mac >verify.out 2>&1"
    print("verify project %s" % pid)
    job_sh=subprocess.Popen(args=args,cwd=cwd,shell=True)
    ret=job_sh.wait()
    print('exit code: %s' % ret)
    with open("%s/verify.out" % cwd) as f:
        out=f.read()
    return ret,out

@shared_task  # Use this decorator to make this a asyncronous function
def run(job_id,dry_run=False):
    args="%s/%s/execute_job.sh" % (config.jobs_root,job_id)
    cwd="%s/%s/" % (config.jobs_root,job_id)
    args=os.path.abspath(args)
    cwd=os.path.abspath(cwd)
    print("run job script %s in %s" % (args,cwd))
    if dry_run:
        print("return by dry run.")
        return True
    job = Job.objects.get(pk=job_id)
    job.status='DOING'
    job.save()
    job_sh=subprocess.Popen(args=args,cwd=cwd,shell=True)
    job_sh.wait()
    job.status='DONE'
    job.save()
    return True

class Cluster:
    def __init__(self,name,instance,nodes):
        self.instance=config.AWS_INSTANCE_TYPES[instance]
        self.nodes=nodes
        self.name=name
        self.template=config.cluster_template
        self.user=config.cluster_user
        self.hosts_file='mpi-hosts'
        self.IPs={}
        self.cores={}
    def RunCmd(self,script,cmd):
        args="starcluster sshmaster -u %s %s %s" % (self.user,self.name,cmd)
        script.append(args)
    def StartCmd(self,script):
        args="starcluster start -c %s -I %s -i %s -s %s %s" % (self.template, self.instance, self.instance, self.nodes,self.name)
        script.append(args)

    def PutCmd(self,script,local,remote):
        args="starcluster put -u %s %s %s %s" % (self.user,self.name,local,remote)
        script.append(args)
    
    def GetCmd(self,script,remote,local,):
        args="starcluster get %s %s %s" % (self.name,remote,local)
        script.append(args)
    
    def TerminateCmd(self,script):
        args="starcluster terminate -c -f %s" % self.name
        script.append(args)
    
    def GetCores(self):
        return int(self.nodes) * int(config.AWS_INSTANCE_CORES[self.instance])

class JobScript:
    def __init__(self,name,instance,nodes,minutes):
        self.cluster=Cluster(name,instance,nodes)
        self.remote_dir= "%s/%s" % (config.cluster_jobs_root,name)
        self.local_dir= "%s/%s"  % (config.jobs_root,name)
        self.minutes=float(minutes)
        self.name=name

        self.local_script=[]
        self.remote_script=[]

        self.ConfigLocalScript()
        self.ConfigRemoteScript()
        fname="%s/mpiexec.sh" % self.local_dir
        with open(fname,'w') as f:
            f.writelines("\n".join(self.remote_script))
        os.chmod(fname,0o755)    
            
        fname="%s/execute_job.sh" % self.local_dir
        with open(fname,'w') as f:
            f.writelines("\n".join(self.local_script))
        os.chmod(fname,0o755)    
    def ConfigLocalScript(self):
        self.local_script.append("#!/bin/bash")
        self.local_script.append('#Auto generate script. do not modify!')
        self.local_script.append("set -x")
        self.local_script.append("logfile=execute_job.sh.log")
        self.local_script.append("exec > $logfile 2>&1")
        self.local_script.append('')
        self.local_script.append('echo "===Start cluster==="')

        self.cluster.StartCmd(self.local_script)
        self.ConfigUpdateScript()
        self.ConfigNodesInfo()
        self.PackAndSubmitJob()
        self.ConfigWatchScript()

    def ConfigUpdateScript(self):
        self.local_script.append('')
        self.local_script.append('echo "===Begin hot update==="')
        self.cluster.RunCmd(self.local_script,'"mkdir -p %s"' % config.cluster_simpit)
        self.cluster.PutCmd(self.local_script,config.local_simpit_bin,config.cluster_simpit)

    def ConfigWatchScript(self):
        self.local_script.append('')
        self.local_script.append('echo "===Begin watch cluster==="')
        seconds=self.minutes*60
        cmd="sleep 60" 
        self.local_script.append(cmd)
        cmd=["let count=0",
             "while [ ${count} -lt 2 ]",
             "do",
             "pid=$(starcluster sshmaster %s 'pidof mpiexec')" % self.cluster.name,
             'if [ "X$pid" == "X" ]',
             "then",
             "let count=$count+1",
             "fi",
             "sleep 5",
             "done"
            ]
        self.local_script.append("\n".join(cmd))
        self.cluster.GetCmd(self.local_script,self.remote_dir,'../')
        self.cluster.TerminateCmd(self.local_script)

    def PackAndSubmitJob(self):
        self.local_script.append('')
        self.local_script.append('echo "===Pack and submit job==="')
        job_tar="%s.tar.gz" % self.name
        self.local_script.append('tar_opt="--exclude-vcs --exclude-backups --exclude=.tar --exclude=.gz --exclude=.tgz --exclude=.bz  --exclude=.Z --exclude=.zip --exclude=.rar --exclude=.7z"')
        self.local_script.append("tar ${tar_opt} -czf %s ." % job_tar)
        cmd='"mkdir -p %s/%s"' % (config.cluster_jobs_root,self.name)
        self.cluster.RunCmd(self.local_script,cmd)
        self.cluster.PutCmd(self.local_script,job_tar,"%s/%s" % (config.cluster_jobs_root,self.name))

        #cmd='"cd %s && tar -xf %s -C %s && rm %s"' %(config.cluster_jobs_root,job_tar,self.remote_dir,job_tar)
        #self.cluster.RunCmd(self.local_script,cmd)

        cmd="master_node=$(grep 'master\s\+running' %s.info.list | awk '{print $4}')"  % self.cluster.name
        self.local_script.append(cmd)

        cmd="'cd %s && tar -xf %s && rm %s && nohup ./mpiexec.sh >nohup.out 2>&1   </dev/null &'" % (self.remote_dir,job_tar,job_tar)
        cmd='"sh -c %s "' % cmd
        cmd="ssh -i %s %s@${master_node} %s" %(config.cluster_key_file,self.cluster.user,cmd)
        self.local_script.append(cmd)

        cmd="rm -rf %s " % job_tar
        self.local_script.append(cmd)

    
    def ConfigRemoteScript(self):
        self.remote_script.append("#!/bin/bash")
        self.remote_script.append('#Auto generate script. do not modify!')
        self.remote_script.append("logfile=mpiexec.sh.log")
        self.remote_script.append("exec > $logfile 2>&1")
        self.remote_script.append('export PATH=$PATH:%s' % config.cluster_simpit_bin)
        self.remote_script.append('source %s' %  config.cluster_geant4_env)

        np=self.cluster.GetCores()
        args=["mpiexec",
        "--output-filename config.json.log",
        "-n %s" % np,
        "--hostfile %s"%self.cluster.hosts_file,
        "-x G4LEVELGAMMADATA=$G4LEVELGAMMADATA",
        "-x G4NEUTRONXSDATA=$G4NEUTRONXSDATA",
        "-x G4LEDATA=$G4LEDATA",
        "-x G4NEUTRONHPDATA=$G4NEUTRONHPDATA",
        "-x G4RADIOACTIVEDATA=$G4RADIOACTIVEDATA",
        "-x G4ENSDFSTATEDATA=$G4ENSDFSTATEDATA",
        "-x G4ABLADATA=$G4ABLADATA",
        "-x G4PIIDATA=$G4PIIDATA",
        "-x G4SAIDXSDATA=$G4SAIDXSDATA",
        "-x G4REALSURFACEDATA=$G4REALSURFACEDATA",
        "-x LD_LIBRARY_PATH=$LD_LIBRARY_PATH",
        "-x PATH=$PATH",
        "simpit"]
        args.append("-e=config.json.mac")
        args.append("&")
        args =" ".join(args)
        self.remote_script.append(args)
        
        cmd="pid=$(pidof mpiexec)"
        self.remote_script.append(cmd)
        seconds=self.minutes*60+300
        cmd="sleep %s && kill ${pid} &" % seconds
        self.remote_script.append(cmd)
        cmd="wait ${pid}"
        self.remote_script.append(cmd)
        return True
    
    def ConfigNodesInfo(self):
        self.local_script.append('')
        self.local_script.append('echo "===Get cluster info==="')
        logfile="%s.info" % self.cluster.name
        nodelist="%s.list" % logfile
        hostfile="%s.hosts" % nodelist
        cmd="starcluster listclusters %s > %s" %(self.cluster.name,logfile)
        self.local_script.append(cmd)
        cmd="sed  -n '/Cluster nodes:/,/Total nodes:/p' %s | sed '1d' | sed '$d' > %s" %(logfile,nodelist)
        self.local_script.append(cmd)
        cmd="awk '{print $1}' %s > %s" % (nodelist,hostfile)        
        self.local_script.append(cmd)
        cmd="rm -rf %s" % logfile
        self.local_script.append(cmd)
        self.cluster.hosts_file=hostfile
