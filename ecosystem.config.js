module.exports = {
  apps : [{
      name: "botwareg4",
      script: "server.js", 
      autorestart: true,
      exec_mode  : "fork"
    },
  ], 
};
