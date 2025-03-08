const SensorData = require('../models/SensorData');

const getDeviceSensorsValues = async (req, res) => {
    try {
        const { device } = req.params;

        const sensors = await SensorData.find({ device });

        if (sensors.length === 0) {
            return res.status(404).json({ message: 'No sensors found for this device' });
        }

        const latestSensorValues = sensors.map(sensor => ({
            sensorName: sensor.sensorName,
            lastData: sensor.data.length > 0 ? sensor.data[sensor.data.length - 1] : null
        }));

        return res.status(200).json(latestSensorValues);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

const getAllSensorDataInRange = async (req, res) => {
    try {
        const { device } = req.params;
        const { sensorName, startDate, endDate } = req.query;

        if (!sensorName || !startDate || !endDate) {
            return res.status(400).json({ message: 'sensorName, startDate, and endDate must be provided' });
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (isNaN(start) || isNaN(end)) {
            return res.status(400).json({ message: 'Invalid date format' });
        }

        const sensorData = await SensorData.findOne({ device, sensorName });

        if (!sensorData) {
            return res.status(404).json({ message: 'No sensor data found for this sensor' });
        }

        const filteredData = sensorData.data.filter(entry => entry.time >= start && entry.time <= end);

        if (filteredData.length === 0) {
            return res.status(404).json({ message: 'No sensor data found in the given range' });
        }

        return res.status(200).json(filteredData);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getDeviceSensorsValues, getAllSensorDataInRange };
