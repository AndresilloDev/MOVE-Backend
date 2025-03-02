const mongoose = require('mongoose');

const spaceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'El nombre del espacio es obligatorio'],
        trim: true,
        unique: true
    },
    building: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Building',
        required: [true, 'El espacio debe pertenecer a un edificio']
    },
})

const Space = mongoose.model('Space', spaceSchema);
module.exports = Space;