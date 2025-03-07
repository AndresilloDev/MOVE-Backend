const SensorData = require('../models/SensorData');

const getDeviceSensor = async (req, res) => {
    try {
        const { deviceId } = req.params;

        const sensors = await SensorData.find({ deviceId });

        if (sensors.length === 0) {
            return res.status(404).json({ message: 'No sensors found for this device' });
        }

        return res.status(200).json(sensors);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

const getAllSensorDataInRange = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).json({ message: 'Both startDate and endDate must be provided' });
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (isNaN(start) || isNaN(end)) {
            return res.status(400).json({ message: 'Invalid date format' });
        }

        // Realiza la consulta buscando en el arreglo 'data.time'
        const sensorData = await SensorData.find({
            'data.time': { $gte: start, $lte: end }
        });

        if (sensorData.length === 0) {
            return res.status(404).json({ message: 'No sensor data found for this range' });
        }

        return res.status(200).json(sensorData);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getDeviceSensor, getAllSensorDataInRange };
