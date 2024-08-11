const { client, xml } = require("@xmpp/client");

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const domain = "alumchat.lol";
const service = "xmpp://alumchat.lol:5222";
let xmpp = null;
let username = null;
let password = null;
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
        
        const registerStanza = xml(
            'iq',
            { type: 'set', id: 'register '},
            xml('query', { xmlns: 'jabber:iq:register' },
                xml('username', {}, username),
                xml('password', {}, password),
            )
        );

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
            await xmpp.send(xml("presence", { type: "online" }));
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

module.exports = { register, login, logout, };