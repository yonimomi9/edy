#include "../headers/Patch.h" 
#include "../headers/Add.h"  
#include "ICommandable.hpp"  
#include "../headers/IMenu.h" 
#include <iostream>           
#include <sstream>            
#include <string>             

using namespace std;

/**
 * @class Patch
 * @brief Handles the logic for a "patch" operation, extending the Add class.
 *
 * This class is responsible for adding movies to the database
 * while also interacting with a menu for displaying results.
 */
Patch::Patch(IMenu* menu, IDatabase& db) : Add(db), menu(menu) {}

    /**
     * @brief Sends a message to the menu for display.
     * @param message The message string to send.
     */
void Patch::sendData(string message) {
    if (menu) {
        menu->displayOutput(message);
    }
}

    /**
     * @brief Core logic for handling a "patch" operation.
     * 
     * Parses the arguments, checks the database, and determines if the movie
     * can be added or not.
     * 
     * @param arguments The input string containing user ID and movie IDs.
     * @param dbvector The database structure to update.
     * @return A string representing the operation result ("201 Created", "404 Not Found", or "400 Bad Request").
     */
string Patch::logicPatch(string arguments, unordered_map<unsigned long int, vector<unsigned long int>>& dbvector) {
    try {
        // Extract the user ID from the arguments
        unsigned long int userID = Add::extractUserID(arguments);

        // Check if the user already exists in the database
        int flag = doesTheUserExist(userID, dbvector);

        
        if (flag) {
            // Add the movies
            Add::execute(arguments, dbvector);
            return "204 No Content";   
        } else{
            // If the user doesn't exists, return an error message
            return "404 Not Found";
        }
    } catch (...) {
        // Catch any exceptions and return a bad request error
        return "400 Bad Request";
    }
}

    /**
     * @brief Executes the "patch" command.
     * 
     * Invokes the logicPatch function and sends the result to the menu for display.
     * 
     * @param arguments The input string containing user ID and movie IDs.
     * @param dbvector The database structure to update.
     */
void Patch::execute(string arguments, unordered_map<unsigned long int, vector<unsigned long int>>& dbvector) {
    // Run the core logic and get the result
    string result = logicPatch(arguments, dbvector);

    // Send the result to the menu for display
    sendData(result);
}
