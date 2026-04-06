const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

const User = require('./models/User');
const Event = require('./models/Event');
const Booking = require('./models/bookings'); // lowercase fix

dotenv.config();

// ---------------- USERS ----------------
const users = [
    { name: 'Admin User', email: 'admin@eventora.com', password: 'password123', role: 'admin' },
    { name: 'Demo User', email: 'user@eventora.com', password: 'password123', role: 'user' },
    { name: 'Alice Smith', email: 'alice@eventora.com', password: 'password123', role: 'user' },
    { name: 'Bob Johnson', email: 'bob@eventora.com', password: 'password123', role: 'user' },
    { name: 'Charlie Dave', email: 'charlie@eventora.com', password: 'password123', role: 'user' },
    { name: 'Diana Prince', email: 'diana@eventora.com', password: 'password123', role: 'user' },
    { name: 'Ethan Hunt', email: 'ethan@eventora.com', password: 'password123', role: 'user' },
    { name: 'Fiona Gallagher', email: 'fiona@eventora.com', password: 'password123', role: 'user' },
    { name: 'George Miller', email: 'george@eventora.com', password: 'password123', role: 'user' },
    { name: 'Hannah Montana', email: 'hannah@eventora.com', password: 'password123', role: 'user' }
];

// ---------------- EVENTS ----------------
const events = [
    {
        title: 'React & Node.js Developer Retreat',
        description: 'Full-stack deep dive.',
        date: new Date(Date.now() + 10 * 86400000),
        location: 'Silicon Valley',
        category: 'Technology',
        totalSeats: 200,
        ticketPrice: 0,
        imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87'
    },
    {
        title: 'EDM Festival',
        description: 'Music & lights show.',
        date: new Date(Date.now() + 20 * 86400000),
        location: 'New York',
        category: 'Music',
        totalSeats: 500,
        ticketPrice: 1500,
        imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819'
    },
    {
        title: 'Business Summit',
        description: 'Global leaders meetup.',
        date: new Date(Date.now() + 15 * 86400000),
        location: 'London',
        category: 'Business',
        totalSeats: 150,
        ticketPrice: 5000,
        imageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7'
    },
    {
        title: 'Art Expo',
        description: 'Modern art showcase.',
        date: new Date(Date.now() + 5 * 86400000),
        location: 'Art Museum',
        category: 'Art',
        totalSeats: 300,
        ticketPrice: 200,
        imageUrl: 'https://images.unsplash.com/photo-1536924940846-227afb31e2a5'
    },
    {
        title: 'Startup Pitch',
        description: 'Startup funding event.',
        date: new Date(Date.now() + 30 * 86400000),
        location: 'Miami',
        category: 'Business',
        totalSeats: 250,
        ticketPrice: 100,
        imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c'
    },
    {
        title: 'Cloud Seminar',
        description: 'Cloud architecture.',
        date: new Date(Date.now() + 12 * 86400000),
        location: 'Seattle',
        category: 'Technology',
        totalSeats: 100,
        ticketPrice: 600,
        imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa'
    }
];

// ---------------- SEED FUNCTION ----------------
const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log('✅ MongoDB connected');

        await User.deleteMany();
        await Event.deleteMany();
        await Booking.deleteMany();
        console.log('🗑️ Data cleared');

        // Hash passwords
        const salt = await bcrypt.genSalt(10);
        const hashedUsers = users.map(u => ({
            ...u,
            password: bcrypt.hashSync(u.password, salt),
            isVerified: true
        }));

        const createdUsers = await User.insertMany(hashedUsers);
        const admin = createdUsers.find(u => u.role === 'admin');
        const normalUsers = createdUsers.filter(u => u.role === 'user');

        console.log(`👤 ${createdUsers.length} users created`);

        // Create events
        const eventsWithAdmin = events.map(e => ({
            ...e,
            availableSeats: e.totalSeats,
            createdBy: admin._id
        }));

        const createdEvents = await Event.insertMany(eventsWithAdmin);
        console.log(`🎉 ${createdEvents.length} events created`);

        // BOOKINGS
        const bookings = [];

        for (const event of createdEvents) {
            const randomUsers = [...normalUsers]
                .sort(() => 0.5 - Math.random())
                .slice(0, 4);

            for (const user of randomUsers) {
                const statusArr = ['pending', 'confirmed', 'cancelled'];
                const status = statusArr[Math.floor(Math.random() * statusArr.length)];

                // ✅ FIXED PAYMENT STATUS
                let paymentStatus = 'unpaid';

                if (status === 'confirmed' && event.ticketPrice > 0) {
                    paymentStatus = Math.random() > 0.1 ? 'paid' : 'unpaid';
                } else if (event.ticketPrice === 0) {
                    paymentStatus = 'paid';
                }

                bookings.push({
                    userId: user._id,
                    eventId: event._id,
                    status,
                    paymentStatus,
                    amount: event.ticketPrice
                });

                if (status === 'confirmed') {
                    event.availableSeats -= 1;
                    await event.save();
                }
            }
        }

        await Booking.insertMany(bookings);
        console.log(`🎫 ${bookings.length} bookings created`);

        console.log('\n🚀 Seeding Successful!');
        process.exit();

    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }
};

seedDatabase();

