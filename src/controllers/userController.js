const User = require("../models/User");

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
        const { password } = req.body;
        const { status } = true;
        const newUser = new User({ name, lastName, user, password, status });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Actualizar un usuario
exports.updateUser = async (req, res) => {
    try {
        const { name } = req.body;
        const { lastName } = req.body;
        const { user } = req.body;
        const { password } = req.body;
        const { status } = req.body;
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { name, lastName, user, password, status },
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
exports.deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el edificio' });
    }
};
