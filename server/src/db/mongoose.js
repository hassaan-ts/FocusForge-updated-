import mongoose from 'mongoose';

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((error) => {
  console.error('MongoDB connection error:', error);
  process.exit(1);
});