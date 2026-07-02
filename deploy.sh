#!/bin/bash
IP="95.217.182.116"
KEY="/home/ahror/.ssh/hetzner_ed25519"

echo "Building local React app..."
npm run build

echo "Setting up remote server..."
ssh -o StrictHostKeyChecking=accept-new -i $KEY root@$IP << 'REMOTE'
  apt-get update
  apt-get install -y nginx rsync python3-venv python3-pip
  mkdir -p /var/www/timepiecelifestyle.com
  mkdir -p /opt/tpls_backend
REMOTE

echo "Syncing files to server..."
rsync -avz -e "ssh -i $KEY" dist/ root@$IP:/var/www/timepiecelifestyle.com/

echo "Syncing backend to server..."
rsync -avz -e "ssh -i $KEY" --exclude 'venv' --exclude 'db.sqlite3' backend/ root@$IP:/opt/tpls_backend/backend/
rsync -avz -e "ssh -i $KEY" --exclude 'venv' forexfactory-scraper-2.0.0/ root@$IP:/opt/tpls_backend/forexfactory-scraper-2.0.0/
rsync -avz -e "ssh -i $KEY" telegram_scraper.py root@$IP:/opt/tpls_backend/

echo "Configuring Nginx and Backend..."
ssh -i $KEY root@$IP << 'REMOTE2'
cat << 'NGINX' > /etc/nginx/sites-available/timepiecelifestyle.com
server {
    listen 80;
    server_name timepiecelifestyle.com www.timepiecelifestyle.com 95.217.182.116;

    root /var/www/timepiecelifestyle.com;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:8000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
NGINX
ln -sf /etc/nginx/sites-available/timepiecelifestyle.com /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
systemctl restart nginx

echo "Setting up Python environment and starting backend..."
cd /opt/tpls_backend/backend
python3 -m venv venv
source venv/bin/activate
pip install django djangorestframework django-cors-headers requests beautifulsoup4 httpx yfinance pandas numpy
python manage.py migrate

pkill -f "runserver 8000" || true
pkill -f "telegram_scraper.py" || true

nohup python manage.py runserver 8000 > django.log 2>&1 &
cd /opt/tpls_backend
nohup backend/venv/bin/python telegram_scraper.py > telegram_scraper.log 2>&1 &

REMOTE2

echo "Deployment complete!"
