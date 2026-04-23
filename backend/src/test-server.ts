import 'dotenv/config';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import app from './app.js';
import { seedData } from './utils/seed.js';
import { User } from './models/User.js';

const startTestServer = async () => {
  try {
    const mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    
    await mongoose.connect(uri);
    console.log('\u2705 In-memory MongoDB started');
    
    // Seed initial data if DB is empty
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      await seedData(false, false);
      console.log('\u2705 Test data seeded');
    } else {
      console.log('\u2139\uFE0F DB already has data, skipping seed');
    }

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`\uD83D\uDE80 Test Server running on port ${PORT}`);
    });
  } catch (err: any) {
    console.error('\u274C Test Server failed to start:', err.message);
    process.exit(1);
  }
};

startTestServer();
