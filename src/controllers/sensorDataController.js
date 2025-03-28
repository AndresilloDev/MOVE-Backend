const SensorData = require('../models/SensorData'); // Modelo de los datos de sensores
const mongoose = require('mongoose');

// Obtener los valores actuales de los sensores de un dispositivo
exports.getDeviceSensorsValues = async (req, res) => {
    try {
        const { deviceId } = req.params;
        const objectId = new mongoose.Types.ObjectId(deviceId); // Convertir a ObjectId

        // Buscar todos los sensores asociados al dispositivo
        const latestData = await SensorData.find({ device: objectId }).sort({ 'data.time': -1 });

        if (!latestData || latestData.length === 0) {
            return res.status(404).json({ error: 'No se encontraron datos para este dispositivo' });
        }

        res.json(latestData);
    } catch (error) {
        console.error('Error obteniendo datos del sensor:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Obtener datos de sensores en un rango de tiempo
exports.getAllSensorDataInRange = async (req, res) => {
    try {
        const { deviceId } = req.params;
        const { start, end } = req.query;

        const objectId = new mongoose.Types.ObjectId(deviceId); 

        if (!start || !end) {
            return res.status(400).json({ error: 'Debe proporcionar un rango de fechas (start y end)' });
        }

        const startDate = new Date(start);
        const endDate = new Date(end);

        const sensorData = await SensorData.find({
            deviceId: objectId,
            createdAt: { $gte: startDate, $lte: endDate }
        }).sort({ createdAt: 1 });

        if (sensorData.length === 0) {
            return res.status(404).json({ error: 'No se encontraron datos en el rango de fechas especificado' });
        }

        res.json(sensorData);
    } catch (error) {
        console.error('Error obteniendo datos en el rango de tiempo:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};