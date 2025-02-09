sudo ln -s /etc/nginx/sites-available/invoices.zaitomedicalcentre.co.ke /etc/nginx/sites-enabled/invoices.zaitomedicalcentre.co.ke

docker rm -f redis_zaito 

docker compose up -d --build

sudo systemctl reload nginx