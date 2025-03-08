const mongoose = require('mongoose');

const sensorDataSchema = new mongoose.Schema({
    device  : {
        type: String,
        required: [true, 'El ID del dispositivo es obligatorio'],
        trim: true
    },
    sensorName: {
        type: String,
        required: [true, 'El nombre del sensor es obligatorio'],
        trim: true
    },
    thresholds: {
        upper: {
            type: Number,
            required: false
        },
        lower: {
            type: Number,
            required: false
        }
    },
    data: [
        {
            time: {
                type: Date,
                required: [true, 'La hora es obligatoria']
            },
            value: {
                type: Number,
                required: [true, 'El valor del sensor es obligatorio']
            }
        }
    ]
});

const SensorData = mongoose.model('SensorData', sensorDataSchema);

module.exports = SensorData;
