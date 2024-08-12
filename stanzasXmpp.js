const { xml } = require("@xmpp/client");

function createRegisterStanza(username, password) {
    return xml(
        'iq',
        { type: 'set', id: 'register' },
        xml('query', { xmlns: 'jabber:iq:register' },
            xml('username', {}, username),
            xml('password', {}, password),
        )
    );
}

function createDeleteAccountStanza() {
    return xml(
        'iq',
        { type: 'set', id: 'delete_account' },
        xml('query', { xmlns: 'jabber:iq:register' },
            xml('remove')
        )
    );
}

function createPresenceStanza(type) {
    return xml("presence", { type });
}

function getRosterStanza() {
    return xml(
        "iq",
        { type: "get", id: "roster" },
        xml("query", { xmlns: "jabber:iq:roster" })
    );
}

module.exports = { getRosterStanza };


module.exports = {
    createRegisterStanza,
    createDeleteAccountStanza,
    createPresenceStanza,
    getRosterStanza,
};
