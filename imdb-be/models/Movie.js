const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Movie name is required']
    },
    year: {
        type: Number,
        required: [true, 'Year is required'],
        min: [1888, 'Year must be at least 1888 (first movie ever made)'],
        max: [new Date().getFullYear() + 5, 'Year cannot be too far in the future']
    },
    plot: {
        type: String,
        required: [true, 'Plot is required'],
        minlength: [10, 'Plot should be at least 10 characters']
    },
    poster: {
        type: String,
        default: ''
    },
    producer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Producer',
        required: [true, 'Producer is required']
    },
    actors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Actor'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date
    }
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;