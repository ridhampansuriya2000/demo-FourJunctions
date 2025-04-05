const Producer = require('../models/Producer');

const getProducers = async (req, res, next) => {
    try {
        const producers = await Producer.find().sort({ name: 1 });
        res.json(producers);
    } catch (error) {
        next(error);
    }
};

const createProducer = async (req, res, next) => {
    try {
        const { name, gender, dob, bio } = req.body;

        const producer = await Producer.create({
            name,
            gender,
            dob: new Date(dob),
            bio
        });

        res.status(201).json({ id: producer._id });
    } catch (error) {
        next(error);
    }
};

const getProducerById = async (req, res, next) => {
    try {
        const producer = await Producer.findById(req.params.id);

        if (producer) {
            res.json(producer);
        } else {
            res.status(404);
            throw new Error('Producer not found');
        }
    } catch (error) {
        next(error);
    }
};

const updateProducer = async (req, res, next) => {
    try {
        const { name, gender, dob, bio } = req.body;

        const producer = await Producer.findById(req.params.id);

        if (producer) {
            producer.name = name || producer.name;
            producer.gender = gender || producer.gender;
            producer.dob = dob ? new Date(dob) : producer.dob;
            producer.bio = bio || producer.bio;

            const updatedProducer = await producer.save();
            res.json(updatedProducer);
        } else {
            res.status(404);
            throw new Error('Producer not found');
        }
    } catch (error) {
        next(error);
    }
};

const deleteProducer = async (req, res, next) => {
    try {
        const producer = await Producer.findById(req.params.id);

        if (producer) {
            await producer.deleteOne();
            res.json({ success: true });
        } else {
            res.status(404);
            throw new Error('Producer not found');
        }
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getProducers,
    createProducer,
    getProducerById,
    updateProducer,
    deleteProducer
};