const mongoose = require('mongoose');

const buildingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'El nombre del edificio es obligatorio'],
        trim: true,
        unique: true
    }
});

const Building = mongoose.model('Building', buildingSchema);
module.exports = Building;
