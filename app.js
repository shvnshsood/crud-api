const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/userprofiles', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Define User model
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  age: Number,
  country: String,
  password: String,
});

const UserModel = mongoose.model('User', userSchema);

// Middleware
app.use(bodyParser.json());

// Routes
app.get('/users', async (req, res) => {
  try {
    const users = await UserModel.find({}, { password: 0 }); // Exclude password field
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/users', async (req, res) => {
  try {
    const newUser = new UserModel(req.body);
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(400).json({ error: 'Bad Request' });
  }
});

app.put('/users/:id', async (req, res) => {
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: 'Bad Request' });
  }
});

app.delete('/users/:id', async (req, res) => {
  try {
    const deletedUser = await UserModel.findByIdAndDelete(req.params.id);
    res.json(deletedUser);
  } catch (error) {
    res.status(400).json({ error: 'Bad Request' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
