const express = require('express');
const {
    getMovies,
    createMovie,
    getMovieById,
    updateMovie,
    deleteMovie
} = require('../controllers/movieController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
    .get(getMovies)
    .post(protect, createMovie);

router.route('/:id')
    .get(getMovieById)
    .put(protect, updateMovie)
    .delete(protect, deleteMovie);

module.exports = router;