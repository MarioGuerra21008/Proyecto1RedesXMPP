// Importación de los módulos necesarios para manejar el cliente XMPP y construir stanzas XMPP.
const { client, xml } = require("@xmpp/client");
const {
    createRegisterStanza,
    createDeleteAccountStanza,
    createPresenceStanza,
    getRosterStanza,
    createAddContactStanza,
    createPrivateMessageStanza
} = require("./stanzasXmpp");

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// Configuración de dominio y servicio del servidor XMPP.
const domain = "alumchat.lol";
const service = "xmpp://alumchat.lol:5222";
let xmpp = null; // Variable para almacenar la instancia del cliente XMPP.
let username = null; // Almacena el nombre de usuario.
let password = null; // Almacena la contraseña.
let friendRequest = []; // Almacena las solicitudes de amistad pendientes.
let userStatus = "online"; // Almacena el estado de presencia del usuario.

// Función para registrar un nuevo usuario en el servidor XMPP.
async function register(usernameInput, passwordInput) {
    return new Promise(async (resolve, reject) => {
        if (xmpp) {
            reject(new Error("Ya hay una conexión existente."));
        }
        username = usernameInput;
        password = passwordInput;
        xmpp = client({
            service: service,
            domain: domain,
            username: username,
            password: password,
        });
        
        try {
            await xmpp.start(); // Inicia la conexión con el servidor.
        } catch (err) {
            reject(new Error("Usuario registrado. Por favor inicie sesión."));
        }

        const registerStanza = createRegisterStanza(username, password); // Crea la stanza de registro.

        xmpp.send(registerStanza).then(() => {
            console.log("Registro exitoso!");
            resolve();
        }).catch((err) => {
            if (err.condition !== "not-authorized") {
                reject(new Error("Error al registrarse." + err.message));
            }
        });
    });
}

// Función para iniciar sesión en el servidor XMPP.
async function login(usernameInput, passwordInput) {
    return new Promise(async (resolve, reject) => {
        username = usernameInput;
        password = passwordInput;
        xmpp = client({
            service: service,
            domain: domain,
            username: username,
            password: password,
        });

        xmpp.on("error", (err) => {
            if (err.condition !== "not-authorized") {
                reject(new Error("Error en la conexión: " + err.message));
            }
        });

        xmpp.on("online", async () => {
            console.log("Conexión exitosa.");
            const presenceStanza = createPresenceStanza("online"); // Crea la stanza de presencia para notificar estado "online".
            await xmpp.send(presenceStanza);
            resolve();

            // Maneja las stanzas entrantes.
            xmpp.on("stanza", async (stanza) => {
                if (stanza.is("message")) {
                    const body = stanza.getChild("body");
                    const from = stanza.attrs.from.split('@')[0];
                    if (body) {
                        const message = body.children[0];
                        console.log(`\nMensaje recibido de ${from}: ${message}`);
                    } 
                    else if (stanza.is('presence') && stanza.attrs.type === 'subscribe') {
                        const from = stanza.attrs.from;
                        friendRequest.push(from); // Almacena las solicitudes de amistad entrantes.
                    }
                }
            });
        });

        try {
            await xmpp.start(); // Inicia la conexión con el servidor.
        } catch (err) {
            if (err.condition === "not-authorized") {
                reject(new Error("Credenciales incorrectas!"));
            } else {
                reject(new Error("Lo siento, hubo un problema: " + err.message));
            }
        }
    });
}

// Función para cerrar sesión en el servidor XMPP.
async function logout() {
    if (xmpp !== null && xmpp.status === "online") {
        try {
            await xmpp.stop(); // Detiene la conexión con el servidor.
            xmpp = null;
            console.log("Desconectado.");
        } catch (err) {
            console.error('Error al desconectar:', err.message);
            throw err;
        }
    }
}

// Función para eliminar la cuenta de usuario en el servidor XMPP.
async function deleteAccount() {
    return new Promise((resolve, reject) => {
        if (!xmpp) {
            return reject(new Error("No ha iniciado sesión."));
        }

        const errorHandler = (err) => {
            if (err.condition === 'not-authorized') {
                console.log('Cuenta eliminada con éxito.');
                xmpp.removeListener('error', errorHandler);
                logout().then(resolve).catch(reject); // Desconecta al usuario tras eliminar la cuenta.
            } else {
                xmpp.removeListener('error', errorHandler);
                reject(new Error('Hubo un error al intentar borrar su cuenta: ' + err.message));
            }
        };

        xmpp.on('error', errorHandler);

        const deleteStanza = createDeleteAccountStanza(); // Crea la stanza de eliminación de cuenta.

        xmpp.send(deleteStanza).catch((err) => {
            xmpp.removeListener('error', errorHandler);
            reject(new Error('Hubo un error al intentar borrar su cuenta: ' + err.message));
        });
    });
}

// Función para establecer el mensaje y estado de presencia del usuario.
function setPresenceMessage(status, message) {
    let presenceAttributes = {};
    let presenceChildren = [];

    if (status === "offline") {
        presenceAttributes.type = "unavailable";
    } else if (status !== "online") {
        presenceChildren.push(xml("show", {}, status));
    }

    if (message) {
        presenceChildren.push(xml("status", {}, message));
        userPresenceMessage = message;
    }

    const presenceStanza = xml("presence", presenceAttributes, ...presenceChildren); // Crea la stanza de presencia.
    xmpp.send(presenceStanza);

    userStatus = status; // Actualiza el estado del usuario.
    console.log(`Estado establecido a "${status}" con el mensaje "${message || 'Ninguno'}".`);
}

// Función para ver el estado de presencia actual del usuario.
function viewStatus() {
    console.log(`Tu estado actual es: "${userStatus}"\nTu mensaje actual es: "${userPresenceMessage}"`);
}

// Función para añadir un contacto enviándole una solicitud de amistad.
async function addContact(contact) {
    try {
        const presenceStanza = createPresenceStanza("subscribe", `${contact}@${domain}`);
        xmpp.send(presenceStanza);
        console.log(`Solicitud de amistad enviada a ${contact}.`);
    } catch (err) {
        console.error('Error al añadir contacto:', err.message);
        throw err;
    }
}

// Función para añadir un contacto a la lista de contactos.
async function addContactToRoster(jid, alias) {
    try {
        const rosterStanza = createAddContactStanza(jid, alias);

        await xmpp.send(rosterStanza);
        console.log(`Contacto ${jid.split('@')[0]} agregado con el nombre ${alias}.`);
    } catch (err) {
        console.error('Error al agregar contacto al roster:', err.message);
        throw err;
    }
}

// Función para ver las solicitudes de amistad pendientes.
async function viewFriendRequests() {
    if (friendRequest.length === 0) {
        return 'No tienes nuevas solicitudes de amistad.';
    } else {
        let requests = 'Solicitudes de amistad pendientes:\n';
        friendRequest.forEach((from, index) => {
            requests += `${index + 1}. ${from.split('@')[0]}\n`;
        });
        return requests;
    }
}

// Función para aceptar una solicitud de amistad y agregar el contacto al roster.
async function acceptFriendRequest(jid, alias) {
    try {
        const presenceStanza = createPresenceStanza("subscribed", jid);
        await xmpp.send(presenceStanza);
        await addContactToRoster(jid, alias);
    } catch (err) {
        console.error('Error al aceptar la solicitud de amistad:', err.message);
        throw err;
    }
}

// Función para obtener la lista de contactos del usuario.
async function getContacts() {
    if (!xmpp) {
        throw new Error("Cliente no conectado. Por favor iniciar sesión.");
    }

    const iq = getRosterStanza(); // Crea la stanza para obtener la lista de contactos.
    const contacts = {};
    let waitingForPresences = new Set();

    // Maneja las stanzas de IQ (consulta) y presencia.
    xmpp.on("stanza", (stanza) => {
        if (stanza.is("iq") && stanza.attrs.id === "roster") {
            const query = stanza.getChild('query');
            if (query) {
                query.getChildren("item").forEach((item) => {
                    const jid = item.attrs.jid;
                    const name = item.attrs.name || jid.split("@")[0];
                    const subscription = item.attrs.subscription;

                    contacts[jid] = { name, jid, presence: "offline", subscription: subscription || "none" };
                    waitingForPresences.add(jid);
                });
            }
        } else if (stanza.is("presence")) {
            const from = stanza.attrs.from;
            if (from in contacts) {
                contacts[from].presence = stanza.attrs.type || "online";
                waitingForPresences.delete(from);
            }
        } else if (stanza.is("presence") && stanza.attrs.type === "subscribe") {
            const from = stanza.attrs.from;
            if (from in contacts) {
                contacts[from].subscription = "pending";
            }
        }
    });

    await xmpp.send(iq); // Envía la petición para obtener el roster.
    await new Promise(resolve => setTimeout(resolve, 3000)); // Espera a recibir todas las presencias antes de devolver la lista de contactos.

    return Object.values(contacts);
}

// Función para mostrar los detalles de un contacto específico por su nombre.
async function showUser(name) {
    try {
        const contacts = await getContacts(); // Obtiene la lista de contactos del usuario.
        const contact = contacts.find(contact => contact.name === name); // Busca el contacto que coincida con el nombre dado.
        if (contact) {
            console.log(`Detalles de contacto:\nNombre: ${contact.name}\nJID: ${contact.jid}\nEstado: ${contact.presence}`);
        } else {
            console.log("Contacto no encontrado.");
        }
    } catch (err) {
        console.error('Error al obtener detalles del contacto:', err.message);
    }
}

// Función para mostrar todos los contactos en la lista del usuario.
async function showUsersInServer() {
    try {
        const contacts = await getContacts(); // Obtiene la lista de contactos del usuario.
        if (contacts.length === 0) {
            console.log('No tienes contactos en tu lista.');
        } else {
            console.log('\nTus contactos:');
            contacts.forEach(contact => {
                console.log(`Nombre: ${contact.name}, JID: ${contact.jid}, Estado: ${contact.presence}`);
            });
        }
    } catch (err) {
        console.error('Error al obtener la lista de contactos:', err.message);
    }
}

// Función para enviar un mensaje privado a otro usuario.
async function privateMessage(recipient, messageText) {
    if (!recipient || !messageText) {
        throw new Error("Destinatario y mensaje son obligatorios.");
    }
    try {
        const messageStanza = createPrivateMessageStanza(recipient, messageText, domain); // Crea la stanza de mensaje privado.
        await xmpp.send(messageStanza); // Envía el mensaje privado.
        console.log(`Mensaje enviado a ${recipient}.`);
    } catch (err) {
        console.error('Error al enviar el mensaje privado:', err.message);
        throw err;
    }
}

// Función para crear un chat grupal y unirse a él.
function createGroupChat(roomName) {
    const roomJid = `${roomName}@conference.${domain}`; // Construye el JID del chat grupal.
    const presenceStanza = xml("presence", { to: `${roomJid}/${username}` }); // Crea la stanza de presencia para unirse al chat grupal.
    xmpp.send(presenceStanza); // Envía la stanza de presencia al servidor.
    console.log(`¡Has creado e ingresado a ${roomName}!, su jid es ${roomJid}`);
}

// Función para unirse a un chat grupal existente.
function joinGroupChat(roomName) {
    const roomJid = `${roomName}@conference.${domain}`; // Construye el JID del chat grupal.
    const presenceStanza = xml("presence", { to: `${roomJid}/${username}` });
    xmpp.send(presenceStanza); // Envía la stanza de presencia al servidor.
    console.log(`Te has unido a ${roomName}, el jid es ${roomJid}`);
}

// Función para manejar mensajes en un chat grupal.
async function handleGroupMessages(roomName, message = null) {
    const roomJid = `${roomName}@conference.${domain}`; // Construye el JID del chat grupal.
    const messageStanza = xml("message", { to: roomJid, type: "groupchat" }, xml("body", {}, message));
    xmpp.send(messageStanza); // Envía el mensaje al chat grupal.
    console.log("Mensaje enviado al chat grupal.");
}

module.exports = {
    register,
    login,
    logout,
    deleteAccount,
    setPresenceMessage,
    viewStatus,
    addContact,
    addContactToRoster,
    viewFriendRequests,
    acceptFriendRequest,
    getContacts,
    showUser,
    showUsersInServer,
    privateMessage,
    createGroupChat,
    joinGroupChat,
    handleGroupMessages,
};
