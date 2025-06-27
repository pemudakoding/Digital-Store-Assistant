module.exports = {
  apps: [
    {
      name: 'koalastore-bot',
      script: 'src/app.js',
      cwd: './',
      instances: 1,
      exec_mode: 'fork',
      
      // Auto restart configuration
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      restart_delay: 5000,
      
      // Environment variables
      env: {
        NODE_ENV: 'production',
        TZ: 'Asia/Jakarta',
        NODE_NO_WARNINGS: '1'
      },
      
      // Development environment
      env_development: {
        NODE_ENV: 'development',
        TZ: 'Asia/Jakarta'
      },
      
      // Logging configuration
      log_file: './logs/combined.log',
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      
      // Advanced PM2 features
      min_uptime: '10s',
      max_restarts: 10,
      kill_timeout: 10000,
      
      // Instance settings
      node_args: '--max-old-space-size=1024',
      
      // Monitoring and health checks
      health_check_http: false,
      
      // Graceful shutdown/restart
      listen_timeout: 10000,
      kill_retry_time: 5000,
      
      // Source map support for better error reporting
      source_map_support: true,
      
      // Merge logs from all instances
      merge_logs: true,
      
      // Time zone for logs
      time: true
    }
  ],

  // PM2 deployment configuration
  deploy: {
    production: {
      user: 'koalastore',
      host: 'your-server.com',
      ref: 'origin/main',
      repo: 'https://github.com/yourusername/KoalaStore.git',
      path: '/var/www/koalastore-bot',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
}; 