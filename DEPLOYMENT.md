# 🚀 Deployment Guide

Guide for deploying your AI Interior Design Portal to production.

## 📋 Pre-Deployment Checklist

Before deploying to production, ensure:

- [ ] All features tested locally
- [ ] Environment variables configured
- [ ] Database migrations created
- [ ] Static files collected (Django)
- [ ] Frontend built for production
- [ ] Security settings reviewed
- [ ] HTTPS configured
- [ ] Domain name ready

---

## 🔒 Security Configuration

### Backend Security Updates

Update `backend/backend/settings.py`:

```python
# Production settings
DEBUG = False
ALLOWED_HOSTS = ['yourdomain.com', 'www.yourdomain.com']

# Security settings
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'

# HSTS settings
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
```

### Generate New Secret Key

```python
from django.core.management.utils import get_random_secret_key
print(get_random_secret_key())
```

Update `.env`:
```
SECRET_KEY=your-new-production-secret-key
DEBUG=False
```

---

## 🌐 Deployment Options

### Option 1: Railway (Recommended for Beginners)

#### Backend Deployment

1. **Install Railway CLI:**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login to Railway:**
   ```bash
   railway login
   ```

3. **Create new project:**
   ```bash
   cd backend
   railway init
   ```

4. **Add PostgreSQL:**
   ```bash
   railway add postgresql
   ```

5. **Set environment variables:**
   ```bash
   railway variables set SECRET_KEY="your-secret-key"
   railway variables set DEBUG="False"
   railway variables set ALLOWED_HOSTS="your-app.railway.app"
   ```

6. **Deploy:**
   ```bash
   railway up
   ```

#### Frontend Deployment

1. **Build frontend:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy to Railway:**
   ```bash
   railway init
   railway up
   ```

---

### Option 2: Heroku

#### Backend Deployment

1. **Create `Procfile` in backend:**
   ```
   web: gunicorn backend.wsgi --log-file -
   ```

2. **Install gunicorn:**
   ```bash
   pip install gunicorn
   pip freeze > requirements.txt
   ```

3. **Create Heroku app:**
   ```bash
   heroku create your-app-name
   heroku addons:create heroku-postgresql:hobby-dev
   ```

4. **Set environment variables:**
   ```bash
   heroku config:set SECRET_KEY="your-secret-key"
   heroku config:set DEBUG="False"
   heroku config:set ALLOWED_HOSTS="your-app.herokuapp.com"
   ```

5. **Deploy:**
   ```bash
   git push heroku main
   heroku run python manage.py migrate
   heroku run python manage.py createsuperuser
   ```

#### Frontend Deployment

Deploy to Vercel:

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   cd frontend
   vercel
   ```

3. **Set environment variable:**
   ```
   VITE_API_URL=https://your-backend.herokuapp.com/api
   ```

---

### Option 3: AWS (Advanced)

#### Backend on EC2

1. **Launch EC2 instance** (Ubuntu 22.04)

2. **SSH into instance:**
   ```bash
   ssh -i your-key.pem ubuntu@your-ip
   ```

3. **Install dependencies:**
   ```bash
   sudo apt update
   sudo apt install python3-pip python3-venv nginx postgresql
   ```

4. **Clone repository:**
   ```bash
   git clone your-repo-url
   cd backend
   ```

5. **Setup virtual environment:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   pip install gunicorn
   ```

6. **Configure PostgreSQL:**
   ```bash
   sudo -u postgres psql
   CREATE DATABASE interior_design_db;
   CREATE USER dbuser WITH PASSWORD 'password';
   GRANT ALL PRIVILEGES ON DATABASE interior_design_db TO dbuser;
   \q
   ```

7. **Run migrations:**
   ```bash
   python manage.py migrate
   python manage.py collectstatic
   ```

8. **Configure Gunicorn:**
   Create `/etc/systemd/system/gunicorn.service`:
   ```ini
   [Unit]
   Description=gunicorn daemon
   After=network.target

   [Service]
   User=ubuntu
   Group=www-data
   WorkingDirectory=/home/ubuntu/backend
   ExecStart=/home/ubuntu/backend/venv/bin/gunicorn \
             --workers 3 \
             --bind unix:/home/ubuntu/backend/backend.sock \
             backend.wsgi:application

   [Install]
   WantedBy=multi-user.target
   ```

9. **Start Gunicorn:**
   ```bash
   sudo systemctl start gunicorn
   sudo systemctl enable gunicorn
   ```

10. **Configure Nginx:**
    Create `/etc/nginx/sites-available/backend`:
    ```nginx
    server {
        listen 80;
        server_name your-domain.com;

        location = /favicon.ico { access_log off; log_not_found off; }
        
        location /static/ {
            root /home/ubuntu/backend;
        }

        location / {
            include proxy_params;
            proxy_pass http://unix:/home/ubuntu/backend/backend.sock;
        }
    }
    ```

11. **Enable site:**
    ```bash
    sudo ln -s /etc/nginx/sites-available/backend /etc/nginx/sites-enabled
    sudo nginx -t
    sudo systemctl restart nginx
    ```

#### Frontend on S3 + CloudFront

1. **Build frontend:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Create S3 bucket:**
   ```bash
   aws s3 mb s3://your-bucket-name
   ```

3. **Upload build:**
   ```bash
   aws s3 sync dist/ s3://your-bucket-name
   ```

4. **Configure bucket for static hosting**

5. **Create CloudFront distribution**

6. **Update DNS records**

---

### Option 4: DigitalOcean App Platform

#### Backend

1. **Create new app** on DigitalOcean

2. **Connect GitHub repository**

3. **Configure build settings:**
   - Build Command: `pip install -r requirements.txt`
   - Run Command: `gunicorn backend.wsgi`

4. **Add PostgreSQL database**

5. **Set environment variables**

6. **Deploy**

#### Frontend

1. **Create new static site**

2. **Connect repository**

3. **Configure:**
   - Build Command: `npm run build`
   - Output Directory: `dist`

4. **Set environment variables**

5. **Deploy**

---

## 🗄️ Database Migration

### From SQLite to PostgreSQL

1. **Dump data from SQLite:**
   ```bash
   python manage.py dumpdata > data.json
   ```

2. **Update database settings to PostgreSQL**

3. **Run migrations:**
   ```bash
   python manage.py migrate
   ```

4. **Load data:**
   ```bash
   python manage.py loaddata data.json
   ```

---

## 📊 Monitoring & Logging

### Backend Logging

Add to `settings.py`:

```python
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'ERROR',
            'class': 'logging.FileHandler',
            'filename': '/var/log/django/error.log',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file'],
            'level': 'ERROR',
            'propagate': True,
        },
    },
}
```

### Monitoring Tools

- **Sentry** - Error tracking
- **New Relic** - Performance monitoring
- **Datadog** - Infrastructure monitoring
- **LogRocket** - Frontend monitoring

---

## 🔄 CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy to Railway
        run: |
          npm install -g @railway/cli
          railway up
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Build and Deploy
        run: |
          cd frontend
          npm install
          npm run build
          npx vercel --prod
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
```

---

## 🔐 Environment Variables

### Production Environment Variables

**Backend (.env):**
```
SECRET_KEY=your-production-secret-key
DEBUG=False
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
DB_NAME=production_db
DB_USER=production_user
DB_PASSWORD=strong-password
DB_HOST=your-db-host
DB_PORT=5432
CORS_ALLOWED_ORIGINS=https://yourdomain.com
```

**Frontend (.env.production):**
```
VITE_API_URL=https://api.yourdomain.com/api
```

---

## 📈 Performance Optimization

### Backend

1. **Enable caching:**
   ```python
   CACHES = {
       'default': {
           'BACKEND': 'django.core.cache.backends.redis.RedisCache',
           'LOCATION': 'redis://127.0.0.1:6379/1',
       }
   }
   ```

2. **Database optimization:**
   - Add database indexes
   - Use select_related() and prefetch_related()
   - Enable connection pooling

3. **Use CDN for static files**

### Frontend

1. **Code splitting:**
   ```javascript
   const Dashboard = lazy(() => import('./pages/Dashboard'));
   ```

2. **Image optimization:**
   - Use WebP format
   - Lazy load images
   - Compress images

3. **Enable gzip compression**

---

## 🧪 Pre-Production Testing

1. **Load testing:**
   ```bash
   pip install locust
   locust -f locustfile.py
   ```

2. **Security scanning:**
   ```bash
   pip install bandit
   bandit -r backend/
   ```

3. **Dependency audit:**
   ```bash
   npm audit
   pip-audit
   ```

---

## 📱 SSL Certificate

### Using Let's Encrypt (Free)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Auto-renewal:
```bash
sudo certbot renew --dry-run
```

---

## 🔄 Backup Strategy

### Database Backups

```bash
# Automated daily backup
0 2 * * * pg_dump -U dbuser interior_design_db > /backups/db_$(date +\%Y\%m\%d).sql
```

### Application Backups

- Use Git for code versioning
- Backup environment variables securely
- Store media files in S3 or similar

---

## 📊 Post-Deployment Checklist

- [ ] Application accessible via HTTPS
- [ ] Database migrations applied
- [ ] Static files serving correctly
- [ ] CORS configured properly
- [ ] Environment variables set
- [ ] SSL certificate installed
- [ ] Monitoring tools configured
- [ ] Backup system in place
- [ ] Error logging working
- [ ] Performance acceptable
- [ ] Security headers configured
- [ ] Admin panel accessible
- [ ] API endpoints responding
- [ ] Frontend connecting to backend

---

## 🆘 Troubleshooting

### Common Issues

**502 Bad Gateway:**
- Check Gunicorn is running
- Verify Nginx configuration
- Check application logs

**Database Connection Error:**
- Verify database credentials
- Check database is running
- Verify network connectivity

**Static Files Not Loading:**
- Run `collectstatic`
- Check Nginx static file configuration
- Verify file permissions

**CORS Errors:**
- Update CORS_ALLOWED_ORIGINS
- Check frontend API URL
- Verify credentials setting

---

## 📚 Additional Resources

- [Django Deployment Checklist](https://docs.djangoproject.com/en/stable/howto/deployment/checklist/)
- [Vite Production Build](https://vitejs.dev/guide/build.html)
- [Railway Documentation](https://docs.railway.app/)
- [Heroku Django Guide](https://devcenter.heroku.com/articles/django-app-configuration)

---

**Remember:** Always test in a staging environment before deploying to production!

Good luck with your deployment! 🚀
