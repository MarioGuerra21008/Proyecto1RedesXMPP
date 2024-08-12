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

function createPresenceStanza(type, to = null) {
    const attributes = { type };
    if (to) {
        attributes.to = to;
    }
    return xml("presence", attributes);
}

function getRosterStanza() {
    return xml(
        "iq",
        { type: "get", id: "roster" },
        xml("query", { xmlns: "jabber:iq:roster" })
    );
}

function createAddContactStanza(jid, alias) {
    return xml(
        'iq',
        { type: 'set', id: 'add_to_roster' },
        xml('query', { xmlns: 'jabber:iq:roster' },
            xml('item', { jid: jid, name: alias })
        )
    );
}

function createPrivateMessageStanza(recipient, messageText, domain) {
    return xml(
        'message',
        { to: `${recipient}@${domain}`, type: 'chat' },
        xml('body', {}, messageText)
    );
}

module.exports = {
    createRegisterStanza,
    createDeleteAccountStanza,
    createPresenceStanza,
    getRosterStanza,
    createAddContactStanza,
    createPrivateMessageStanza,
};
