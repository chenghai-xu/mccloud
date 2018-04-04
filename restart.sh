#!/bin/bash
git pull
source /opt/mccloud_py3env/bin/activate
python manage.py collectstatic --noinput
sudo systemctl restart postgresql
sudo systemctl restart supervisor
sudo supervisorctl restart celery
sudo systemctl restart apache2.service
