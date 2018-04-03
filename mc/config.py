import os
prefix = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
prefix =  '%s/data.mccloud' % os.path.dirname(prefix)
data_root='%s/mc' % prefix
projects_root='%s/mc/projects' % prefix
jobs_root='%s/mc/jobs' % prefix
protected_root='%s/protected' %prefix

cluster_template='template.tsimpit'
cluster_user='scadmin'
cluster_jobs_root='/home/%s/jobs' % cluster_user

cluster_geant4_env='/opt/geant4.10.02.p03/bin/geant4.sh'
local_geant4_env='/opt/geant4.10.02.p03/bin/geant4.sh'

cluster_simpit='/home/%s/opt/tsimpit' % cluster_user
cluster_simpit_bin='%s/bin' % cluster_simpit
local_simpit='/opt/tsimpit/'
local_simpit_bin='%s/bin' % local_simpit



cluster_key_file='/home/xuchd/.ssh/starcluster.cn-northwest-1.rsa'
Instance_Price={'4Core':8,'8Core':16, '16Core':32, '36Core':72}

Instance_Index = { '4Core': 1, '8Core': 2, '16Core': 3, '36Core': 4}
INSTANCE_TYPE_CHOICES = (
    ('4Core', '4Core'),
    ('8Core', '8Core'),
    ('16Core', '16Core'),
    ('36Core', '36Core'),
)

AWS_INSTANCE_TYPES= {
        '4Core': 'c4.xlarge',
        '8Core': 'c4.2xlarge',
        '16Core': 'c4.4xlarge',
        '36Core': 'c4.8xlarge',
        }

AWS_INSTANCE_CORES= {
        'c4.xlarge': 4,
        'c4.2xlarge': 8,
        'c4.4xlarge': 16,
        'c4.8xlarge': 36,
        }


JOB_STATUS_CHOICES=(
    ('UNDO', 'UNDO'),
    ('DOING', 'DOING'),
    ('DONE', 'DONE'),
)

MAT_TYPE_ELE = 'ELE'
MAT_TYPE_MIX = 'MIX'
MAT_TYPE_CHOICES = (
    (MAT_TYPE_ELE, 'Element'),
    (MAT_TYPE_MIX, 'Mixture'),
)

SOLID_TYPE_BOX = 'box'
SOLID_TYPE_CYLINDER = 'tube'
SOLID_TYPE_CHOICES = (
    (SOLID_TYPE_BOX, 'box'),
    (SOLID_TYPE_CYLINDER, 'tube'),
)

