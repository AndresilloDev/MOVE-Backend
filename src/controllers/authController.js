const User = require("../models/User");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

// Login de usuario
exports.loginAuth = async (req, res) => {
    const { user, password } = req.body;
    const findUser = await User.findOne({user: user}).exec();

    if (!findUser) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const isValid = await bcrypt.compare(password, findUser.password);

    if (!isValid) {
        return res.status(401).json({ error: 'La contraseña es incorrecta' });
    }

    // Creamos un token y mandamos los parametros _id y user
    const token = jwt.sign({ id: findUser._id, user: findUser.user }, process.env.JWT_SECRET, {
        expiresIn: '1h',
    })

    const newUser = {
        _id: findUser._id,
        name: findUser.name,
        user: findUser.user,
        status: findUser.status,
    }

    res.cookie('access_token', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        expires: new Date(Date.now() + 60 * 60 * 1000),
    }).status(200).json({ user: newUser, token });
};

// Logout de usuario
exports.logoutAuth = async (req, res) => {
    res.clearCookie('access_token')
        .json({ message: "Sesión Cerrada"})
};