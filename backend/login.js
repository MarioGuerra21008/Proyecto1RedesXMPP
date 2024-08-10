const XmppClient = require("./xmppClient");
const { client, xml } = require("@xmpp/client");

const login = {
    register: async (username, password) => {
        const userClient = new XmppClient("gue21008test", "mypass123");
        const isConnected = await userClient.connect();
        userClient2 = userClient;

        const stanzasXmpp = xml(
            'iq',
            { type: 'set', id: 'testuser1' },
            xml('query', {xmlns: 'jabber:iq:register'},
                xml("username", {}, username),
                xml("password", {}, password),
            ));
        
        await userClient2.send(stanzasXmpp);
        console.log("Registro realizado correctamente.");
        
        userClient2.disconnect();
        console.log("Espera un momento...\n");
    }
}

module.exports = login;