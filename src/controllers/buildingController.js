const Building = require("../models/Building");
const Space = require("../models/Space");
const Device = require("../models/Device")

exports.getAllBuildings = async (req, res) => {
    try {
        const buildings = await Building.find();

        const buildingsWithCounts = await Promise.all(
            buildings.map(async (building) => {
                const spaceCount = await Space.countDocuments({ building: building._id });

                const spaceIds = await Space.find({ building: building._id }).select('_id');
                const deviceCount = await Device.countDocuments({ space: { $in: spaceIds.map(s => s._id) } });

                return {
                    _id: building._id,
                    name: building.name,
                    spaceCount,
                    deviceCount
                };
            })
        );

        res.json(buildingsWithCounts);
    } catch (error) {
        res.status(500).json({ error: `Error al obtener los edificios: ${error.message}` });
    }
};

// Obtener un edificio por nombre
exports.getBuildingByName = async (req, res) => {
    try {
        const building = await Building.findOne({ name: req.params.name });
        if (!building) {
            return res.status(404).json({ error: 'Edificio no encontrado' });
        }
        res.json(building);
    } catch (error) {
        res.status(500).json({ error: 'Error al buscar el edificio' });
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
        const buildingId = req.params.id;
        const deletedBuilding = await Building.findByIdAndDelete(buildingId);
        if (!deletedBuilding) {
            return res.status(404).json({ error: 'Edificio no encontrado' });
        }

        await Space.deleteMany({ building: buildingId });

        await Device.updateMany(
            { 
                $or: [
                    { building: buildingId }, 
                    { space: { $in: await Space.find({ building: buildingId }).select("_id") } }
                ] 
            },
            { $unset: { building: "", space: "" } }
        );

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