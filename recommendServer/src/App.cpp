#include "../headers/IMenu.h"
#include "../headers/FileDb.h"
#include "../headers/ICommandable.hpp"
#include <iostream>
#include <map>
#include <string>
#include <unordered_map>
#include <vector>
#include <tuple> // For structured command input

using namespace std;

class App {
private:
    IMenu *menu;                                                          // Menu interface for reading user commands
    map<int, ICommandable *> commands;                                    // Command handlers
    IDatabase *database;                                                  // Pointer to the database interface
    unordered_map<unsigned long int, vector<unsigned long int>> dbVector; // In-memory database

public:
    // Constructor
    App(IMenu *menu, map<int, ICommandable *> &commands, const string &dbFilePath)
        : menu(menu), commands(commands) {
        database = new FileDb(dbFilePath, dbVector);
    }

    // Getter for dbVector
    unordered_map<unsigned long int, vector<unsigned long int>> &getDbVector() {
        return dbVector; // Return a non-const lvalue reference
    }

    // Getter for commands
    map<int, ICommandable *> &getCommands() {
        return commands; // Return a non-const lvalue reference
    }

    // Getter for the database
    IDatabase& getDatabase() const {
        return *database; // Dereference the pointer to return a reference
    }

    // Main application loop
    void run() {
        while (true) {
            tuple<int, string> command = menu->nextCommand(); // Get the command and its arguments as a tuple
            int task = get<0>(command);                       // Extract the task (command ID)
            string arguments = get<1>(command);               // Extract the arguments (command details)
            if (commands.find(task) != commands.end()) {
                // Execute the corresponding command and pass the in-memory database as a pointer
                commands[task]->execute(arguments, dbVector);
            }
        }
    }
};
