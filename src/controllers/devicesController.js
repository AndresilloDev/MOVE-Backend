const Building = require('../models/Building');
const Device = require('../models/Device');
const Space = require('../models/Space');

exports.registerDevice = async (req, res) => {
    try {
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({ message: "ID del dispositivo es requerido" });
        }

        let device = await Device.findOne({ id });

        if (!device) {
            device = new Device({
                id,
                name: "Nuevo Dispositivo",  // Nombre fijo como lo querías
                building: null,
                space: null,
                deleted: false
            });
            await device.save();
            console.log("[INFO] Nuevo dispositivo registrado:", device);
        } else if (device.deleted) {
            device.deleted = false;
            device.name = "Nuevo Dispositivo";  // Resetear el nombre si estaba eliminado
            await device.save();
            console.log("[INFO] Dispositivo restaurado:", device);
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

        const device = await Device.findOne({ _id: deviceId });

        if (!device) {
            return res.status(404).json({ message: 'Device not found or deleted' });
        }

        device.name = name;

        //Obtener el id del espacio y del edificio a actualizar
        if (building) {
            const buildingId = await Building.findOne({ name: building.name });
            device.building = buildingId ? buildingId._id : null;
        }

        if (space) {
            const spaceId = await Space.findOne({ name: space.name, building: device.building });
            device.space = spaceId ? spaceId._id : null;
        }

        await device.save();

        return res.status(200).json({ message: 'Device updated successfully', device });
    } catch (error) {
        console.error("[ERROR] Error updating the device:", error);
        return res.status(500).json({ message: 'Error in server' });
    }
};