import mongoose from 'mongoose';

const connections: { [key: string]: mongoose.Connection } = {};

export const connectAdminDB = async () => {
  const dbName = process.env.ADMIN_DB || 'expense_tracker_admin';
  
  if (connections['admin']) {
    return connections['admin'];
  }
  
  const conn = await mongoose.createConnection(process.env.MONGO_URI + dbName).asPromise();
  connections['admin'] = conn;
  return conn;
};

export const getUserDB = (userId: string) => {
  const userDbId = userId.substring(0, 6).replace(/[^a-zA-Z0-9]/g, '');
  const dbName = `expense_tracker_user_${userDbId}`;
  
  if (connections[userDbId]) {
    return connections[userDbId];
  }
  
  const conn = mongoose.createConnection(process.env.MONGO_URI + dbName);
  connections[userDbId] = conn;
  return conn;
};
