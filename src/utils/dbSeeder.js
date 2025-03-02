/*
const mongoose = require("mongoose");
const Building = require("../models/Building");
const Space = require("../models/Space");

const buildings = [
    { name: "D1" },
    { name: "D2" },
    { name: "D3" },
    { name: "D4" },
    { name: "D5" },
    { name: "CECADEC" },
    { name: "CEVISET" },
    { name: "RECTORIA" },
    { name: "TALLER_PESADO_1" },
    { name: "TALLER_PESADO_2" },
    { name: "CEDIM" },
];

const spaces = [
    { name: "A1", building: "D1" },
    { name: "A2", building: "D1" },
    { name: "CC1", building: "D1" },
    { name: "CC2", building: "D1" },
    { name: "A1", building: "D2" },
    { name: "A2", building: "D2" },
    { name: "CC3", building: "D2" },
    { name: "CC4", building: "D2" },
    { name: "A1", building: "D3" },
    { name: "A2", building: "D3" },
    { name: "CC5", building: "D3" },
    { name: "CC6", building: "D3" },
    { name: "A1", building: "D4" },
    { name: "A2", building: "D4" },
    { name: "CC7", building: "D4" },
    { name: "CC8", building: "D4" },
    { name: "A1", building: "D5" },
    { name: "A2", building: "D5" },
    { name: "CC9", building: "D5" },
    { name: "CC10", building: "D5" },
];

const seedDatabase = async () => {
    await mongoose.connect("mongodb://localhost:27017/miapp");

    await Building.deleteMany();
    await Space.deleteMany();

    const insertedBuildings = await Building.insertMany(buildings);
    const buildingMap = Object.fromEntries(
        insertedBuildings.map((b) => [b.name, b._id])
    );

    const spacesWithIds = spaces.map((s) => ({
        name: s.name,
        building: buildingMap[s.building],
    }));
    await Space.insertMany(spacesWithIds);

    console.log("Datos insertados exitosamente");
    mongoose.connection.close();
};

seedDatabase();
*/