const mongoose = require('mongoose');

const producerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Producer name is required']
    },
    gender: {
        type: String,
        required: [true, 'Gender is required'],
        enum: ['male', 'female', 'other']
    },
    dob: {
        type: Date,
        required: [true, 'Date of birth is required']
    },
    bio: {
        type: String,
        required: [true, 'Bio is required'],
        minlength: [10, 'Bio should be at least 10 characters']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Producer = mongoose.model('Producer', producerSchema);

module.exports = Producer;