import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';

async function seed() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const adminDb = client.db('expenss_tracker_admin');
    await adminDb.collection('users').deleteMany({});
    
    const users = [
      { email: 'admin@test.com', password: await bcrypt.hash('admin123', 10), name: 'Admin User', createdAt: new Date() },
      { email: 'user1@test.com', password: await bcrypt.hash('user123', 10), name: 'John Doe', createdAt: new Date() },
      { email: 'user2@test.com', password: await bcrypt.hash('user123', 10), name: 'Jane Smith', createdAt: new Date() }
    ];
    
    const result = await adminDb.collection('users').insertMany(users);
    console.log(`Created ${result.insertedCount} users`);

    for (const userId of Object.values(result.insertedIds)) {
      const userDb = client.db(`user_${userId.toString()}`);
      
      const categories = [
        { userId: userId.toString(), name: 'Food', icon: '🍔' },
        { userId: userId.toString(), name: 'Transport', icon: '🚗' },
        { userId: userId.toString(), name: 'Shopping', icon: '🛍️' },
        { userId: userId.toString(), name: 'Bills', icon: '📄' },
        { userId: userId.toString(), name: 'Entertainment', icon: '🎬' }
      ];
      
      const paymentMethods = [
        { userId: userId.toString(), name: 'Cash' },
        { userId: userId.toString(), name: 'Online' },
        { userId: userId.toString(), name: 'Credit Card' },
        { userId: userId.toString(), name: 'Debit Card' }
      ];
      
      const persons = [
        { userId: userId.toString(), name: 'Self' },
        { userId: userId.toString(), name: 'Spouse' },
        { userId: userId.toString(), name: 'Child' }
      ];
      
      const expenses = [
        { userId: userId.toString(), amount: 250.00, category: 'Food', description: 'Grocery shopping', date: new Date('2024-01-15'), paymentMethod: 'Cash', person: 'Self', createdAt: new Date() },
        { userId: userId.toString(), amount: 80.00, category: 'Transport', description: 'Fuel', date: new Date('2024-01-16'), paymentMethod: 'Online', person: 'Self', createdAt: new Date() },
        { userId: userId.toString(), amount: 150.00, category: 'Shopping', description: 'Clothes', date: new Date('2024-01-17'), paymentMethod: 'Credit Card', person: 'Spouse', createdAt: new Date() },
        { userId: userId.toString(), amount: 500.00, category: 'Bills', description: 'Electricity bill', date: new Date('2024-01-18'), paymentMethod: 'Online', person: 'Self', createdAt: new Date() },
        { userId: userId.toString(), amount: 300.00, category: 'Entertainment', description: 'Movie & dinner', date: new Date('2024-01-19'), paymentMethod: 'Debit Card', person: 'Self', createdAt: new Date() }
      ];

      const income = [
        { userId: userId.toString(), amount: 5000.00, source: 'Salary', description: 'Monthly salary', date: new Date('2024-01-01'), createdAt: new Date() },
        { userId: userId.toString(), amount: 1000.00, source: 'Freelance', description: 'Project payment', date: new Date('2024-01-10'), createdAt: new Date() }
      ];
      
      await userDb.collection('categories').deleteMany({});
      await userDb.collection('categories').insertMany(categories);
      
      await userDb.collection('payment_methods').deleteMany({});
      await userDb.collection('payment_methods').insertMany(paymentMethods);
      
      await userDb.collection('persons').deleteMany({});
      await userDb.collection('persons').insertMany(persons);
      
      await userDb.collection('expenses').deleteMany({});
      await userDb.collection('expenses').insertMany(expenses);

      await userDb.collection('income').deleteMany({});
      await userDb.collection('income').insertMany(income);
    }

    console.log('Seed completed!');
  } catch (error) {
    console.error('Seed failed:', error);
  } finally {
    await client.close();
  }
}

seed();
