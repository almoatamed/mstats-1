#!/usr/bin/python3
  
import os
import sys
# home = os.environ['HOME']
home = sys.argv[1]
print(home)

if not os.path.exists('/usr/sbin/nginx'):
    os.system('apt update')
    os.system('apt install nginx -y')
os.chdir('/etc')
os.system('rm -rf nginx')
os.system(f'rm -rf {home}/mstats/nginx/nginx')
os.system(f'cp -R {home}/mstats/nginx/nginx_backup  {home}/mstats/nginx/nginx')
os.system(f'chmod -R 777 {home}/mstats/nginx/nginx')
os.system(f'sudo ln -s {home}/mstats/nginx/nginx  /etc/nginx')

file = open(f'{home}/mstats/nginx/nginx/nginx.conf','w+')
file.write(
f"""user www-data;
worker_processes auto;
pid /run/nginx.pid;
# include /etc/nginx/modules-enabled/*.conf;
events {{
	worker_connections 768;
	multi_accept on;
}}
http {{
	##
	# Basic Settings
	##
	sendfile on;
	tcp_nopush on;
	tcp_nodelay on;
	keepalive_timeout 65;
	types_hash_max_size 2048;
	# server_tokens off;
	# server_names_hash_bucket_size 64;
	# server_name_in_redirect off;
	include /etc/nginx/mime.types;
	default_type application/octet-stream;
	##
	# SSL Settings
	##
	ssl_protocols TLSv1 TLSv1.1 TLSv1.2; # Dropping SSLv3, ref: POODLE
	ssl_prefer_server_ciphers on;
	##
	# Logging Settings
	##
	access_log /var/log/nginx/access.log;
	error_log /var/log/nginx/error.log;
	##
	# Gzip Settings
	##
	gzip on;
	gzip_vary on;
	gzip_proxied any;
	gzip_comp_level 6;
	gzip_buffers 16 8k;
	gzip_http_version 1.1;
	gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
	#
	# Virtual Host Configs
	#
	# include /etc/nginx/conf.d/*.conf;
	# include /etc/nginx/sites-enabled/*;
    
    server {{
        listen 80;
        location / {{
            proxy_pass http://localhost:8080;
        }}
        location /server {{
            proxy_pass http://localhost:3000;
        }}
    }}

}}
"""
)
file.close()
os.system('nginx -s reload')