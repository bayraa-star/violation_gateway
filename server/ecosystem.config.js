module.exports = {
  apps: [
    {
      name: "server",
      script: "./www/server.js",
      instances: 4, // Limit to 4 instances (or any desired number)
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
        MONGO_URI: process.env.MONGO_URI,
        DBNAME: "invb",
        PORT: process.env.PORT || 5000,
        JWT_SECRET: process.env.JWT_SECRET,
      },
    },
  ],
};
