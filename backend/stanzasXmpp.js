const { xml } = require("@xmpp/client");

const stanzasXmpp = {
    offline: () => {
        const offlineStanza = xml(
            "userState",
            {
                id: "disconnect",
            },
            xml("show", {}, "Offline")
        )

        return offlineStanza;
    },

    userStateStanza: (show, status) => {
        const userStateStanza = xml(
            "userState",
            {
                id: "getContactsInfo",
            },
            xml("show", {}, show),
            xml("status", {}, status)
        )

        return userStateStanza;
    },
}

module.exports = stanzasXmpp;