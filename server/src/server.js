import app from './app.js';
import config from './config/index.js';
import { connectDB } from './config/db.js';

const startServer = async () => {
  // Connect to Database
  await connectDB();

  // Listen
  app.listen(config.port, () => {
    console.log(`HIKARI server is running in ${process.env.NODE_ENV || 'development'} mode on port ${config.port}`);
    console.log(`Visit http://localhost:${config.port}/api/health for server status`);
  });
};

startServer(); // reload triggers
