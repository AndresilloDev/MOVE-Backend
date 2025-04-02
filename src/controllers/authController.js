const User = require("../models/User");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const crypto = require('crypto');
const sendVerificationEmail  = require("../config/emailService");

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

exports.checkAuth = async (req, res) => {
    try {
        jwt.verify(req.cookies.access_token, process.env.JWT_SECRET);
    } catch {
        res.status(401).end();
    }
}

exports.recoverPasswordAuth = async (req, res) => {
    const { user } = req.body;

    try {
        let token = crypto.randomBytes(32).toString('base64url');
        const findUser = await User.findOne({user: user}).exec();
        if (!findUser) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        await sendVerificationEmail(user, token);

        token = await bcrypt.hash(token, 12);
        await User.findByIdAndUpdate(
            findUser._id,
            { token },
            {
                new: true,
                runValidators: true,
                context: 'query'
            }
        );

        res.status(200).json({ message: "Correo enviado" });
    } catch (error) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
    }
}

exports.changePasswordAuth = async (req, res) => {
    const password = await bcrypt.hash(req.body.password, 12);
    const { token, user } = req.body;

    try {
        const findUser = await User.findOne({user: user}).exec();
        if (!findUser) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const isValid = await bcrypt.compare(token, findUser.token);
        if (!isValid) {
            return res.status(401).json({ error: 'El token expiro' });
        }

        await User.findByIdAndUpdate(
            findUser._id,
            { password },
            {
                new: true,
                runValidators: true,
                context: 'query'
            }
        );

        res.status(200).json({ message: "Contraseña cambiada correctamente" });
    } catch (error) {
        return res.status(500).json({ error: 'Error en el servidor' + error });
    }
}