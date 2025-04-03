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
    isAdmin: {
        type: Boolean,
        default: false,
    },
    status: {
        type: Boolean,
        default: true,
    },
    token: {
        type: String,
        expires: 7200,
        unique: true,
        sparse: true,
    }
})

const User = mongoose.model('User', userSchema);
module.exports = User;