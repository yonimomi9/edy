#include "../headers/FileDb.h"
#include "../headers/SocketMenu.h"
#include "../headers/ICommandable.hpp"
#include "../headers/Add.h"
#include "../headers/Recommend.h"
#include "../headers/Help.h"
#include "../headers/Post.h"
#include "../headers/Delete.h"
#include "../headers/Patch.h"
#include "../headers/Get.h"
#include "App.cpp"
#include "../headers/ThreadPool.h"

#include <iostream>
#include <thread>
#include <string>
#include <map>
#include <sys/socket.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <signal.h>
#include <sys/stat.h>

using namespace std;

// Global flag for server shutdown
bool serverRunning = true;

// Signal handler for server shutdown
void signalHandler(int signal) {
    serverRunning = false;
}

// Function to handle each client connection
void handleClient(int clientSocket, App &app) {
    try {
        SocketMenu menu(clientSocket);
        map<int, ICommandable *> commands;
        commands[1] = new Delete(&menu, app.getDatabase());
        commands[2] = new Get(&menu);
        commands[3] = new Patch(&menu, app.getDatabase());
        commands[4] = new Post(&menu, app.getDatabase());
        commands[5] = new Help(&menu);

        while (true) {
            auto command = menu.nextCommand();
            int task = get<0>(command);
            string arguments = get<1>(command);

            if (task == -1) {
                break;
            }

            if (commands.find(task) != commands.end()) {
                commands[task]->execute(arguments, app.getDbVector());
            }
        }

        for (auto &pair : commands) {
            delete pair.second;
        }
    } catch (const runtime_error &e) {
        if (string(e.what()) == "Client disconnected.") {
            cout << "Client " << clientSocket << " disconnected." << endl;
        } else {
            cerr << "Error handling client " << clientSocket << ": " << e.what() << endl;
        }
    } catch (const exception &e) {
        cerr << "Unexpected error handling client " << clientSocket << ": " << e.what() << endl;
    } catch (...) {
        cerr << "Unknown error occurred while handling client " << clientSocket << endl;
    }

    close(clientSocket);
}

int main(int argc, char *argv[]) {
    signal(SIGINT, signalHandler);
    signal(SIGPIPE, SIG_IGN);

    string dbFilePath = "../data/database.txt";
    if (argc < 2) {
        cerr << "Error: No port specified. Usage: ./server <port>" << endl;
        return 1;
    }

    int port = stoi(argv[1]);

    ifstream dbFileCheck(dbFilePath);
    if (!dbFileCheck) {
        ofstream dbFileCreate(dbFilePath);
        if (!dbFileCreate) {
            return 1;
        }
        dbFileCreate.close();
    }
    dbFileCheck.close();
    chmod(dbFilePath.c_str(), 0777);

    unordered_map<unsigned long int, vector<unsigned long int>> dbVector;
    FileDb database(dbFilePath, dbVector);
    map<int, ICommandable *> emptyCommands;
    App app(nullptr, emptyCommands, dbFilePath);

    int serverSocket = socket(AF_INET, SOCK_STREAM, 0);
    if (serverSocket == -1) {
        cerr << "Error: Failed to create socket." << endl;
        return 1;
    }

    sockaddr_in serverAddr{};
    serverAddr.sin_family = AF_INET;
    serverAddr.sin_addr.s_addr = INADDR_ANY;
    serverAddr.sin_port = htons(port);

    if (bind(serverSocket, (struct sockaddr *)&serverAddr, sizeof(serverAddr)) < 0) {
        cerr << "Error: Failed to bind socket." << endl;
        close(serverSocket);
        return 1;
    }

    if (listen(serverSocket, SOMAXCONN) < 0) {
        cerr << "Error: Failed to listen on socket." << endl;
        close(serverSocket);
        return 1;
    }

    // Set the amount of available threads equivalent to the number of CPU cores.
    // This amount could be set custom made by choice.
    ThreadPool threadPool(thread::hardware_concurrency());

    while (serverRunning) {
        sockaddr_in clientAddr{};
        socklen_t clientLen = sizeof(clientAddr);
        int clientSocket = accept(serverSocket, (struct sockaddr *)&clientAddr, &clientLen);

        if (clientSocket < 0) {
            if (!serverRunning) break;
            cerr << "Error: Failed to accept client connection." << endl;
            continue;
        }

        threadPool.enqueue([clientSocket, &app]() {
            handleClient(clientSocket, app);
        });
    }

    close(serverSocket);
    cout << "Server shutting down..." << endl;

    return 0;
}
