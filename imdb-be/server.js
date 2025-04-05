const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');

/** Import routes */
const authRoutes = require('./routes/authRoutes');
const movieRoutes = require('./routes/movieRoutes');
const actorRoutes = require('./routes/actorRoutes');
const producerRoutes = require('./routes/producerRoutes');

/** Load environment variables */
dotenv.config();

/** Connect to MongoDB */
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

/** Middleware */
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));

/** Routes */
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/actors', actorRoutes);
app.use('/api/producers', producerRoutes);

/** Health check route */
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Server is running' });
});

/** Error handling middleware */
app.use(errorHandler);

/** Start server */
app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});