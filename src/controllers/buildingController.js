const Building = require("../models/Building");
const Space = require("../models/Space");

// Obtener todos los edificios
exports.getAllBuildings = async (req, res) => {
    try {
        const buildings = await Building.find();
        res.json(buildings);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los edificios' });
    }
};

// Obtener un edificio por ID
exports.getBuildingById = async (req, res) => {
    try {
        const building = await Building.findById(req.params.id);
        if (!building) {
            return res.status(404).json({ error: 'Edificio no encontrado' });
        }
        res.json(building);
    } catch (error) {
        res.status(500).json({ error: 'Error al buscar el edificio' });
    }
};

// Crear un nuevo edificio
exports.createBuilding = async (req, res) => {
    try {
        const { name } = req.body;
        const newBuilding = new Building({ name });
        await newBuilding.save();
        res.status(201).json(newBuilding);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Actualizar un edificio
exports.updateBuilding = async (req, res) => {
    try {
        const { name } = req.body;
        const updatedBuilding = await Building.findByIdAndUpdate(
            req.params.id,
            { name },
            { new: true, runValidators: true }
        );
        if (!updatedBuilding) {
            return res.status(404).json({ error: 'Edificio no encontrado' });
        }
        res.json(updatedBuilding);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Eliminar un edificio
exports.deleteBuilding = async (req, res) => {
    try {
        const deletedBuilding = await Building.findByIdAndDelete(req.params.id);
        if (!deletedBuilding) {
            return res.status(404).json({ error: 'Edificio no encontrado' });
        }
        res.json({ message: 'Edificio eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el edificio' });
    }
};

// Obtener la cantidad de espacios en un edificio
exports.getSpaceCountInBuilding = async (req, res) => {
    try {
        const { buildingId } = req.params;

        const spaceCount = await Space.countDocuments({ building: buildingId });

        res.status(200).json({ buildingId, spaceCount });
    } catch (error) {
        res.status(500).json({ message: `Error al obtener la cantidad de espacios: ${error.message}` });
    }
};

// Obtener la cantidad total de dispositivos en todos los espacios de un edificio
exports.getDeviceCountInBuilding = async (req, res) => {
    try {
        const { buildingId } = req.params;

        const spaces = await Space.find({ building: buildingId }).select('_id');

        const spaceIds = spaces.map(space => space._id);

        const deviceCount = await Device.countDocuments({ space: { $in: spaceIds } });

        res.status(200).json({ buildingId, deviceCount });
    } catch (error) {
        res.status(500).json({ message: `Error al obtener la cantidad de dispositivos: ${error.message}` });
    }
};