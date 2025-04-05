const express = require('express');
const {
    getProducers,
    createProducer,
    getProducerById,
    updateProducer,
    deleteProducer
} = require('../controllers/producerController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
    .get(getProducers)
    .post(protect, createProducer);

router.route('/:id')
    .get(getProducerById)
    .put(protect, updateProducer)
    .delete(protect, deleteProducer);

module.exports = router;