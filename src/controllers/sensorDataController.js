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
        const { start, end, sensorName } = req.query;

        if (!deviceId) {
            return res.status(400).json({ error: 'ID de dispositivo requerido' });
        }

        const objectId = new mongoose.Types.ObjectId(deviceId);

        if (!start || !end) {
            return res.status(400).json({ error: 'Debe proporcionar un rango de fechas (start y end)' });
        }

        const startDate = new Date(start);
        const endDate = new Date(end);

        // Construye la consulta para buscar el sensor específico por nombre
        let query = {
            device: objectId,
            sensorName: sensorName  // Filtramos por el nombre del sensor
        };

        // Primero obtén los documentos del sensor
        const sensors = await SensorData.find(query);

        if (sensors.length === 0) {
            return res.status(404).json({ error: 'No se encontraron datos para los parámetros especificados' });
        }

        // Para cada sensor, filtra los datos dentro del rango de fechas
        const result = sensors.map(sensor => {
            const filteredData = sensor.data.filter(item => {
                const itemDate = new Date(item.time);
                return itemDate >= startDate && itemDate <= endDate;
            }).sort((a, b) => new Date(a.time) - new Date(b.time));

            return {
                _id: sensor._id,
                sensorName: sensor.sensorName,
                thresholds: sensor.thresholds,
                device: sensor.device,
                data: filteredData
            };
        });

        res.json(result);
    } catch (error) {
        console.error('Error obteniendo datos en el rango de tiempo:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};


// Actualizar los thresholds de un sensor
exports.updateSensorThresholds = async (req, res) => {
    try {
        const { deviceId, sensorId } = req.params;
        const { thresholds } = req.body;
        
        if (!thresholds || !thresholds.upper) {
            return res.status(400).json({ error: 'Se requieren ambos umbrales (lower y upper)' });
        }

        const sensor = await SensorData.findOne({ 
            device: deviceId,
            _id: sensorId 
        });

        console.log(sensor)

        if (!sensor) {
            return res.status(404).json({ error: 'Sensor no encontrado' });
        }
        
        sensor.thresholds = {
            upper: thresholds.upper,
            lower: thresholds.lower 
        };

        console.log(sensor)
        
        await sensor.save();
        
        res.json(sensor);
    } catch (error) {
        console.error('Error actualizando thresholds:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};
