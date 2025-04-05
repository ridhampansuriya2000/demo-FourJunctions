const express = require('express');
const {
    getActors,
    createActor,
    getActorById,
    updateActor,
    deleteActor
} = require('../controllers/actorController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
    .get(getActors)
    .post(protect, createActor);

router.route('/:id')
    .get(getActorById)
    .put(protect, updateActor)
    .delete(protect, deleteActor);

module.exports = router;