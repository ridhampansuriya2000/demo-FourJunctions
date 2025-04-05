const Actor = require('../models/Actor');

const getActors = async (req, res, next) => {
    try {
        const actors = await Actor.find().sort({ name: 1 });
        res.json(actors);
    } catch (error) {
        next(error);
    }
};

const createActor = async (req, res, next) => {
    try {
        const { name, gender, dob, bio } = req.body;

        const actor = await Actor.create({
            name,
            gender,
            dob: new Date(dob),
            bio
        });

        res.status(201).json({ id: actor._id });
    } catch (error) {
        next(error);
    }
};

const getActorById = async (req, res, next) => {
    try {
        const actor = await Actor.findById(req.params.id);

        if (actor) {
            res.json(actor);
        } else {
            res.status(404);
            throw new Error('Actor not found');
        }
    } catch (error) {
        next(error);
    }
};

const updateActor = async (req, res, next) => {
    try {
        const { name, gender, dob, bio } = req.body;

        const actor = await Actor.findById(req.params.id);

        if (actor) {
            actor.name = name || actor.name;
            actor.gender = gender || actor.gender;
            actor.dob = dob ? new Date(dob) : actor.dob;
            actor.bio = bio || actor.bio;

            const updatedActor = await actor.save();
            res.json(updatedActor);
        } else {
            res.status(404);
            throw new Error('Actor not found');
        }
    } catch (error) {
        next(error);
    }
};

const deleteActor = async (req, res, next) => {
    try {
        const actor = await Actor.findById(req.params.id);

        if (actor) {
            await actor.deleteOne();
            res.json({ success: true });
        } else {
            res.status(404);
            throw new Error('Actor not found');
        }
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getActors,
    createActor,
    getActorById,
    updateActor,
    deleteActor
};