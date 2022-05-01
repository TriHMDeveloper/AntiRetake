import { config } from 'dotenv';
import mongoose from 'mongoose';
import { app } from './app';

config();

const port = process.env.PORT || 8080;
const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;
const dbName = process.env.DB_NAME;
const mongoUri = `mongodb://${dbHost}:${dbPort}/${dbName}`;
// const mongoUriBuBuoi =
//   'mongodb+srv://Huyxaki:xaki123@Cluster0.huvfc.mongodb.net/AntiRetake?retryWrites=true&w=majority';
const mongoUriBuBuoi =
  'mongodb+srv://AntiRetake:AntiRetake26042022@antiretakecluster.fsw0n.mongodb.net/AntiRetake?retryWrites=true&w=majority';

const gracefulExit = () => {
  mongoose.connection.close(() => {
    console.log('Mongoose disconnected on app termination');
    process.exit(0);
  });
};

const start = async () => {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(mongoUriBuBuoi);
  console.log('MongoDB connected');

  app.listen(port, () => {
    console.log(`Listen on port ${port}`);
  });

  process.on('SIGINT', gracefulExit).on('SIGTERM', gracefulExit);
};

start();
