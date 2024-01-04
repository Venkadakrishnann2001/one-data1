const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors');
const app = express();
const port = 8000;
const dotenv = require('dotenv').config()
app.use(express.json());
app.use(cors());

const uri = process.env.mongodb
// Connect to MongoDB
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(()=>{
  console.log('Connected to Mongo db')
}).catch((err)=>{
  console.error("Db connect error",err)
})

// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));
// db.once('open', () => {
//   console.log('Connected to MongoDB');
// });

// Define the User model schema
const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const User = mongoose.model('User', userSchema);

// Define the Admin model schema
const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const Admin = mongoose.model('Admin', adminSchema);

// Define a Mongoose model for booking
// const bookingSchema = new mongoose.Schema({
//   username: String,
//   phone: String,
//   pickupLocation: String,
//   dropoffLocation: String,
//   date: String,
//   time: String,
//   distance: Number,
//   bookingAmount: Number,
//   otp: Number,
// });
// const Bookingcar = mongoose.model('Bookingcar', bookingSchema);

// // Dummy OTP generation function
// function generateOTP() {
//   return Math.floor(100000 + Math.random() * 900000);
// }
// const transactionSchema = new mongoose.Schema({
//   username: String,
//   phone: String,
//   pickupLocation: String,
//   dropoffLocation: String,
//   date: String,
//   time: String,
//   distance: Number,
//   bookingAmount: Number,
//   otp: Number,
//   paymentmethod: String,
//   paymentamount: Number,
// });
// const Transaction = mongoose.model('Transaction', transactionSchema);

// const bookingConfirmationSchema = new mongoose.Schema({
//   username: String,
//   phone: String,
//   pickupLocation: String,
//   dropoffLocation: String, 
//   date: String,
//   time: String,
//   distance: Number,
//   bookingAmount: Number,
//   paymentamount: Number,
// });

// const BookingConfirmation = mongoose.model('BookingConfirmation', bookingConfirmationSchema);

const educationSchema = new mongoose.Schema({
  fullName: {
    type: String,
    
  },
  institution: String,
  fieldOfStudy: String,
  degree: String,
  grade: String,
  activities: String,
  society: String,
});

// Create the Education model using the schema
const Education = mongoose.model('Education', educationSchema);

module.exports = Education;

app.post('/api/education', async (req, res) => {
  try {
    const newEducation = new Education(req.body);

    const savedEducation = await newEducation.save();
    res.json(savedEducation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

const skillSchema = new mongoose.Schema({
  skill: String,
});

const SkillModel = mongoose.model('Skill', skillSchema);

const experienceSchema = new mongoose.Schema({
  company: String,
  position: String,
  year: String,
  description: String,
});

const Experience = mongoose.model('Experience', experienceSchema);

app.post('/api/add-experience', async (req, res) => {
  try {
    const { company, position, year, description } = req.body;

    const newExperience = new Experience({
      company,
      position,
      year,
      description,
    });

    const savedExperience = await newExperience.save();

    res.status(201).json(savedExperience);
  } catch (error) {
    console.error('Error saving experience:', error);
    res.status(500).json({ error: 'Failed to save experience' });
  }
});

app.post('/api/add-skill', async (req, res) => {
  try {
    const { skill } = req.body;

    // Create a new Skill document in your MongoDB
    const newSkill = new SkillModel({ skill });
    const savedSkill = await newSkill.save();

    res.status(201).json(savedSkill);
  } catch (error) {
    console.error('Error saving skill:', error);
    res.status(500).json({ error: 'Failed to save skill' });
  }
});

// app.get('/api/alltransaction', async (req, res) => {
//   try {
//     const transactions = await Transaction.find(); 

//     res.status(200).json(transactions);
//   } catch (error) {
//     console.error('Error fetching transactions:', error);
//     res.status(500).json({ error: 'Error fetching transactions' });
//   }
// });
// app.get('/api/BookingConfirmation', async (req, res) => {
//   console.log('hi')
//   try {
//     // Fetch data from the MongoDB collection
//     const bookingConfirmations = await BookingConfirmation.find();
//     res.json(bookingConfirmations);
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to fetch data' });
//   }
// });


// User registration endpoint
app.post('/api/register', async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

// User login endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    // Compare the provided password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    res.status(200).json({ message: 'Login successful', user: { /* user data */ } });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Admin registration endpoint
app.post('/api/admin/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new admin
    const newAdmin = new Admin({
      email,
      password: hashedPassword,
    });

    await newAdmin.save();

    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Admin registration failed' });
  }
});

// Admin login endpoint
app.post('/api/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    const passwordMatch = await bcrypt.compare(password, admin.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    res.status(200).json({ message: 'Admin login successful', admin: admin });
  } catch (error) {
    res.status(500).json({ error: 'Admin login failed' });
  }
});

// API endpoint for creating a car booking and generating OTP
// app.post('/api/bookingcar', async (req, res) => {
//   try {
//     const {
//       username,
//       phone,
//       pickupLocation,
//       dropoffLocation,
//       date,
//       time,
//       distance,
//       bookingAmount,
//     } = req.body;
// // console.log("venkat")
//     // Generate OTP
//     const otp = generateOTP();

//     // Create a booking record
//     const bookingcar = new Bookingcar({
//       username,
//       phone,
//       pickupLocation,
//       dropoffLocation,
//       date,
//       time,
//       distance,
//       bookingAmount,
//       otp,
//     });

//     // Save the booking to the MongoDB database
//     const savedBookingcar = await bookingcar.save();
//     res.status(201).json({ otp: savedBookingcar.otp });
//   } catch (error) {
//     console.error('Error saving bookingcar:', error);
//     res.status(500).json({ error: 'Error saving bookingcar' });
//   }
// });

// // server.js
// // ... (other imports and middleware)

// app.post('/api/Transaction', async (req, res) => {
//   try {
//     const {
//       username,
//       phone,
//       pickupLocation,
//       dropoffLocation,
//       date,
//       time,
//       distance,
//       bookingAmount,
//       paymentmethod,
//       paymentamount,
//     } = req.body;

//     // Generate OTP
//     const otp = generateOTP();

//     // Create a transaction record
//     const newTransaction = new Transaction({ // Changed variable name here
//       username,
//       phone,
//       pickupLocation,
//       dropoffLocation,
//       date,
//       time,
//       distance,
//       bookingAmount,
//       otp,
//       paymentmethod,
//       paymentamount,
//     });

//     // Save the transaction to the MongoDB database
//     const savedTransaction = await newTransaction.save(); // Changed variable name here
//     res.status(201).json({ otp: savedTransaction.otp });
//   } catch (error) {
//     console.error('Error saving Transaction:', error);
//     res.status(500).json({ error: 'Error saving Transaction' });
//   }
// });
// // ... (rest of the code)

// app.post('/api/BookingConfirmation', async (req, res) => {
//   // console.log("BookingConfirmation is success");
//   try {
//     const {
//       username,
//       phone,
//       pickupLocation,
//       dropoffLocation,
//       date,
//       time,
//       distance,
//       bookingAmount,
//       paymentmethod, 
//       paymentamount,
//     } = req.body;
//       console.log("hbhgvcdxsz");
//       console.log(paymentamount);

//     // Generate OTP
//     const otp = generateOTP();

//     // Create a transaction record
//     const newBookingConfirmation = new BookingConfirmation({ // Changed variable name here
//       username,
//       phone,
//       pickupLocation,
//       dropoffLocation,
//       date,
//       time,
//       distance,
//       bookingAmount,
//       otp,
//       paymentmethod,
//       paymentamount,
//     });

//     // Save the transaction to the MongoDB database
//     const savedBookingConfirmation = await newBookingConfirmation.save(); // Changed variable name here
//     res.status(201).json({ otp: savedBookingConfirmation.otp });
//   } catch (error) {
//     console.error('Error saving BookingConfirmation:', error);
//     res.status(500).json({ error: 'Error saving BookingConfirmation' });
//   }
// });

// Fetch all skills
app.get('/api/skills', async (req, res) => {
  try {
    const skills = await SkillModel.find(); // SkillModel is your Mongoose model for skills

    res.status(200).json(skills);
  } catch (error) {
    console.error('Error fetching skills:', error);
    res.status(500).json({ error: 'Error fetching skills' });
  }
});

// Fetch all experiences
app.get('/api/experiences', async (req, res) => {
  try {
    const experiences = await Experience.find(); // Experience is your Mongoose model for experiences

    res.status(200).json(experiences);
  } catch (error) {
    console.error('Error fetching experiences:', error);
    res.status(500).json({ error: 'Error fetching experiences' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
