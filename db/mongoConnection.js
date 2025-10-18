import mongoose from 'mongoose';
import { MONGO_URI } from '../config/env.js';

const connectDB = async () => {
    try {
        console.log('🔍 Attempting MongoDB connection...');
        console.log('URI format:', MONGO_URI?.substring(0, 30) + '...');
        
        await mongoose.connect(MONGO_URI, {
            serverSelectionTimeoutMS: 15000, // 15 seconds
            socketTimeoutMS: 45000, // 45 seconds
            maxPoolSize: 10, // Maintain up to 10 socket connections
            minPoolSize: 5, // Maintain a minimum of 5 socket connections
            maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
            connectTimeoutMS: 15000, // Give up initial connection after 15 seconds
            retryWrites: true,
            w: 'majority'
        });
        console.log(`✅ Database connected successfully`.cyan.underline.bold);
    } catch (error) {
        console.error(`❌ MongoDB connection error:`.red, error.message);
        console.error('Error details:', {
            name: error.name,
            code: error.code,
            reason: error.reason?.type || 'Unknown'
        });
        // Don't exit process in serverless - just log the error
        console.error('⚠️ Database connection failed, but continuing...');
    }
}

export default connectDB;