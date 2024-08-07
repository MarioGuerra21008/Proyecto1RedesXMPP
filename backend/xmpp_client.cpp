#include <iostream>
#include <string>
#include <winsock2.h>
#include <ws2tcpip.h>
#include <cstring>

#pragma comment(lib, "ws2_32.lib")

class XmppClient {
public:
    XmppClient(const std::string& server, int port)
        : server_(server), port_(port), sockfd_(INVALID_SOCKET) {
        WSAStartup(MAKEWORD(2, 2), &wsaData_);
    }

    ~XmppClient() {
        WSACleanup();
    }

    bool connect() {
        struct addrinfo hints, *res;
        ZeroMemory(&hints, sizeof(hints));
        hints.ai_family = AF_INET;
        hints.ai_socktype = SOCK_STREAM;
        hints.ai_protocol = IPPROTO_TCP;

        if (getaddrinfo(server_.c_str(), std::to_string(port_).c_str(), &hints, &res) != 0) {
            std::cerr << "Error: unable to resolve server address" << std::endl;
            return false;
        }

        sockfd_ = socket(res->ai_family, res->ai_socktype, res->ai_protocol);
        if (sockfd_ == INVALID_SOCKET) {
            std::cerr << "Error: unable to create socket" << std::endl;
            freeaddrinfo(res);
            return false;
        }

        if (::connect(sockfd_, res->ai_addr, (int)res->ai_addrlen) == SOCKET_ERROR) {
            std::cerr << "Error: unable to connect to server" << std::endl;
            closesocket(sockfd_);
            freeaddrinfo(res);
            return false;
        }

        freeaddrinfo(res);
        return true;
    }

    void close() {
        if (sockfd_ != INVALID_SOCKET) {
            closesocket(sockfd_);
        }
    }

    bool sendMessage(const std::string& message) {
        if (sockfd_ == INVALID_SOCKET) {
            std::cerr << "Error: not connected" << std::endl;
            return false;
        }

        int sent = send(sockfd_, message.c_str(), (int)message.size(), 0);
        if (sent == SOCKET_ERROR) {
            std::cerr << "Error: failed to send message" << std::endl;
            return false;
        }

        return true;
    }

    std::string receiveMessage() {
        if (sockfd_ == INVALID_SOCKET) {
            std::cerr << "Error: not connected" << std::endl;
            return "";
        }

        char buffer[4096];
        int received = recv(sockfd_, buffer, sizeof(buffer) - 1, 0);
        if (received == SOCKET_ERROR) {
            std::cerr << "Error: failed to receive message" << std::endl;
            return "";
        }

        buffer[received] = '\0';
        return std::string(buffer);
    }

private:
    std::string server_;
    int port_;
    SOCKET sockfd_;
    WSADATA wsaData_;
};

std::string createMessage(const std::string& to, const std::string& body) {
    return "<message to='" + to + "' type='chat'><body>" + body + "</body></message>";
}

int main(int argc, char* argv[]) {
    if (argc < 2) {
        std::cerr << "Usage: " << argv[0] << " <command> [args...]" << std::endl;
        return 1;
    }

    std::string command = argv[1];
    XmppClient client("alumchat.lol", 5222);

    if (!client.connect()) {
        std::cerr << "Failed to connect to the server" << std::endl;
        return 1;
    }

    client.sendMessage("<stream:stream to='alumchat.lol' xmlns='jabber:client' xmlns:stream='http://etherx.jabber.org/streams' version='1.0'>");
    std::cout << "Server Response: " << client.receiveMessage() << std::endl;

    if (command == "send_message") {
        if (argc < 5) {
            std::cerr << "Usage: " << argv[0] << " send_message <to> <message>" << std::endl;
            return 1;
        }
        std::string to = argv[2];
        std::string body = argv[3];
        std::string message = createMessage(to, body);
        client.sendMessage(message);
        std::cout << "Server Response: " << client.receiveMessage() << std::endl;
    } else {
        std::cerr << "Unknown command: " << command << std::endl;
        return 1;
    }

    client.close();
    return 0;
}
