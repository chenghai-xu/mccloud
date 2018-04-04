#!/bin/bash
python manage.py collectstatic --noinput
sudo systemctl restart postgresql
sudo systemctl restart supervisor
sudo supervisorctl restart celery
sudo systemctl restart apache2.service
