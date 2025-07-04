import mongoose from 'mongoose';
import app from './app';

const PORT = 3000;
// Establish database connection
const startServer = async () => {
  const uri =
    'mongodb+srv://online-shop-server:9YmHVmZfX9SV1NBg@cluster0.exf98yb.mongodb.net/onlineShop?retryWrites=true&w=majority&appName=Cluster0';

  try {
    await mongoose.connect(uri as string);
    app.listen(PORT, () => {
      console.log(`Server running on port: ${PORT}`);
      console.log('Connected to MongoDB');
    });
  } catch (error) {
    console.error('Error starting server:', error);
  }
};

startServer();
