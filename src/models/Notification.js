const mongoose = require('mongoose');
const moment = require('moment');

const notificationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'El nombre de la notificación es obligatorio'],
        trim: true,
    },
    date: {
        type: String,
        required: [true, 'La fecha de la notificación es obligatoria'],
        default: () => moment().format('YYYY-MM-DD HH:mm:ss'),
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
    image: {
        type: String,
        required: [true, 'La imagen es obligatoria'],
        trim: true,
    },
    status: {
        type: Boolean,
        default: true,
    },
});

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;
