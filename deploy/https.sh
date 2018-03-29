#!/bin/bash
#To config https in apache2
#Reference:
#http://www.cnblogs.com/best-jobs/p/3298258.html
#https://help.ubuntu.com/lts/serverguide/httpd.html#https-configuration

#generate key
openssl genrsa 1024 > server.key
openssl req -new -key server.key > server.csr
openssl req -x509 -days 365 -key server.key -in server.csr > server.crt

#config apache2
sudo a2enmod ssl
sudo a2ensite default-ssl
sudo systemctl restart apache2.service


#redirect http to https
#https://wiki.apache.org/httpd/RedirectSSL

#ssl import error with anacond python and mod_wsgi
#Switch to system python
#https://stackoverflow.com/questions/45908938/python-cant-connect-to-https-url-because-the-ssl-module-is-not-available?noredirect=1
