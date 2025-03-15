const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'El nombre de la notificación es obligatorio'],
        trim: true,
    },
    date: {
        type: Date,
        required: [true, 'La fecha de la notificación es obligatoria'],
        default: Date.now,
    },
    sensor: {
        type: String,
        required: [true, 'El sensor es obligatorio'],
        trim: true,
    },
    device: {
        type: String,
        required: [true, 'El dispositivo es obligatorio'],
        trim: true,
    },
    status: {
        type: Boolean,
        default: true,
    },
});

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;
