#include "../headers/SocketMenu.h"
#include <sstream>
#include <iostream>
#include <stdexcept>
#include <unordered_map>
#include <fcntl.h>
#include <sys/select.h>

using namespace std;

SocketMenu::SocketMenu(int clientSocket) : clientSocket(clientSocket) {
    // Predefine known commands for help
    commandArguments = {
        {"POST", "[userid] [movieid1] [movieid2] ..."},
        {"GET", "[userid] [movieid]"},
        {"PATCH", "[userid] [movieid1] [movieid2] ..."},
        {"DELETE", "[userid] [movieid1] [movieid2] ..."},
        {"help", ""}
    };

    // Set the socket to non-blocking mode
    if (fcntl(clientSocket, F_SETFL, O_NONBLOCK) == -1) {
        cerr << "Error: Failed to set socket to non-blocking mode." << endl;
        throw runtime_error("Failed to configure socket.");
    }
}

SocketMenu::~SocketMenu() {
    close(clientSocket); // Ensure socket is closed on destruction
}

tuple<int, string> SocketMenu::nextCommand() {
    try {
        string receivedMessage = receiveMessage();

        if (receivedMessage.empty()) {
            return make_tuple(-2, ""); // Ignore idle timeouts
        }

        istringstream stream(receivedMessage);
        string command;
        string arguments;

        stream >> command;
        getline(stream, arguments);

        if (!arguments.empty()) {
            arguments = arguments.substr(arguments.find_first_not_of(" \t"));
        }

        static const unordered_map<string, int> commandMap = {
            {"DELETE", 1},
            {"GET", 2},
            {"PATCH", 3},
            {"POST", 4},
            {"help", 5},
            {"DISCONNECT", -1} // Handle disconnect explicitly
        };

        auto it = commandMap.find(command);
        if (it != commandMap.end()) {
            return make_tuple(it->second, arguments);
        } else {
            displayOutput("400 Bad Request");
            return make_tuple(-1, "");
        }
    } catch (const exception &e) {
        if (string(e.what()) == "Client disconnected.") {
            throw; // Propagate disconnection to the server
        }
        return make_tuple(-1, ""); // Silently ignore other exceptions
    }
}






void SocketMenu::displayOutput(const string &output) {
    try {
        // Clear the buffer to ensure no previous data interferes
        outputBuffer.clear();

        // Format the message (ensure a single clean response with a newline)
        string formattedOutput = output + "\n";
        outputBuffer = formattedOutput;

        // Send the message
        sendMessage(outputBuffer);

    } catch (const exception &e) {
        // cerr << "[DEBUG] Error in displayOutput: " << e.what() << endl;
    }
}



string SocketMenu::getMenuOutput() const {
    return outputBuffer;
}

map<string, string> &SocketMenu::getCommandArguments() const {
    return const_cast<map<string, string> &>(commandArguments);
}

string SocketMenu::receiveMessage() {
    const size_t bufferSize = 4096;
    char buffer[bufferSize] = {0};

    fd_set readfds;
    FD_ZERO(&readfds);
    FD_SET(clientSocket, &readfds);

    struct timeval timeout = {5, 0}; // 5 seconds timeout

    int activity = select(clientSocket + 1, &readfds, nullptr, nullptr, &timeout);

    if (activity == 0) {
        // Quietly ignore the timeout without any debug or errors
        return ""; // Return an empty string to indicate idle timeout
    } else if (activity < 0) {
        throw runtime_error("Error: Select failed.");
    }

    // Read socket data
    int bytesRead = read(clientSocket, buffer, bufferSize - 1);
    if (bytesRead < 0) {
        throw runtime_error("Error reading from socket.");
    } else if (bytesRead == 0) {
        throw runtime_error("Client disconnected.");
    }

    buffer[bytesRead] = '\0';
    string receivedData(buffer);

    // Trim trailing whitespace
    receivedData.erase(receivedData.find_last_not_of(" \t\n\r") + 1);

    return receivedData;
}


void SocketMenu::sendMessage(const string &message) {
    // Send all bytes of the message
    size_t totalSent = 0;
    size_t messageLength = message.length();

    while (totalSent < messageLength) {
        ssize_t bytesSent = send(clientSocket, message.c_str() + totalSent, messageLength - totalSent, 0);

        if (bytesSent == -1) {
            throw runtime_error("Error sending message to socket");
        }
        totalSent += bytesSent;
    }
}