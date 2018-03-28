#!/bin/bash
#1. install apache2 dev 
#2. download mod_xsendfile
#3. compile and install mod_xsendfile
#4. config apache

#mod_xsendfile URL
#https://tn123.org/mod_xsendfile/
sudo apt install apache2-dev
wget https://tn123.org/mod_xsendfile/mod_xsendfile.c
sudo apxs -cia mod_xsendfile.c

#4
