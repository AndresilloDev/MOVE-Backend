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
            required: true
        },
        building: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Building',
            required: true
        },
        space: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Space',
            required: true
        },
        deleted: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Device', DeviceSchema);
