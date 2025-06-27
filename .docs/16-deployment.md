# 🚀 Deployment Guide

Panduan lengkap untuk deploy KoalaStore WhatsApp Bot ke production environment.

## 🎯 Overview

Dokumentasi ini menjelaskan berbagai cara deploy bot ke production, mulai dari VPS sederhana hingga cloud infrastructure yang scalable.

## 🏗️ Deployment Options

### 1. VPS/Dedicated Server
- **Cost:** 💰 Low
- **Complexity:** 🔧 Medium  
- **Scalability:** 📈 Limited
- **Best for:** Small to medium stores

### 2. Cloud Platforms (AWS, GCP, Azure)
- **Cost:** 💰💰 Medium  
- **Complexity:** 🔧🔧 High
- **Scalability:** 📈📈📈 High
- **Best for:** Large stores, enterprise

### 3. Container Platforms (Docker)
- **Cost:** 💰💰 Medium
- **Complexity:** 🔧🔧 Medium
- **Scalability:** 📈📈 High  
- **Best for:** Modern DevOps workflow

### 4. Platform as a Service (Heroku, Railway)
- **Cost:** 💰💰💰 High
- **Complexity:** 🔧 Low
- **Scalability:** 📈📈 High
- **Best for:** Quick deployment, prototyping

## 🖥️ VPS Deployment

### Requirements

**Minimum Specs:**
- CPU: 1 vCore
- RAM: 1GB
- Storage: 20GB SSD
- Bandwidth: 1TB/month
- OS: Ubuntu 20.04+ / CentOS 8+

**Recommended Specs:**
- CPU: 2 vCore
- RAM: 2GB
- Storage: 40GB SSD
- Bandwidth: Unlimited
- OS: Ubuntu 22.04 LTS

### Step 1: Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# Install Git
sudo apt install git -y

# Create user for bot (optional but recommended)
sudo adduser koalabot
sudo usermod -aG sudo koalabot
```

### Step 2: Clone and Setup

```bash
# Switch to bot user
su - koalabot

# Clone repository
git clone https://github.com/yourusername/KoalaStore.git
cd KoalaStore

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
nano .env
```

### Step 3: Environment Configuration

```bash
# .env file content
NODE_ENV=production
OWNER_NUMBER=628123456789
BOT_NAME=KoalaStore Production Bot
STORE_NAME=Koala Store Official

# Database settings
DB_BACKUP_ENABLED=true
DB_BACKUP_INTERVAL=3600000  # 1 hour

# Security settings
RATE_LIMIT_ENABLED=true
MAX_REQUESTS_PER_MINUTE=30

# Logging
LOG_LEVEL=info
LOG_FILE=/var/log/koalastore/bot.log
```

### Step 4: PM2 Configuration

Create `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [{
    name: 'koalastore-bot',
    script: 'src/app.js',
    cwd: '/home/koalabot/KoalaStore',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/var/log/koalastore/error.log',
    out_file: '/var/log/koalastore/out.log',
    log_file: '/var/log/koalastore/combined.log',
    time: true,
    // Restart strategies
    min_uptime: '10s',
    max_restarts: 5,
    // Memory monitoring
    max_memory_restart: '500M'
  }]
};
```

### Step 5: Start Bot

```bash
# Create log directory
sudo mkdir -p /var/log/koalastore
sudo chown koalabot:koalabot /var/log/koalastore

# Start with PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Run the command that PM2 outputs

# Check status
pm2 status
pm2 logs koalastore-bot
```

### Step 6: Setup Nginx (Optional)

```bash
# Install Nginx
sudo apt install nginx -y

# Create Nginx config
sudo nano /etc/nginx/sites-available/koalastore
```

Nginx config:

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/koalastore /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 7: SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com

# Test auto-renewal
sudo certbot renew --dry-run
```

## 🐳 Docker Deployment

### Dockerfile

```dockerfile
# Multi-stage build for optimal image size
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

FROM node:20-alpine AS runner

# Create app user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S koalabot -u 1001

# Set working directory
WORKDIR /app

# Copy built application
COPY --from=builder /app/node_modules ./node_modules
COPY . .

# Create necessary directories
RUN mkdir -p database gambar logs sessionn
RUN chown -R koalabot:nodejs /app

# Switch to non-root user
USER koalabot

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js

# Start application
CMD ["node", "src/app.js"]
```

### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  koalastore-bot:
    build: .
    container_name: koalastore-bot
    restart: unless-stopped
    ports:
      - "3000:3000"
    volumes:
      - ./database:/app/database
      - ./gambar:/app/gambar
      - ./sessionn:/app/sessionn
      - ./logs:/app/logs
    environment:
      - NODE_ENV=production
      - OWNER_NUMBER=628123456789
      - BOT_NAME=KoalaStore Bot
    networks:
      - koalastore-network

  nginx:
    image: nginx:alpine
    container_name: nginx-proxy
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - koalastore-bot
    networks:
      - koalastore-network

networks:
  koalastore-network:
    driver: bridge

volumes:
  database:
  sessionn:
  logs:
```

### Deployment Commands

```bash
# Clone repository
git clone https://github.com/yourusername/KoalaStore.git
cd KoalaStore

# Create environment file
cp .env.example .env
nano .env

# Build and start containers
docker-compose up -d

# View logs
docker-compose logs -f koalastore-bot

# Update deployment
git pull
docker-compose down
docker-compose build
docker-compose up -d
```

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '20'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Build
      run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Deploy to VPS
      uses: appleboy/ssh-action@v0.1.5
      with:
        host: ${{ secrets.HOST }}
        username: ${{ secrets.USERNAME }}
        key: ${{ secrets.PRIVATE_KEY }}
        script: |
          cd /home/koalabot/KoalaStore
          git pull origin main
          npm install
          pm2 restart koalastore-bot
          pm2 save

  deploy-docker:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Build and push Docker image
      uses: docker/build-push-action@v3
      with:
        context: .
        push: true
        tags: |
          koalastore/bot:latest
          koalastore/bot:${{ github.sha }}
    
    - name: Deploy to production
      run: |
        # Deploy to your container registry
        kubectl set image deployment/koalastore-bot koalastore-bot=koalastore/bot:${{ github.sha }}
```

## 📊 Monitoring & Logging

### Health Check Endpoint

```javascript
// healthcheck.js
import express from 'express';
import fs from 'fs/promises';

const app = express();
const PORT = process.env.HEALTH_CHECK_PORT || 3001;

app.get('/health', async (req, res) => {
  try {
    // Check if bot is running
    const botStatus = global.botInstance?.client?.user ? 'connected' : 'disconnected';
    
    // Check database accessibility
    await fs.access('./database/list-produk.json');
    
    // Check memory usage
    const memUsage = process.memoryUsage();
    const uptime = process.uptime();
    
    res.json({
      status: 'healthy',
      botStatus,
      uptime: Math.floor(uptime),
      memory: {
        used: Math.round(memUsage.heapUsed / 1024 / 1024),
        total: Math.round(memUsage.heapTotal / 1024 / 1024)
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

app.listen(PORT, () => {
  console.log(`Health check server running on port ${PORT}`);
});
```

### Monitoring with PM2

```bash
# Install PM2 monitoring
pm2 install pm2-logrotate

# Configure log rotation
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 30
pm2 set pm2-logrotate:compress true

# Monitor resources
pm2 monit

# Web monitoring (optional)
pm2 web
```

## 🔐 Security Best Practices

### Server Security

```bash
# Setup firewall
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443

# Disable root login
sudo nano /etc/ssh/sshd_config
# Set: PermitRootLogin no
sudo systemctl restart ssh

# Setup fail2ban
sudo apt install fail2ban -y
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### Environment Security

```bash
# Secure environment file
chmod 600 .env
chown koalabot:koalabot .env

# Secure session files
chmod 700 sessionn/
chown -R koalabot:koalabot sessionn/

# Setup log rotation
sudo nano /etc/logrotate.d/koalastore
```

Logrotate config:

```
/var/log/koalastore/*.log {
    daily
    rotate 30
    compress
    delaycompress
    missingok
    notifempty
    create 0644 koalabot koalabot
    postrotate
        pm2 reload koalastore-bot
    endscript
}
```

## 🔄 Backup Strategy

### Database Backup Script

```bash
#!/bin/bash
# backup.sh

BACKUP_DIR="/home/koalabot/backups"
DATE=$(date +%Y%m%d_%H%M%S)
SOURCE_DIR="/home/koalabot/KoalaStore/database"

# Create backup directory
mkdir -p $BACKUP_DIR

# Create backup
tar -czf "$BACKUP_DIR/database_backup_$DATE.tar.gz" -C $SOURCE_DIR .

# Keep only last 30 backups
find $BACKUP_DIR -name "database_backup_*.tar.gz" -mtime +30 -delete

# Upload to cloud storage (optional)
# aws s3 cp "$BACKUP_DIR/database_backup_$DATE.tar.gz" s3://your-backup-bucket/
```

```bash
# Add to crontab
crontab -e
# Add: 0 2 * * * /home/koalabot/backup.sh
```

## 🚨 Troubleshooting

### Common Issues

#### Bot Disconnects Frequently

```bash
# Check memory usage
pm2 show koalastore-bot

# Increase memory limit
pm2 delete koalastore-bot
pm2 start ecosystem.config.js --max-memory-restart 1G
```

#### Database Permission Errors

```bash
# Fix permissions
sudo chown -R koalabot:koalabot /home/koalabot/KoalaStore/database
sudo chmod 755 /home/koalabot/KoalaStore/database
sudo chmod 644 /home/koalabot/KoalaStore/database/*.json
```

#### SSL Certificate Issues

```bash
# Renew certificate
sudo certbot renew --force-renewal
sudo systemctl reload nginx
```

## 📈 Scaling Considerations

### Horizontal Scaling

For multiple bot instances:

```javascript
// Use Redis for session sharing
import Redis from 'redis';

const redis = Redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT
});

// Shared session storage
class SharedSessionManager {
  async saveSession(sessionId, data) {
    await redis.setex(`session:${sessionId}`, 3600, JSON.stringify(data));
  }
  
  async loadSession(sessionId) {
    const data = await redis.get(`session:${sessionId}`);
    return data ? JSON.parse(data) : null;
  }
}
```

### Database Scaling

```javascript
// Use PostgreSQL for better scalability
import pg from 'pg';

const pool = new pg.Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

## 📚 Related Documentation

- **[Configuration](./03-configuration.md)** - Environment setup
- **[Testing](./12-testing.md)** - Pre-deployment testing
- **[Troubleshooting](./14-troubleshooting.md)** - Common issues
- **[Contributing](./10-contributing.md)** - Development workflow

---

**🚀 Deployment Checklist:**
- [ ] Server requirements met
- [ ] Environment variables configured
- [ ] SSL certificate installed
- [ ] Monitoring setup
- [ ] Backup strategy implemented
- [ ] Security measures applied
- [ ] Health checks configured
- [ ] Logging properly setup 