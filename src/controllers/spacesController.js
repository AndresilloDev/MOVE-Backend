const Space = require('../models/Space');
const Building = require('../models/Building');
const Device = require('../models/Device');

//Obtener todos los espacios por buildingId
exports.getSpacesByBuildingId = async(req, res) => {
    try {
        const { buildingId } = req.params;

        const building = await Building.findById(buildingId);
        if(!building) {
            return res.status(404).json({ message: "El edificio asociado no se encuentra" });
        }

        const spaces = await Space.find({ building: buildingId });

        const spacesWithCounts = await Promise.all(
            spaces.map(async (space) => {
                const deviceCount = await Device.countDocuments({ space: space._id });
                return {
                    _id: space._id,
                    name: space.name,
                    deviceCount: deviceCount
                };
            }
        ));
        res.json(spacesWithCounts);
    } catch(error) {
        res.status(500).json({ message: "Error al obtener los espacios" });
    }
}

//Obtener un espacio por su id
exports.getSpaceById = async (req, res) => {
    try {
        const { buildingId, spaceId } = req.params;
        const building = await Building.findById(buildingId);

        if (!building) {
            return res.status(404).json({ message: "No se ha encontrado el edificio" });
        }

        const space = await Space.findOne({ _id: spaceId, building: buildingId });
        if (!space) {
            return res.status(404).json({ message: "No se ha encontrado el espacio" });
        }

        const deviceCount = await Device.countDocuments({ space: space._id });

        res.json({
            _id: space._id,
            name: space.name,
            deviceCount
        });
    } catch (error) {
        return res.status(500).json({ message: "Error al obtener el espacio" });
    }
};

//Crear un espacio dentro de un edificio
exports.createSpace = async(req, res) => {
    try{
        const { buildingId } = req.params;
        const building = await Building.findById(buildingId);
        if (!building) {
            return res.status(404).json({ message: "El edificio no se ha encontrado" })
        }

        const { name } = req.body;
        const newSpace = new Space({ name, building: buildingId });
        await newSpace.save();

        res.status(201).json(newSpace);
    } catch(error) {
        return res.status(500).json({ message: `Error al crear el espacio: ${error}` });
    }
}

//Actualizar el espacio de un edificio
exports.updateSpace = async(req, res) => {
    try {
        const { buildingId, spaceId } = req.params;
        const { name } = req.body;

        const building = await Building.findById(buildingId);
        if(!building) {
            return res.status(404).json({ message: "El edificio no se ha encontrado" });
        }
        
        const space = await Space.findById(spaceId);
        if(!space) {
            return res.status(404).json({ message: "El espacio no se ha encontrado" });
        }

        const updatedSpace = await Space.findOneAndUpdate(
            {_id: spaceId, building: buildingId},
            { name },
            { new: true, runValidators: true }
        );

        if(!updatedSpace){
            return res.status(404).json({ message: "Espacio no encontrado en el edificio" });
        }

        res.json(updatedSpace);
    } catch (error) {
        return res.status(500).json({ message: "Error al actualizar el espacio" });
    }
}

//Eliminar espacio en un edificio
exports.deleteSpace = async(req, res) => {
    try {
        const {
            buildingId,
            spaceId
        } = req.params;

        const building = await Building.findById(buildingId);
        if (!building) {
            return res.status(404).json({ message: "El edificio no se ha encontrado" });
        }

        const deletedSpace = await Space.findOneAndDelete({ _id: spaceId, building: buildingId });

        if(!deletedSpace) {
            return res.status(404).json({ message: "Espacio no encontrado en el edificio" });
        }

        res.json( deletedSpace )

    } catch(error) {
        return res.status(500).json({ message: "Error al eliminar el espacio" })
    }
}