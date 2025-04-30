import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import { AppDataSource } from './data-source';
import app from './app';

// Load environment variables
dotenv.config();

// Validate required environment variables
function validateEnv() {
  const requiredEnvVars = ['PORT'];
  const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

  if (missingEnvVars.length > 0) {
    console.error('Error: Missing required environment variables:');
    missingEnvVars.forEach(envVar => console.error(`- ${envVar}`));
    process.exit(1);
  }

  // Validate PORT is a valid number
  const port = parseInt(process.env.PORT!, 10);
  if (isNaN(port) || port <= 0 || port > 65535) {
    console.error('Error: PORT must be a valid number between 1 and 65535');
    process.exit(1);
  }
}

validateEnv();

const PORT = parseInt(process.env.PORT!, 10);

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err: Error) => {
    console.error('Error during Data Source initialization:', err);
    process.exit(1);
  });
