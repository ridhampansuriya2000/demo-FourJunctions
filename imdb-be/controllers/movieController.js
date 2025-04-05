const Movie = require('../models/Movie');
const mongoose = require('mongoose');

const getMovies = async (req, res, next) => {
    try {
        const movies = await Movie.find()
            .populate('producer')
            .populate('actors')
            .sort({ year: -1 });

        res.json(movies);
    } catch (error) {
        next(error);
    }
};

const createMovie = async (req, res, next) => {
    try {
        const { name, year, plot, poster, producer, actors } = req.body;

        const movie = await Movie.create({
            name,
            year: Number.parseInt(year),
            plot,
            poster: poster || '',
            producer: new mongoose.Types.ObjectId(producer),
            actors: actors.map(id => new mongoose.Types.ObjectId(id)),
            createdAt: new Date()
        });

        res.status(201).json({ id: movie._id });
    } catch (error) {
        next(error);
    }
};

const getMovieById = async (req, res, next) => {
    try {
        const movie = await Movie.findById(req.params.id)
            .populate('producer')
            .populate('actors');

        if (movie) {
            res.json(movie);
        } else {
            res.status(404);
            throw new Error('Movie not found');
        }
    } catch (error) {
        next(error);
    }
};

const updateMovie = async (req, res, next) => {
    try {
        const { name, year, plot, poster, producer, actors } = req.body;

        const movie = await Movie.findById(req.params.id);

        if (movie) {
            movie.name = name || movie.name;
            movie.year = year ? Number.parseInt(year) : movie.year;
            movie.plot = plot || movie.plot;
            movie.poster = poster !== undefined ? poster : movie.poster;
            movie.producer = producer ? new mongoose.Types.ObjectId(producer) : movie.producer;
            movie.actors = actors ? actors.map(id => new mongoose.Types.ObjectId(id)) : movie.actors;
            movie.updatedAt = new Date();

            await movie.save();
            res.json({ success: true });
        } else {
            res.status(404);
            throw new Error('Movie not found');
        }
    } catch (error) {
        next(error);
    }
};

const deleteMovie = async (req, res, next) => {
    try {
        const movie = await Movie.findById(req.params.id);

        if (movie) {
            await movie.deleteOne();
            res.json({ success: true });
        } else {
            res.status(404);
            throw new Error('Movie not found');
        }
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getMovies,
    createMovie,
    getMovieById,
    updateMovie,
    deleteMovie
};