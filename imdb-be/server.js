const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');
const authRoutes = require('./routes/authRoutes');
const movieRoutes = require('./routes/movieRoutes');
const actorRoutes = require('./routes/actorRoutes');
const producerRoutes = require('./routes/producerRoutes');

dotenv.config();

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
app.use(errorHandler);

/** Routes */
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/actors', actorRoutes);
app.use('/api/producers', producerRoutes);

/** Start server */
app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});