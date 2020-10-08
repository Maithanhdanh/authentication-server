module.exports = {
    apps: [
        {
            name: "app-name",
            script: "./index.js",
            cwd: __dirname, // path-to-project
            instances: 1, // default 1
            autorestart: true,
            exec_mode: "cluster", // allow scale up app
            watch: false,
            env: {
                NODE_ENV: "production",
            },
        },
    ],

    deploy: {
        production: {
            user: "ubuntu",
            host: "13.212.81.27",
            ref: "origin/master",
            repo: "https://github.com/Maithanhdanh/authentication-server.git",
            path: "/authentication-server",
            "pre-deploy-local": "",
            "post-deploy":
                "npm install && pm2 reload ecosystem.config.js --env production",
            "pre-setup": "",
            env: {
                NODE_ENV: "production",
                PORT: "5000",
                SECRET: "Vuslacontrai42109",
                SESSION_SECRET: "Dantisdeptrai",
                ACCESS_TOKEN: "Vuslacontrai42109",
                REFRESH_TOKEN: "Vusdeophailacongai42109",
                AUDIENCE: "http://authenticationServer",
                ISSUER: "Dantis",
		MONGODB_URL:"mongodb://root:dantisvus@localhost:27017/authentication?authSource=admin",
            },
        },
    },
}
