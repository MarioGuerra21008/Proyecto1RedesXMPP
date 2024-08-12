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

// Ruta para eliminar cuenta
app.post("/deleteAccount", async (req, res) => {
    try {
        await xmppClient.deleteAccount();
        res.status(200).send("Cuenta eliminada");
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Ruta para añadir un contacto
app.post("/addContact", async (req, res) => {
    const { contact } = req.body;
    console.log("Añadiendo contacto:", contact); // Log para verificar el contacto
    try {
        await xmppClient.addContact(contact);
        res.status(200).send(`Solicitud enviada a ${contact}`);
    } catch (err) {
        console.error('Error en la ruta /addContact:', err.message); // Log del error
        res.status(500).send(err.message);
    }
});

// Ruta para ver solicitudes de amistad
app.get("/viewFriendRequests", async (req, res) => {
    try {
        const requests = await xmppClient.viewFriendRequests();
        res.status(200).send(requests);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Ruta para aceptar una solicitud de amistad
app.post("/acceptFriendRequest", async (req, res) => {
    const { jid, alias } = req.body;
    console.log("Aceptando solicitud de amistad de:", jid); // Log para verificar el JID
    try {
        await xmppClient.acceptFriendRequest(jid, alias);
        res.status(200).send(`Has aceptado la solicitud de amistad de ${jid.split('@')[0]}.`);
    } catch (err) {
        console.error('Error en la ruta /acceptFriendRequest:', err.message); // Log del error
        res.status(500).send(err.message);
    }
});

// Ruta para mostrar usuarios y su estado
app.get("/contacts", async (req, res) => {
    try {
        const contacts = await xmppClient.showUsersInServer();
        res.status(200).json(contacts);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
