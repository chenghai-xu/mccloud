projects_root='./data/mc/projects'
jobs_root='./data/mc/jobs'
data_root='./data/mc'
cluster_template='dose'
cluster_user='scadmin'
cluster_jobs_root='/home/%s/jobs' % cluster_user
cluster_env_setup='/home/%s/opt/simpit/bin/simpit.sh' % cluster_user
Instance_Price={'4Core':8,'8Core':16, '16Core':32, '36Core':72}
cluster_key_file='/home/www/key.key'

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
    ('UNPAY', 'UNPAY'),
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

