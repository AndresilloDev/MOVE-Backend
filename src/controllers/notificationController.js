const Notification = require("../models/Notification");
const Device = require("../models/Device");
const SensorData = require("../models/SensorData");

// Obtener todas las notificaciones NO archivadas
exports.getUnfiledNotifications = async (req, res) => {
    try {
        const { deviceId, sensorType } = req.query;

        let device = {};
        if (deviceId) device = Device.findById(deviceId);

        if (deviceId && sensorType) {
            const notifications = await Notification.find({
                status: true,
                device: device.name,
                sensor: sensorType
            });
            return res.json(notifications);
        }
        const notifications = await Notification.find({ status: true });
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ error: `Error al obtener las notificaciones no archivadas: ${error.message}` });
    }
};

// Obtener una notificación por ID
exports.getNotification = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id).populate("device");
        if (!notification) {
            return res.status(404).json({ error: "Notificación no encontrada" });
        }
        console.log(notification);
        res.json(notification);
    } catch (error) {
        res.status(500).json({ error: "Error al buscar la notificación" });
    }
};

// Obtener todas las notificaciones archivadas
exports.getFiledNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ status: false });
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ error: `Error al obtener las notificaciones archivadas: ${error.message}` });
    }
};

// Obtener una notificación archivada por ID
exports.getFiledNotification = async (req, res) => {
    try {
        const notification = await Notification.findOne({ _id: req.params.id, status: false });
        if (!notification) {
            return res.status(404).json({ error: "Notificación archivada no encontrada" });
        }
        res.json(notification);
    } catch (error) {
        res.status(500).json({ error: "Error al buscar la notificación archivada" });
    }
};

// Crear una nueva notificación
const moment = require('moment');
exports.createNotification = async (req, res) => {
    try {
        const { name, date, sensor, device, image } = req.body;

        // Verificar si el dispositivo existe
        const existingDevice = await Device.findById(device);
        if (!existingDevice) {
            return res.status(400).json({ error: "El dispositivo especificado no existe" });
        }

        // Verificar si el sensor existe en el dispositivo
        const existingSensor = await SensorData.findOne({ device, sensorName: sensor });
        if (!existingSensor) {
            return res.status(400).json({ error: "El sensor especificado no existe en este dispositivo" });
        }

        // Convertir la fecha al formato correcto
        const formattedDate = moment(date).format('YYYY-MM-DD HH:mm:ss');

        const newNotification = new Notification({
            name,
            date: formattedDate,
            sensor,
            device,
            image,
            status: true
        });

        await newNotification.save();
        res.status(201).json(newNotification);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


// Archivar una notificación (cambiar su estado a false)
exports.filedNotification = async (req, res) => {
    try {
        const updatedNotification = await Notification.findByIdAndUpdate(
            req.params.id,
            { status: false },
            { new: true }
        );
        if (!updatedNotification) {
            return res.status(404).json({ error: "Notificación no encontrada" });
        }
        res.json(updatedNotification);
    } catch (error) {
        res.status(500).json({ error: "Error al archivar la notificación" });
    }
};
exports.updateNotificationImage = async (req, res) => {
    // console.log('Recibida petición para actualizar imagen de notificación');
    try {
        const { id, image } = req.body;
        
        // console.log(`ID de notificación: ${id}`);
        // console.log(`Tamaño de la imagen: ${image ? (image.length / 1024).toFixed(2) : 0} KB`);
        
        if (!id || !image) {
            console.log('Error: ID o imagen faltantes en la petición');
            return res.status(400).json({ error: "ID e imagen son requeridos" });
        }
        
        // console.log('Intentando actualizar la notificación "segun"...');
        
        const updated = await Notification.findByIdAndUpdate(
            id,
            { image },
            { new: true }
        );
        
        if (!updated) {
            console.log(`Error: No se encontró ninguna notificación con ID: ${id}`);
            return res.status(404).json({ error: "Notificación no encontrada" });
        }
        
        // console.log('Imagen actualizada correctamente para la notificación');
        // console.log(`Detalles: NotificaciónID=${updated._id}, Nombre=${updated.name}`);
        
        res.json(updated);
    } catch (error) {
        console.error('Error al actualizar la imagen:', error);
        // Log detallado del error
        if (error.name === 'CastError') {
            console.log('Error de tipo: El ID proporcionado no tiene el formato correcto');
        } else if (error.name === 'ValidationError') {
            console.log('Error de validación:', error.message);
        } else {
            console.log('Tipo de error:', error.name);
            console.log('Mensaje de error:', error.message);
        }
        
        res.status(500).json({ error: "Error al actualizar la imagen" });
    }
};
