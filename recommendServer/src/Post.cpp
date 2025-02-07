#include "../headers/Post.h" // Include the corresponding header file
#include "../headers/Add.h"  // Include the base Add class
#include "ICommandable.hpp"  // Interface for command-based operations
#include "../headers/IMenu.h" // Menu interface
#include <iostream>           // For input/output operations
#include <sstream>            // For string stream operations
#include <string>             // For string manipulation

using namespace std;

/**
 * @brief Constructor for the Post class.
 * @param menu Pointer to an IMenu instance for interacting with the menu.
 * @param db Reference to an IDatabase instance for database operations.
 */
Post::Post(IMenu* menu, IDatabase& db) : Add(db), menu(menu) {}

/**
 * @brief Sends a message to the menu for display.
 * 
 * If a valid menu is provided, the message will be displayed using the menu's
 * displayOutput method.
 * 
 * @param message The message string to send.
 */
void Post::sendData(string message) {
    if (menu) {
        menu->displayOutput(message);
    }
}

/**
 * @brief Core logic for handling a "post" operation.
 * 
 * This function parses the arguments to extract the user ID and movie IDs,
 * checks if the user exists in the database, and either adds the user or
 * returns an error message based on the operation's result.
 * 
 * @param arguments The input string containing the user ID and movie IDs.
 * @param dbvector The database structure to be updated.
 * @return A string representing the result of the operation ("201 Created", "404 Not Found", or "400 Bad Request").
 */
string Post::logicPost(string arguments, unordered_map<unsigned long int, vector<unsigned long int>>& dbvector) {
    try {
        // Extract the user ID from the arguments
        unsigned long int userID = Add::extractUserID(arguments);

        // Check if the user already exists in the database
        int flag = doesTheUserExist(userID, dbvector);

        // If the user exists, return an error message
        if (flag) {
            return "404 Not Found";
        }

        // Add the user and return success
        Add::execute(arguments, dbvector);
        return "201 Created";
    } catch (...) {
        // Catch any exceptions and return a bad request error
        return "400 Bad Request";
    }
}

/**
 * @brief Executes the "post" command.
 * 
 * This function runs the core logic for the post operation and displays the result
 * through the menu system, if available.
 * 
 * @param arguments The input string containing the user ID and movie IDs.
 * @param dbvector The database structure to be updated.
 */
void Post::execute(string arguments, unordered_map<unsigned long int, vector<unsigned long int>>& dbvector) {
    try {
        string result = logicPost(arguments, dbvector); // Run logic
        sendData(result);  // Send the result to the menu once
    } catch (const std::exception& e) {
        sendData("400 Bad Request");
    }
}
