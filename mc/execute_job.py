#run long time tasks.
#https://fernandofreitasalves.com/executing-time-consuming-tasks-asynchronously-with-django-and-celery/
#redirect all shell output 
#https://stackoverflow.com/questions/11229385/redirect-all-output-in-a-bash-script-when-using-set-x
from __future__ import absolute_import

import subprocess
import os
import stat

from . import config

from celery import shared_task
@shared_task  # Use this decorator to make this a asyncronous function
def run(job):
    args="%s/%s/execute_job.sh" % (config.jobs_root,job)
    cwd="%s/%s/" % (config.jobs_root,job)
    args=os.path.abspath(args)
    cwd=os.path.abspath(cwd)
    print("run job script %s in %s" % (args,cwd))
    job=subprocess.Popen(args=args,cwd=cwd,shell=True)
    job.wait()
    return True

class Cluster:
    def __init__(self,name,instance,nodes):
        self.instance=config.AWS_INSTANCE_TYPES[instance]
        self.nodes=nodes
        self.name=name
        self.template=config.cluster_template
        self.user=config.cluster_user
        self.hosts=[]
        self.ips={}
        self.cors={}
    def RunCmd(self,script,cmd):
        args="starcluster sshmaster -u %s %s %s" % (self.user,self.name,cmd)
        script.append(args)
    def StartCmd(self,script):
        args="starcluster start -c %s -i %s -s %s %s" % (self.template, self.instance, self.nodes,self.name)
        script.append(args)

    def PutCmd(self,script,local,remote):
        args="starcluster put %s %s %s" % (self.name,local,remote)
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
        self.minutes=minutes
        self.name=name

        self.local_script=[]
        self.remote_script=[]

        self.ConfigLocalScript()
        self.ConfigRemoteScript()
        fname="%s/mpiexec.sh" % self.local_dir
        with open(fname,'w') as f:
            f.writelines("\n".join(self.remote_script))
        os.chmod(fname,775)    
            
        fname="%s/execute_job.sh" % self.local_dir
        with open(fname,'w') as f:
            f.writelines("\n".join(self.local_script))
        os.chmod(fname,775)    
    def ConfigLocalScript(self):
        self.local_script.append("#!/bin/bash")
        #self.local_script.append("cd %s" % os.path.abspath(self.local_dir))
        self.local_script.append("set -x")
        self.local_script.append("logfile=execute_job.sh.log")
        self.local_script.append("exec > $logfile 2>&1")

        self.cluster.StartCmd(self.local_script)
        self.ConfigNodesInfo()
        self.PackAndSubmitJob()
        self.ConfigWatchScript()

    def ConfigWatchScript(self):
        seconds=self.minutes*60
        cmd="sleep %s" % seconds
        self.local_script.append(cmd)
        cmd=["let count=0",
             "while [ ${count} -lt 3 ]",
             "do",
             "pid=$(starcluster sshmaster %s 'pidof mpiexec')" % self.cluster.name,
             'if [ "X$pid" == "X" ]',
             "then",
             "let count=$count+1",
             "fi",
             "sleep 20",
             "done"
            ]
        self.local_script.append("\n".join(cmd))
        self.cluster.GetCmd(self.local_script,self.remote_dir,'./')
        self.cluster.TerminateCmd(self.local_script)

    def PackAndSubmitJob(self):
        job_tar="%s.tar.gz" % self.name
        self.local_script.append('tar_opt="--exclude-vcs --exclude-backups --exclude=.tar --exclude=.gz --exclude=.tgz --exclude=.bz  --exclude=.Z --exclude=.zip --exclude=.rar --exclude=.7z"')
        self.local_script.append("tar ${tar_opt} -czf %s ." % job_tar)
        cmd='"mkdir -p %s"' % config.cluster_jobs_root
        self.cluster.RunCmd(self.local_script,cmd)
        self.cluster.PutCmd(self.local_script,job_tar,config.cluster_jobs_root)

        cmd="rm -rf %s " % job_tar
        self.local_script.append(cmd)

        cmd="master_node=$(grep 'master\s\+running' %s.info.list | awk '{print $4}')"  % self.cluster.name
        self.local_script.append(cmd)

        cmd='"cd %s && tar -xf %s -C %s && rm %s"' %(config.cluster_jobs_root,job_tar,self.remote_dir,job_tar)
        self.cluster.RunCmd(self.local_script,cmd)
        cmd="'cd %s && nohup ./mpiexec.sh >nohup.out 2>&1   </dev/null &'" % self.remote_dir
        cmd='"sh -c %s "' % cmd
        cmd="ssh -i %s %s@${master_node} %s" %(config.cluster_key_file,self.cluster.user,cmd)
        #ssh -i $key_file ${user}@${master_node} "sh -c 'cd ${job_dir} && nohup ./mpiexec.sh >nohup.out 2>&1     </dev/null &' "
        self.local_script.append(cmd)
    
    def ConfigRemoteScript(self):
        self.remote_script.append("#!/bin/bash")
        self.remote_script.append("logfile=mpiexec.sh.log")
        self.remote_script.append("exec > $logfile 2>&1")
        self.remote_script.append("source %s" % config.cluster_env_setup)

        np=self.cluster.GetCores()
        args=["mpiexec",
        "--output-filename config.json.log",
        "-n %s" % np,
        "--hostfile mpi-hosts",
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
        "-x PATH=$PATH","-stdin all",
        "simpit"]
        args.append("-e config.json.mac")
        args.append("&")
        args =" ".join(args)
        self.remote_script.append(args)
        
        cmd="pid=$(pidof mpiexec)"
        self.remote_script.append(cmd)
        seconds=self.minutes*60
        cmd="sleep %s" % seconds
        self.remote_script.append(cmd)
        cmd="kill -s 12 ${pid}"
        self.remote_script.append(cmd)
        cmd="wait ${pid}"
        self.remote_script.append(cmd)
        return True
    
    def ConfigNodesInfo(self):
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
