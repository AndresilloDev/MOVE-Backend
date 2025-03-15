const Notification = require("../models/Notification");
const Device = require("../models/Device");
const SensorData = require("../models/SensorData");

// Obtener todas las notificaciones
exports.getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find();
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ error: `Error al obtener las notificaciones: ${error.message}` });
    }
};

// Obtener una notificación por ID
exports.getNotification = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);
        if (!notification) {
            return res.status(404).json({ error: "Notificación no encontrada" });
        }
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
exports.createNotification = async (req, res) => {
    try {
        const { name, date, sensor, device } = req.body;

        // Verificar si el dispositivo existe
        const existingDevice = await Device.findById(device);
        if (!existingDevice) {
            return res.status(400).json({ error: "El dispositivo especificado no existe" });
        }

        // Verificar si el sensor existe para el dispositivo
        const existingSensor = await SensorData.findOne({ device, sensorName: sensor });
        if (!existingSensor) {
            return res.status(400).json({ error: "El sensor especificado no existe en este dispositivo" });
        }

        const newNotification = new Notification({
            name,
            date: date || new Date(),
            sensor,
            device,
            status: true
        });

        await newNotification.save();
        res.status(201).json(newNotification);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Archivar una notificación (cambiar su estado a false)
exports.fileNotification = async (req, res) => {
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
