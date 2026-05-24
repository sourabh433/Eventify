const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth.js');
const eventRoutes = require('./routes/events.js');
const bookingRoutes = require('./routes/booking.js');

dotenv.config();



const app = express();
app.use(cors({
  origin: [
    "http://localhost:5173", 
    "https://eventify-phi-six.vercel.app"  
  ],
  credentials: true
}));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Eventify Backend Running Successfully");
});

//routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/bookings', bookingRoutes);


//mongodb connection
mongoose.connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("✅ MongoDB Connected");
  })
  .catch((error) => {
    console.error("❌ Error Connecting to MongoDB:", error.message);
    process.exit(1);
  });



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});