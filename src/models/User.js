const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'El nombre de usuario es obligatorio'],
        trim: true,
    },
    lastName: {
        type: String,
        required: [true, 'El apellido de usuario es obligatorio'],
        trim: true,
    },
    user: {
        type: String,
        required: [true, 'El usuario es obligatorio'],
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatorio'],
        trim: true,
    },
    status: {
        type: Boolean,
    },
})

const User = mongoose.model('User', userSchema);
module.exports = User;