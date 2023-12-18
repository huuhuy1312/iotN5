module.exports = {
  apps: [
    {
      exec_mode: "cluster",
      instances: "1",
      name: "PageChamCong",
      script: "node_modules/next/dist/bin/next",
      args: "start",
      exec_mode: "cluster",
      env_development: {
        PORT: 3001,
        NODE_ENV: "development"
      },
      env_production: {
        PORT: 8000,
        NODE_ENV: "production"
      }
    }
  ]
}
