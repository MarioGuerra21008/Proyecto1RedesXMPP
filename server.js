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

// Ruta para establecer el estado de presencia
app.post("/setPresence", async (req, res) => {
    const { status, message } = req.body;
    try {
        await xmppClient.setPresenceMessage(status, message);
        res.status(200).send(`Estado de presencia actualizado a "${status}"`);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Ruta para ver el estado actual del usuario
app.get("/viewStatus", async (req, res) => {
    try {
        const status = await xmppClient.viewStatus();
        res.status(200).json(status);
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

// Ruta para mostrar detalles de un contacto específico
app.post("/contactDetails", async (req, res) => {
    const { name } = req.body;
    try {
        const contacts = await xmppClient.showUser(name);
        const contact = contacts.find(contact => contact.name === name);
        if (contact) {
            res.status(200).json(contact);
        } else {
            res.status(404).send("Contacto no encontrado.");
        }
    } catch (err) {
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

// Ruta para enviar un mensaje privado
app.post("/sendPrivateMessage", async (req, res) => {
    const { recipient, message } = req.body;
    console.log("Enviando mensaje a:", recipient); // Log para verificar el destinatario
    try {
        await xmppClient.privateMessage(recipient, message);
        res.status(200).send(`Mensaje enviado a ${recipient}`);
    } catch (err) {
        console.error('Error en la ruta /sendPrivateMessage:', err.message); // Log del error
        res.status(500).send(err.message);
    }
});

// Ruta para crear una sala de chat grupal
app.post("/createGroupChat", async (req, res) => {
    const { roomName } = req.body;
    try {
        xmppClient.createGroupChat(roomName);
        res.status(200).send(`Sala de chat grupal "${roomName}" creada.`);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Ruta para unirse a una sala de chat grupal
app.post("/joinGroupChat", async (req, res) => {
    const { roomName } = req.body;
    try {
        xmppClient.joinGroupChat(roomName);
        res.status(200).send(`Te has unido a la sala de chat grupal "${roomName}".`);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Ruta para enviar un mensaje o imagen a una sala de chat grupal
app.post("/sendGroupMessage", async (req, res) => {
    const { roomName, message } = req.body;
    try {
        await xmppClient.handleGroupMessages(roomName, message);
        res.status(200).send(`Mensaje enviado al chat grupal "${roomName}".`);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
