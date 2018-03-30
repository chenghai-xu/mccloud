#!/bin/bash
python manage.py collectstatic
#sudo systemctl restart supervisor
sudo supervisorctl restart celery
sudo systemctl restart apache2.service
