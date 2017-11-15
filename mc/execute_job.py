#run long time tasks.
#https://fernandofreitasalves.com/executing-time-consuming-tasks-asynchronously-with-django-and-celery/

import subprocess
import os
import stat

INSTANCE_TYPES= {
        '4Core': 'c4.xlarge',
        '8Core': 'c4.2xlarge',
        '16Core': 'c4.4xlarge',
        '36Core': 'c4.8xlarge',
        }

INSTANCE_CORES= {
        'c4.xlarge': 4,
        'c4.2xlarge': 8,
        'c4.4xlarge': 16,
        'c4.8xlarge': 36,
        }

local_jobs='./data/mc/jobs'
remote_jobs='/home/www/jobs'

def run(job):
    #start cluster

    #config cluster, update...

    #config job

    #submit job

    #watch cluster

    #get job result

    #terminate cluster.
    return True

class Cluster:
    def __init__(self,name,instance,nodes):
        self.instance=INSTANCE_TYPES[instance]
        self.nodes=nodes
        self.name=name
        self.template="dose"
        self.user="scadmin"
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
        return int(self.nodes) * int(INSTANCE_CORES[self.instance])

class JobScript:
    def __init__(self,name,instance,nodes,minutes):
        self.cluster=Cluster(name,instance,nodes)
        self.remote_dir= "%s/%s" % (remote_jobs,name)
        self.local_dir= "%s/%s"  % (local_jobs,name)
        self.minutes=minutes
        self.name=name

        self.local_script=[]
        self.remote_script=[]

        self.ConfigLocalScript()
        self.ConfigRemoteScript()
        fname="%s/mpiexec.sh" % self.local_dir
        with open(fname,'w') as f:
            f.writelines("\n".join(self.remote_script))
        os.chmod(fname,stat.S_IXOTH+stat.S_IRWXG+stat.S_IRWXU)    
            
        fname="%s/execute_job.sh" % self.local_dir
        with open(fname,'w') as f:
            f.writelines("\n".join(self.local_script))
        os.chmod(fname,stat.S_IXOTH+stat.S_IRWXG+stat.S_IRWXU)    
    def ConfigLocalScript(self):
        self.local_script.append("#!/bin/bash")
        self.local_script.append("cd %s" % self.local_dir)

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
             "pid=$(starcluster sshmaster %s pidof mpiexec)" % self.cluster.name,
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
        cmd='"mkdir -p %s"' % remote_jobs
        self.cluster.RunCmd(self.local_script,cmd)
        self.cluster.PutCmd(self.local_script,job_tar,remote_jobs)

        cmd="rm -rf %s " % job_tar
        self.local_script.append(cmd)

        cmd="master_node=$(grep 'master\s\+running' %s.info.list | awk '{print $4}')"  % self.cluster.name
        self.local_script.append(cmd)

        cmd='"cd %s && tar -xf %s -C %s && rm %s"' %(remote_jobs,job_tar,self.remote_dir,job_tar)
        self.cluster.RunCmd(self.local_script,cmd)
        cmd="'cd %s && nohup ./mpiexec.sh >nohup.out 2>&1   </dev/null &'" % self.remote_dir
        cmd='"sh -c %s "' % cmd
        key_file='/home/www/key.key'
        cmd="ssh -i %s %s@${master_node} %s" %(key_file,self.cluster.user,cmd)
        #ssh -i $key_file ${user}@${master_node} "sh -c 'cd ${job_dir} && nohup ./mpiexec.sh >nohup.out 2>&1     </dev/null &' "
        self.local_script.append(cmd)
    
    def ConfigRemoteScript(self):
        self.remote_script.append("#!/bin/bash")
        self.remote_script.append("source /home/%s/opt/simpit/bin/simpit.sh" % self.cluster.user)

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
