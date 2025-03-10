const Device = require('../models/Device');

const getDevices = async (req, res) => {
    try {
        const devices = await Device.find({ deleted: { $ne: true } });
        if (devices.length === 0) {
            return res.status(404).json({ message: 'No devices found' });
        }
        return res.status(200).json(devices);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

const getDevice = async (req, res) => {
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

const deleteDevice = async (req, res) => {
    try {
        const { deviceId } = req.params;

        const device = await Device.findOne({ _id: deviceId });

        if (!device) {
            return res.status(404).json({ message: 'Device not found' });
        }

        device.deleted = true;
        await device.save();

        return res.status(200).json({ message: 'Device deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {getDevices,getDevice,deleteDevice};
