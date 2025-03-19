const mongoose = require('mongoose');

const DeviceSchema = new mongoose.Schema(
    {
        id: {
            type: String,
            required: true,
            unique: true
        },
        name: {
            type: String,
            default: "Nuevo Dispositivo"
        },
        building: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Building',
            default: null
        },
        space: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Space',
            default: null
        },
        deleted: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Device', DeviceSchema);
