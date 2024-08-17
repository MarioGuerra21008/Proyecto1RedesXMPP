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

const domain = "alumchat.lol";
const service = "xmpp://alumchat.lol:5222";
let xmpp = null;
let username = null;
let password = null;
let friendRequest = [];
let userStatus = "online";

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
            await xmpp.start();
        } catch (err) {
            reject(new Error(err.message));
        }

        const registerStanza = createRegisterStanza(username, password);

        xmpp.send(registerStanza).then(() => {
            console.log("Registro exitoso!");
            resolve();
        }).catch((err) => {
            reject(new Error("Error al registrarse."));
        });
    });
}

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
            const presenceStanza = createPresenceStanza("online");
            await xmpp.send(presenceStanza);

            /*
            xmpp.on("stanza", (stanza) => {
                console.log("Stanza recibida:", stanza.toString());
                if (stanza.is("message")) {
                    const body = stanza.getChildText('body');
                    console.log("Esto es el cuerpo:", body)
                    if (body) {
                        const from = stanza.attrs.from.split('@')[0];
                        console.log(`Mensaje recibido de ${from}: ${body}`);
                    } else {
                        console.log("Stanza de mensaje sin cuerpo:");
                    }
                }
            });
            */
           resolve();
        });

        try {
            await xmpp.start();
        } catch (err) {
            if (err.condition === "not-authorized") {
                reject(new Error("Credenciales incorrectas!"));
            } else {
                reject(new Error("Lo siento, hubo un problema: " + err.message));
            }
        }
    });
}

async function logout() {
    if (xmpp !== null && xmpp.status === "online") {
        try {
            await xmpp.stop();
            xmpp = null;
            console.log("Desconectado.");
        } catch (err) {
            console.error('Error al desconectar:', err.message);
            throw err;
        }
    }
}

async function deleteAccount() {
    return new Promise((resolve, reject) => {
        if (!xmpp) {
            return reject(new Error("No ha iniciado sesión."));
        }

        const errorHandler = (err) => {
            if (err.condition === 'not-authorized') {
                console.log('Cuenta eliminada con éxito.');
                xmpp.removeListener('error', errorHandler);
                logout().then(resolve).catch(reject);
            } else {
                xmpp.removeListener('error', errorHandler);
                reject(new Error('Hubo un error al intentar borrar su cuenta: ' + err.message));
            }
        };

        xmpp.on('error', errorHandler);

        const deleteStanza = createDeleteAccountStanza();

        xmpp.send(deleteStanza).catch((err) => {
            xmpp.removeListener('error', errorHandler);
            reject(new Error('Hubo un error al intentar borrar su cuenta: ' + err.message));
        });
    });
}

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

async function getContacts() {
    if (!xmpp) {
        throw new Error("Cliente no conectado. Por favor iniciar sesión.");
    }

    const iq = getRosterStanza();
    const contacts = {};
    let waitingForPresences = new Set();

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

    await xmpp.send(iq);
    await new Promise(resolve => setTimeout(resolve, 3000));

    return Object.values(contacts);
}

async function showUser(name) {
    try {
        const contacts = await getContacts();
        console.log(name);
        const contact = contacts.find(contact => contact.name === name);
        if (contact) {
            console.log(`Detalles de contacto:\nNombre: ${contact.name}\nJID: ${contact.jid}\nEstado: ${contact.presence}`);
        } else {
            console.log("Contacto no encontrado.");
        }
    } catch (err) {
        console.error('Error al obtener detalles del contacto:', err.message);
    }
}

async function showUsersInServer() {
    try {
        const contacts = await getContacts();
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

async function privateMessage(recipient, messageText) {
    if (!recipient || !messageText) {
        throw new Error("Destinatario y mensaje son obligatorios.");
    }
    try {
        const messageStanza = createPrivateMessageStanza(recipient, messageText, domain);
        await xmpp.send(messageStanza);
        console.log(`Mensaje enviado a ${recipient}.`);
    } catch (err) {
        console.error('Error al enviar el mensaje privado:', err.message);
        throw err;
    }
}

module.exports = {
    register,
    login,
    logout,
    deleteAccount,
    addContact,
    addContactToRoster,
    viewFriendRequests,
    acceptFriendRequest,
    getContacts,
    showUser,
    showUsersInServer,
    privateMessage,
};
