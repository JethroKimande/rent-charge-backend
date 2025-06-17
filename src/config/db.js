const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }).then((conn) => {
      // Access the host and database name from the connection object
      const host = conn.connections[0].host;
      const dbName = conn.connections[0].name;

      console.log(`Connected to MongoDB on host: ${host}, database: ${dbName}`);
  });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

module.exports = connectDB;