import mongoose from 'mongoose';
export const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/school-portal';
        const conn = await mongoose.connect(uri);
        console.log(`\u2705 MongoDB Connected: ${conn.connection.host}`);
    }
    catch (err) {
        console.error(`\u274C MongoDB Connection Error: ${err.message}`);
        process.exit(1);
    }
};
//# sourceMappingURL=db.js.map