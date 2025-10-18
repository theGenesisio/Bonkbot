import mongoose from 'mongoose';
import { MONGO_URI } from '../config/env.js';

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            serverSelectionTimeoutMS: 30000, // 30 seconds
            socketTimeoutMS: 45000, // 45 seconds
            bufferCommands: false, // Disable mongoose buffering
            bufferMaxEntries: 0, // Disable mongoose buffering
            maxPoolSize: 10, // Maintain up to 10 socket connections
            minPoolSize: 5, // Maintain a minimum of 5 socket connections
            maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
            connectTimeoutMS: 30000, // Give up initial connection after 30 seconds
        });
        console.log(`Database connected successfully`.cyan.underline.bold);
    } catch (error) {
        console.error(`MongoDB connection error:`.red, error);
        // Don't exit process in serverless - just log the error
        console.error('⚠️ Database connection failed, but continuing...');
    }
}

export default connectDB;