const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

const User = require('./models/User');
const Event = require('./models/Event');
const Booking = require('./models/Bookings'); // lowercase fix

dotenv.config();

// ---------------- USERS ----------------
const users = [
    { name: 'Admin User', email: 'admin@eventify.com', password: 'pass123', role: 'admin' },
    { name: 'Sourabh Bhalse', email: 'sourabh@eventify.com', password: 'pass123', role: 'admin' },
    { name: 'Admin One', email: 'admin1@eventify.com', password: 'pass123', role: 'admin' },
    { name: 'Admin Two', email: 'admin2@eventify.com', password: 'pass123', role: 'admin' },
    { name: 'Admin Three', email: 'admin3@eventify.com', password: 'pass123', role: 'admin' },
    { name: 'Alice Smith', email: 'alice@eventify.com', password: 'pass123', role: 'user' },
    { name: 'Bob Johnson', email: 'bob@eventify.com', password: 'pass123', role: 'user' },
    { name: 'Charlie Dave', email: 'charlie@eventify.com', password: 'pass123', role: 'user' },
    { name: 'Diana Prince', email: 'diana@eventify.com', password: 'pass123', role: 'user' }
];

// ---------------- EVENTS ----------------
const events = [
    {
        title: 'React Bootcamp',
        description: 'Learn React from scratch.',
        date: new Date(Date.now() + 5 * 86400000),
        location: 'Bangalore',
        category: 'Technology',
        totalSeats: 150,
        ticketPrice: 500,
        imageUrl: 'https://campus.w3schools.com/cdn/shop/files/ReactJS_512x512.png?v=1768378353'
    },
    {
        title: 'Live Concert Night',
        description: 'Music concert with top artists.',
        date: new Date(Date.now() + 10 * 86400000),
        location: 'Mumbai',
        category: 'Music',
        totalSeats: 400,
        ticketPrice: 1500,
        imageUrl: 'https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2'
    },
    {
        title: 'Startup Meetup',
        description: 'Networking for entrepreneurs.',
        date: new Date(Date.now() + 7 * 86400000),
        location: 'Delhi',
        category: 'Business',
        totalSeats: 200,
        ticketPrice: 300,
        imageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7'
    },
    {
        title: 'Art Exhibition',
        description: 'Modern art showcase.',
        date: new Date(Date.now() + 3 * 86400000),
        location: 'Pune',
        category: 'Art',
        totalSeats: 120,
        ticketPrice: 200,
        imageUrl: 'https://images.unsplash.com/photo-1536924940846-227afb31e2a5'
    },
    {
        title: 'Yoga Retreat',
        description: 'Relax and meditate.',
        date: new Date(Date.now() + 12 * 86400000),
        location: 'Rishikesh',
        category: 'Health',
        totalSeats: 80,
        ticketPrice: 1000,
        imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773'
    },
    {
        title: 'Food Festival',
        description: 'Taste dishes from around the world.',
        date: new Date(Date.now() + 8 * 86400000),
        location: 'Delhi',
        category: 'Food',
        totalSeats: 300,
        ticketPrice: 250,
        imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836'
    },
    {
        title: 'Cricket Tournament',
        description: 'Local cricket league.',
        date: new Date(Date.now() + 15 * 86400000),
        location: 'Indore',
        category: 'Sports',
        totalSeats: 500,
        ticketPrice: 100,
        imageUrl: 'https://www.shutterstock.com/image-vector/cricket-tournament-banner-design-hand-600nw-2539565141.jpg'
    },
    {
        title: 'Photography Workshop',
        description: 'Learn photography skills.',
        date: new Date(Date.now() + 6 * 86400000),
        location: 'Jaipur',
        category: 'Photography',
        totalSeats: 60,
        ticketPrice: 700,
        imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32'
    },
    {
        title: 'Gaming Tournament',
        description: 'Compete in esports.',
        date: new Date(Date.now() + 9 * 86400000),
        location: 'Hyderabad',
        category: 'Gaming',
        totalSeats: 200,
        ticketPrice: 500,
        imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420'
    },
    {
        title: 'Stand-up Comedy Night',
        description: 'Laugh out loud.',
        date: new Date(Date.now() + 4 * 86400000),
        location: 'Mumbai',
        category: 'Comedy',
        totalSeats: 180,
        ticketPrice: 400,
        imageUrl: 'https://assets-in.bmscdn.com/nmcms/mobile/media-mobile-naughty-nights-standup-comedy-show-2025-7-17-t-15-18-46.jpg'
    },
    {
        title: 'Dance Workshop',
        description: 'Learn hip-hop dance.',
        date: new Date(Date.now() + 11 * 86400000),
        location: 'Chennai',
        category: 'Dance',
        totalSeats: 100,
        ticketPrice: 350,
        imageUrl: 'https://www.georgebrown.ca/sites/default/files/styles/medium_rectangle_620_by_390_s_and_c/public/images/2025-01/afrobeats-dancing.jpg?h=bf00185d&itok=NgQdg8WR'
    },
    {
        title: 'Fashion Show',
        description: 'Latest fashion trends.',
        date: new Date(Date.now() + 13 * 86400000),
        location: 'Delhi',
        category: 'Fashion',
        totalSeats: 250,
        ticketPrice: 1200,
        imageUrl: 'https://img.businessoffashion.com/resizer/v2/2XUGAOYNVFBRVI74WXJXZ6D24A.jpg?auth=275e47c883910c4b5fda4cbcb6e1181979326a110a1203022beb74886e2b2b24&width=1440'
    },
    {
        title: 'Science Fair',
        description: 'Innovations and experiments.',
        date: new Date(Date.now() + 14 * 86400000),
        location: 'Kolkata',
        category: 'Science',
        totalSeats: 150,
        ticketPrice: 150,
        imageUrl: 'https://images.squarespace-cdn.com/content/v1/54807be6e4b053bc20c8b2a0/1690998257906-83BM3GD1PRAZAKJANW3I/Science+Fair+Blog.png'
    },
    {
        title: 'Book Reading Session',
        description: 'Meet authors & readers.',
        date: new Date(Date.now() + 16 * 86400000),
        location: 'Nagpur',
        category: 'Education',
        totalSeats: 90,
        ticketPrice: 100,
        imageUrl: 'https://static.toiimg.com/thumb/128905677.jpg?imgsize=23456&photoid=128905677&width=600&resizemode=4'
    },
    {
        title: 'Movie Screening',
        description: 'Classic movie night.',
        date: new Date(Date.now() + 2 * 86400000),
        location: 'Bhopal',
        category: 'Entertainment',
        totalSeats: 220,
        ticketPrice: 200,
        imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba'
    },
    {
        title: 'Spiritual Retreat',
        description: 'Peace & mindfulness.',
        date: new Date(Date.now() + 18 * 86400000),
        location: 'Varanasi',
        category: 'Spiritual',
        totalSeats: 70,
        ticketPrice: 600,
        imageUrl: 'https://bookretreats.com/cdn-cgi/image/width=1200,quality=65,f=auto,sharpen=1,fit=cover,gravity=auto/assets/photo/retreat/0m/14k/14087/p_333907/1000_1563375332.jpg'
    },
    {
        title: 'Coding Hackathon',
        description: '24-hour coding challenge.',
        date: new Date(Date.now() + 20 * 86400000),
        location: 'Bangalore',
        category: 'Hackathon',
        totalSeats: 300,
        ticketPrice: 800,
        imageUrl: 'https://www.hackerrank.com/blog/wp-content/uploads/2015/01/hackny-hackathon-fall-2010-flickr-photo-sharing1.jpg'
    },
    {
        title: 'Car Expo',
        description: 'Latest car models showcase.',
        date: new Date(Date.now() + 21 * 86400000),
        location: 'Delhi',
        category: 'Automobile',
        totalSeats: 350,
        ticketPrice: 500,
        imageUrl: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7'
    },
    {
        title: 'Pet Show',
        description: 'Cute pets competition.',
        date: new Date(Date.now() + 17 * 86400000),
        location: 'Pune',
        category: 'Pets',
        totalSeats: 130,
        ticketPrice: 150,
        imageUrl: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d'
    },
    {
        title: 'Travel Meetup',
        description: 'Meet travel enthusiasts.',
        date: new Date(Date.now() + 19 * 86400000),
        location: 'Goa',
        category: 'Travel',
        totalSeats: 110,
        ticketPrice: 300,
        imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e'
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
                let paymentStatus = 'not_paid';

                if (status === 'confirmed' && event.ticketPrice > 0) {
                    paymentStatus = Math.random() > 0.1 ? 'paid' : 'not_paid';
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

