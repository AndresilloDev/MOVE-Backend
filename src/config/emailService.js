const nodemailer = require ('nodemailer');

const userGmail = "move.utez@gmail.com"
const passGmail = "feof dedw drzw xrkp"

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: userGmail,
        pass: passGmail,
    }
})

const sendRecoverPasswordEmail = async (user, token) => {
    const mailOptions = {
        from: passGmail,
        to: user,
        subject: "Recuperar Contraseña",
        html:
            `<!DOCTYPE html>
<html lang="es"\>
<head>
    <meta charset="UTF-8"\>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"\>
    <title>Restablecer Contraseña</title>
    <style>
        body {
            font-family: Helvetica, Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
        }
        .divider {
            border-top: 2px solid #000000;
            margin: 20px 0;
        }
        .message {
            font-size: 16px;
            color: #000000;
            margin-bottom: 20px;
            text-align: center;
        }
        .verification-code {
            font-size: 20px;
            font-weight: bold;
            color: #9332EB;
            margin: 20px 0;
            text-align: center;
        }
        .square {
            display: inline-block;
            background-color: #9332EB;
            color: white;
            padding: 10px 20px;
            margin: 5px;
            border-radius: 5px;
            font-size: 24px;
            text-align: center;
        }
        .footer {
            font-size: 14px;
            color: #555555;
            margin-top: 20px;
            text-align: center;
        }
        .button {
            background-color: #DEFF35;
            color: black;
            border-radius: 10px;
            margin: 5px;
            margin-bottom: 10px;
            padding: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="divider"></div>
        <div class="message"\>
            Para restablecer su contraseña, haga clic en el botón que aparece a continuación. El enlace se autodestruirá después de 2 horas.
        </div>
        <div class="divider"\></div>
        <div class="footer">
            <a href="http://localhost:5173/recover-password?token=${token}&user=${user}" class="button">Restablecer Contraseña</a>
            <br>
            <br>
            Si no desea cambiar su contraseña o no solicitó un restablecimiento, puede ignorar y eliminar este correo electrónico.
        </div>
    </div>
</body>
</html>`
    }

    try {
        await transporter.sendMail(mailOptions);
        console.log("Correo enviado");
    } catch (error) {
        console.log(error);
    }
}

const sendConfirmationEmail = async (user, token) => {
    const mailOptions = {
        from: passGmail,
        to: user,
        subject: "Confirmar Cuenta",
        html:
            `<!DOCTYPE html>
<html lang="es"\>
<head>
    <meta charset="UTF-8"\>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"\>
    <title>Restablecer Contraseña</title>
    <style>
        body {
            font-family: Helvetica, Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
        }
        .divider {
            border-top: 2px solid #000000;
            margin: 20px 0;
        }
        .message {
            font-size: 16px;
            color: #000000;
            margin-bottom: 20px;
            text-align: center;
        }
        .verification-code {
            font-size: 20px;
            font-weight: bold;
            color: #9332EB;
            margin: 20px 0;
            text-align: center;
        }
        .square {
            display: inline-block;
            background-color: #9332EB;
            color: white;
            padding: 10px 20px;
            margin: 5px;
            border-radius: 5px;
            font-size: 24px;
            text-align: center;
        }
        .footer {
            font-size: 14px;
            color: #555555;
            margin-top: 20px;
            text-align: center;
        }
        .button {
            background-color: #DEFF35;
            color: black;
            border-radius: 10px;
            margin: 5px;
            margin-bottom: 10px;
            padding: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="divider"></div>
        <div class="message"\>
            Haz sido invitado a MOVE, para confirmar su cuenta y cambiar su contraseña, haga clic en el botón que aparece a continuación. El enlace se autodestruirá después de 2 horas.
        </div>
        <div class="message"\>
            Correo electrónico: ${user}
        </div>
        <div class="divider"\></div>
        <div class="footer">
            <a href="http://localhost:5173/recover-password?token=${token}&user=${user}" class="button">Comenzar</a>
            <br>
            <br>
            Si no desea cambiar su contraseña o no solicitó un restablecimiento, puede ignorar y eliminar este correo electrónico.
        </div>
    </div>
</body>
</html>`
    }

    try {
        await transporter.sendMail(mailOptions);
        console.log("Correo enviado");
    } catch (error) {
        console.log(error);
    }
}

module.exports = {sendRecoverPasswordEmail, sendConfirmationEmail};