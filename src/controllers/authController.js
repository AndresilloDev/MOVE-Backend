const User = require("../models/User");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const crypto = require('crypto');
const { sendRecoverPasswordEmail, sendConfirmationEmail}  = require("../config/emailService");

// Login de usuario
exports.loginAuth = async (req, res) => {
    const { user, password } = req.body;
    const findUser = await User.findOne({user: user, status: true}).exec();

    if (!findUser) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const isValid = await bcrypt.compare(password, findUser.password);

    if (!isValid) {
        return res.status(401).json({ error: 'La contraseña es incorrecta' });
    }

    const token = jwt.sign({ id: findUser._id, user: findUser.user }, process.env.JWT_SECRET, {
        expiresIn: '1h',
    })

    const newUser = {
        _id: findUser._id,
        name: findUser.name,
        user: findUser.user,
        lastName: findUser.lastName,
        status: findUser.status,
        isAdmin: findUser.isAdmin
    }

    if (req.headers['user-agent'] && req.headers['user-agent'].includes('Mozilla')) {
        res.cookie('access_token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            expires: new Date(Date.now() + 60 * 60 * 1000),
        }).status(200).json({ user: newUser });
    } else {
        res.status(200).json({ user: newUser, token });
    }
};

// Logout de usuario
exports.logoutAuth = async (req, res) => {
    res.clearCookie('access_token')
        .json({ message: "Sesión Cerrada"})
};

exports.checkAuth = async (req, res) => {
    try {
        let token;

        if (req.cookies && req.cookies.access_token) {
            token = req.cookies.access_token;
        } else if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer ")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({ error: "Token no proporcionado" });
        }

        jwt.verify(token, process.env.JWT_SECRET);
        return res.sendStatus(200);
    } catch (error) {
        return res.status(401).json({ error: "Token inválido o expirado" });
    }
};

exports.recoverPasswordAuth = async (req, res) => {
    const { user } = req.body;

    try {
        let token = crypto.randomBytes(32).toString('base64url');
        const findUser = await User.findOne({user: user}).exec();
        if (!findUser) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        await sendRecoverPasswordEmail(user, token);

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

exports.confirmEmailAuth = async (req, res) => {
    const { user } = req.body;

    try {
        let token = crypto.randomBytes(32).toString('base64url');
        const findUser = await User.findOne({user: user}).exec();
        if (!findUser) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        await sendConfirmationEmail(user, token);

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