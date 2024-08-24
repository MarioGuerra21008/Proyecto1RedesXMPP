const { xml } = require("@xmpp/client");

// Crea una stanza para registrar un nuevo usuario en el servidor XMPP.
function createRegisterStanza(username, password) {
    return xml(
        'iq', // Tipo de mensaje IQ (Info/Query), usado para solicitudes y respuestas.
        { type: 'set', id: 'register' }, // 'set' indica que es una solicitud para cambiar el estado o datos.
        xml('query', { xmlns: 'jabber:iq:register' }, // El espacio de nombres indica que es una consulta de registro.
            xml('username', {}, username), // Inserta el nombre de usuario en el XML.
            xml('password', {}, password), // Inserta la contraseña en el XML.
        )
    );
}

// Crea una stanza para eliminar la cuenta de usuario en el servidor XMPP.
function createDeleteAccountStanza() {
    return xml(
        'iq', // Tipo de mensaje IQ.
        { type: 'set', id: 'delete_account' }, // 'set' para indicar la solicitud de eliminación.
        xml('query', { xmlns: 'jabber:iq:register' }, // El espacio de nombres de registro para la consulta.
            xml('remove') // Indica que se debe eliminar la cuenta.
        )
    );
}

// Crea una stanza de presencia que indica el estado de un usuario (por ejemplo, disponible, ausente).
function createPresenceStanza(type, to = null) {
    const attributes = { type }; // El tipo de presencia, como 'available', 'away', etc.
    if (to) {
        attributes.to = to; // Si se proporciona un destinatario, se agrega al mensaje.
    }
    return xml("presence", attributes); // Devuelve la stanza de presencia con los atributos especificados.
}

// Crea una stanza para solicitar la lista de contactos (roster) del usuario.
function getRosterStanza() {
    return xml(
        "iq", // Tipo de mensaje IQ.
        { type: "get", id: "roster" }, // 'get' para solicitar información, 'roster' para obtener la lista de contactos.
        xml("query", { xmlns: "jabber:iq:roster" }) // El espacio de nombres de roster.
    );
}

// Crea una stanza para agregar un nuevo contacto a la lista de contactos (roster) del usuario.
function createAddContactStanza(jid, alias) {
    return xml(
        'iq', // Tipo de mensaje IQ.
        { type: 'set', id: 'add_to_roster' }, // 'set' para indicar que se está modificando la lista de contactos.
        xml('query', { xmlns: 'jabber:iq:roster' }, // El espacio de nombres de roster.
            xml('item', { jid: jid, name: alias }) // Añade un contacto con su JID y alias.
        )
    );
}

// Crea una stanza para enviar un mensaje privado a otro usuario.
function createPrivateMessageStanza(recipient, messageText, domain) {
    return xml(
        'message', // Tipo de mensaje 'message'.
        { to: `${recipient}@${domain}`, type: 'chat' }, // Dirección del destinatario y tipo de mensaje 'chat'.
        xml('body', {}, messageText) // Contenido del mensaje dentro del cuerpo (body).
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
