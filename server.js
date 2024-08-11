const express = require("express");
const bodyParser = require("body-parser");
const xmppClient = require("./xmppClient");

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static(__dirname));

// Ruta para registrarse
app.post("/register", async (req, res) => {
    const { username, password } = req.body;
    try {
        await xmppClient.register(username, password);
        res.status(200).send("Registro exitoso");
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Ruta para iniciar sesión
app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    try {
        await xmppClient.login(username, password);
        res.status(200).send("Inicio de sesión exitoso");
    } catch (err) {
        res.status(401).send(err.message);
    }
});

// Ruta para cerrar sesión
app.post("/logout", async (req, res) => {
    try {
        await xmppClient.logout();
        res.status(200).send("Sesión cerrada");
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
