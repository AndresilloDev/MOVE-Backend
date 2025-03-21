const User = require("../models/User");
const bcrypt = require('bcrypt');

// Obtener todos los usuarios
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los usuarios' });
    }
};

// Obtener un usuario por ID
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Error al buscar el usuario' });
    }
};

// Crear un nuevo usuario
exports.createUser = async (req, res) => {
    try {
        const { name } = req.body;
        const { lastName } = req.body;
        const { user } = req.body;
        let { password } = req.body;

        if (await User.findOne({user: user}).exec()) {
            return res.status(404).json({ error: 'Usuario ya existente' });
        }

        password = await bcrypt.hash(password, 12);

        const newUser = new User({ name, lastName, user, password });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error: "Error al crear el usuario" });
    }
};

// Actualizar un usuario
exports.updateUser = async (req, res) => {
    try {
        const { name } = req.body;
        const { lastName } = req.body;
        const { user } = req.body;
        const { password } = req.body;
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { name, lastName, user, password },
            { new: true, runValidators: true }
        );
        if (!updatedUser) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.json(updatedUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Eliminar un usuario
exports.changeStatus = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        user.status = !user.status;
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al cambiar el estado del usuario' });
    }
};
