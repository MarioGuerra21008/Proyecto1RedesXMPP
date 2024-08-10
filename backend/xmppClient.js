const { client, xml } = require("@xmpp/client");
const fs = require("fs");
const { stanzasXmpp } = require("./stanzasXmpp");

class XmppClient {
    constructor(id, password) {
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
        this.id = id;
        this.password = password;
        this.roster = new Set();
        this.completeId = "";
    }

    async send(stanza) {
        this.xmpp.send(stanza);
    }

    async connect() {
        let state;
        try {
            this.xmpp = client({
                service: "xmpp://alumchat.lol:5222",
                domain: "alumchat.lol",
                username: this.id,
                password: this.password,
                tls: {
                    rejectUnauthorized: true,
                },
            });

            this.xmpp.on("online", async (address) => {
                this.completeId = address.toString();
                const userState = stanzasXmpp.userStateStanza("Online", "Me gusta el yogurt de coco!");
                this.xmpp.send(userState);
            });

            this.xmpp.on("stanzasXmpp", (stanzasXmpp) => {
                if (stanzasXmpp.is("userState")) {
                    const from = stanzasXmpp.attrs.from.split('@')[0];
                    const show = stanzasXmpp.getChildText("show");
                    let state = "Online";

                    if (stanzasXmpp.attrs.type !== 'Offline') {
                        if (show === "chat") {
                            state = "Online";
                        }
                        else if (show) {
                            state = show;
                        }
                    }

                    if (stanzasXmpp.attrs.type === "Offline") {
                        console.log(`${from} no esta conectado.`);
                    }
                    else if (state === "Online") {
                        console.log(`${from} esta conectado.`);
                    }
                }
                else if (stanzasXmpp.is("message") && stanzasXmpp.getChild("body") && stanzasXmpp.attrs.id !== "sendFiles") {
                    const from = stanzasXmpp.attrs.from.split('@')[0];
                    const message = stanzasXmpp.getChildText("body");
                    console.log(`${from}: ${message}`)
                }
                else if (stanzasXmpp.attrs.type === "groupchat" && stanzasXmpp.attrs.id === "sendFiles") {
                    const from = stanzasXmpp.attrs.from.split('@')[0];
                    const message = stanzasXmpp.getChildText("body");

                    const data = stanzasXmpp.getChildText("attachment");
                    if (data) {
                        const decodifiedData = Buffer.from(data, "base64");
                        const filePath = `./media/${message}`;
                        fs.writeFileSync(filePath, decodifiedData);
                        console.log(`Archivo de ${from}: ${message}`)
                    }
                }
            });

            await this.xmpp.start();

            return 0;

        } catch (error) {
            console.error("Usuario y/o contraseña incorrecta!\n", error);

            return 1;
        }
    }

    async disconnect() {
        try {
            if (this.xmpp) {
                const offline = stanzasXmpp.offline();
                this.xmpp.send(offline);

                await this.xmpp.stop();
                console.log("Desconectado.");
            }
            else {
                console.log("Usted no se encuentra conectado.");
            }
        } catch (error) {
            console.log("Error al desconectarse.");
        }
    }
}

module.exports = XmppClient;