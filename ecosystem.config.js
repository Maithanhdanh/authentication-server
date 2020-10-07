module.exports = {
  apps : [{
    script: 'index.js',
    watch: '.'
  }, {
    script: './service-worker/',
    watch: ['./service-worker']
  },{
name: 'Authenication server',
autorestart: true,
watch: true,
env: {
      NODE_ENV: 'production'
    },
},
],

  deploy : {
    production : {
      user : 'ubuntu',
      host : '13.212.81.27',
      ref  : 'origin/master',
      repo : 'https://github.com/Maithanhdanh/authentication-server.git',
      path : '/authentication-server',
      'pre-deploy-local': '',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': '',
env: {
                NODE_ENV: 'production',
PORT: '5000',
SECRET: 'Vuslacontrai42109',
SESSION_SECRET: 'Dantisdeptrai',
ACCESS_TOKEN: 'Vuslacontrai42109',
REFRESH_TOKEN: 'Vusdeophailacongai42109',
AUDIENCE: 'http://authenticationServer',
ISSUER: 'Dantis',
PORT: '5000'
            }
    }
  }
};
