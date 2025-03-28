const Device = require('../models/Device');

exports.registerDevice = async (req, res) => {
    try {
        const { id, ip } = req.body;

        if (!id) {
            return res.status(400).json({ message: "ID del dispositivo es requerido" });
        }

        let device = await Device.findOne({ id });

        if (!device) {
            // Si el dispositivo no existe, lo creamos
            device = new Device({
                id,
                name: "Nuevo Dispositivo",
                building: null,
                space: null,
                deleted: false
            });
            await device.save();
            console.log("[INFO] Nuevo dispositivo registrado:", device);
        } else if (device.deleted) {
            // Si el dispositivo existe pero está marcado como eliminado, lo restauramos
            device.deleted = false;
            await device.save();
            console.log("[INFO] Dispositivo restaurado:", device);
        } else {
            console.log("[INFO] Dispositivo ya existente y no eliminado:", device);
        }

        return res.status(200).json({ message: "Dispositivo registrado correctamente", device });
    } catch (error) {
        console.error("[ERROR] Error en el registro del dispositivo:", error);
        return res.status(500).json({ message: "Error en el servidor" });
    }
};

exports.getDevices = async (req, res) => {
    try {
        const devices = await Device.find({ deleted: { $ne: true } })
            .populate('building', 'name')
            .populate('space', 'name');

        if (devices.length === 0) {
            return res.status(404).json({ message: 'No devices found' });
        }

        return res.status(200).json(devices);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

exports.getDevice = async (req, res) => {
    try {
        const { deviceId } = req.params;
        const device = await Device.findOne({ _id: deviceId, deleted: { $ne: true } });

        if (!device) {
            return res.status(404).json({ message: 'Device not found' });
        }

        return res.status(200).json(device);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteDevice = async (req, res) => {
    try {
        const { deviceId } = req.params;

        const device = await Device.findOneAndUpdate(
            { _id: deviceId, deleted: { $ne: true } }, 
            { deleted: true }, 
            { new: true }
        );

        if (!device) {
            return res.status(404).json({ message: 'Dispositivo no encontrado o ya eliminado' });
        }

        return res.status(200).json({ message: 'Dispositivo eliminado correctamente', device });
    } catch (error) {
        console.error("[ERROR] Error eliminando el dispositivo:", error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
};

exports.updateDevice = async (req, res) => {
    try {
        const { deviceId } = req.params;
        const { name, building, space } = req.body;

        const device = await Device.findOne({ _id: deviceId, deleted: { $ne: true } });

        if (!device) {
            return res.status(404).json({ message: 'Device not found or deleted' });
        }

        if (name) device.name = name;
        if (building) device.building = building;
        if (space) device.space = space;

        await device.save();

        return res.status(200).json({ message: 'Device updated successfully', device });
    } catch (error) {
        console.error("[ERROR] Error updating the device:", error);
        return res.status(500).json({ message: 'Error in server' });
    }
};
