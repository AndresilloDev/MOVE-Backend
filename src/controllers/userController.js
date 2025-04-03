const User = require("../models/User");
const bcrypt = require('bcrypt');

// Obtener todos los usuarios
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({status: true});
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
        const { name, lastName, user, password } = req.body;

        if (!name || !lastName || !user || !password) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(user)) {
            return res.status(400).json({ error: 'Formato de correo electrónico inválido' });
        }

        const existingUser = await User.findOne({ user }).exec();
        if (existingUser) {
            return res.status(409).json({ error: 'Usuario ya existente' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = new User({ 
            name, 
            lastName, 
            user, 
            password: hashedPassword,
            status: true,  // Establecer estado activo por defecto
            isSuperAdmin: false  // Establecer permisos por defecto
        });

        await newUser.save();

        // Devolver usuario sin la contraseña
        const userResponse = newUser.toObject();
        delete userResponse.password;

        res.status(201).json(userResponse);

    } catch (error) {
        console.error("Error al crear el usuario:", error);
        res.status(500).json({ error: "Error interno del servidor al crear el usuario" });
    }
};

// Actualizar un usuario
exports.updateUser = async (req, res) => {
    try {
        const { name, lastName } = req.body;

        // Validación básica
        if (!name || !lastName) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { name, lastName },
            {
                new: true,  
                runValidators: true,  
                context: 'query' 
            }
        );

        if (!updatedUser) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json(updatedUser);
    } catch (error) {
        console.error("Error al actualizar usuario:", error);
        res.status(400).json({ error: error.message });
    }
};

// Eliminar un usuario
exports.changeStatus = async (req, res) => {
    try {
        const status = false;

        await User.findByIdAndUpdate(
            req.params.id,
            { status },
            {
                new: true,
                runValidators: true,
                context: 'query'
            }
        );

        res.status(200).json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al cambiar el estado del usuario' });
    }
};
