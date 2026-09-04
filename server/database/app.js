const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3030;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Load JSON data
const reviews_data = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'data', 'reviews.json'), 'utf8')
);

const dealerships_data = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'data', 'dealerships.json'), 'utf8')
);

// Models
const Reviews = require('./review');
const Dealerships = require('./dealership');

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/', {
    dbName: 'dealershipsDB'
  })
  .then(async () => {
    console.log('Connected to MongoDB');

    try {
      await Reviews.deleteMany({});
      await Reviews.insertMany(reviews_data.reviews);

      await Dealerships.deleteMany({});
      await Dealerships.insertMany(dealerships_data.dealerships);

      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Database initialization error:', error);
    }
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

// Home
app.get('/', (req, res) => {
  res.send('Welcome to the Mongoose API');
});

// Fetch all reviews
app.get('/fetchReviews', async (req, res) => {
  try {
    const documents = await Reviews.find();
    res.json(documents);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Error fetching reviews'
    });
  }
});

// Fetch reviews by dealership
app.get('/fetchReviews/dealer/:id', async (req, res) => {
  try {
    const documents = await Reviews.find({
      dealership: req.params.id
    });
    res.json(documents);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Error fetching reviews'
    });
  }
});

// Fetch all dealerships
app.get('/fetchDealers', async (req, res) => {
  try {
    const documents = await Dealerships.find();
    res.json(documents);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Error fetching dealerships'
    });
  }
});

// Fetch dealerships by state
app.get('/fetchDealers/:state', async (req, res) => {
  try {
    const documents = await Dealerships.find({
      state: req.params.state
    });
    res.json(documents);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Error fetching dealerships'
    });
  }
});

// Fetch dealership by ID
app.get('/fetchDealer/:id', async (req, res) => {
  try {
    const documents = await Dealerships.find({
      id: req.params.id
    });
    res.json(documents);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Error fetching dealership'
    });
  }
});

// Insert review
app.post('/insert_review', async (req, res) => {
  try {
    const data = req.body;

    const latestReview = await Reviews
      .findOne()
      .sort({ id: -1 });

    const new_id = latestReview ? latestReview.id + 1 : 1;

    const review = new Reviews({
      id: new_id,
      name: data.name,
      dealership: data.dealership,
      review: data.review,
      purchase: data.purchase,
      purchase_date: data.purchase_date,
      car_make: data.car_make,
      car_model: data.car_model,
      car_year: data.car_year
    });

    const savedReview = await review.save();
    res.status(201).json(savedReview);

  } catch (error) {
    console.error('Error inserting review:', error);
    res.status(500).json({
      error: 'Error inserting review'
    });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});