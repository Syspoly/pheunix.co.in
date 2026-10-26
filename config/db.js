import mongoose from 'mongoose';

let isMongooseConnected = false;

export const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/pheunix';
  
  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 2000 // Quick timeout to fallback if no local daemon
    });
    isMongooseConnected = true;
    console.log(`[Database] MongoDB Connected via Mongoose: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`[Database] Local MongoDB not detected (${error.message}).`);
    console.log(`[Database] Activating robust persistent JSON dataStore fallback engine for full MERN functionality.`);
    isMongooseConnected = false;
    return false;
  }
};

export const getDbStatus = () => {
  return {
    isMongooseConnected,
    mode: isMongooseConnected ? 'MongoDB (Mongoose)' : 'Local Persistent Engine (Active Standby)'
  };
};
