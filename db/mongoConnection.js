import mongoose from 'mongoose';
import { MONGO_URI } from '../config/env.js';
const connectDB = async () => {
    try {
        mongoose.connect(MONGO_URI, {
            serverSelectionTimeoutMS: 100000
        });
        console.log(`Database connected successfully`.cyan.underline.bold);
    } catch (error) {
        console.error(`MongoDB connection error:`.red, error);
        process.exit(1); // Exit the process with failure
    }
}
export default connectDB;