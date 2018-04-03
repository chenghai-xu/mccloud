sudo apt install rabbitmq-server
sudo rabbitmqctl add_user xuch 'hg7y82hl'
sudo rabbitmqctl add_vhost xuch_vhost
sudo rabbitmqctl set_user_tags xuch xuch_tag
sudo rabbitmqctl set_permissions -p xuch_vhost xuch ".*" ".*" ".*"
sudo rabbitmqctl start
