#ifndef PATCH_H
#define PATCH_H

#include "../headers/Add.h"          
#include "ICommandable.hpp"          
#include "../headers/IMenu.h"        
#include "IDatabase.h"               
#include <iostream>                  
#include <sstream>                   

using namespace std;

/**
 * @class Patch
 * @brief Handles the logic for a "patch" operation, extending the Add class.
 *
 * This class is responsible for adding movies to the database
 * while also interacting with a menu for displaying results.
 */
class Patch : public Add {
private:
    IMenu* menu; /**< Pointer to an IMenu instance for interacting with the user interface */

public:
    /**
     * @brief Constructor for the Patch class.
     * @param menu Pointer to an IMenu instance for menu interaction.
     * @param db Reference to an IDatabase instance for database operations.
     */
    Patch(IMenu* menu, IDatabase& db);

    /**
     * @brief Sends a message to the menu for display.
     * @param message The message string to send.
     */
    void sendData(string message);

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
    string logicPatch(string arguments, unordered_map<unsigned long int, vector<unsigned long int>>& dbvector);

    /**
     * @brief Executes the "patch" command.
     * 
     * Invokes the logicPatch function and sends the result to the menu for display.
     * 
     * @param arguments The input string containing user ID and movie IDs.
     * @param dbvector The database structure to update.
     */
    void execute(string arguments, unordered_map<unsigned long int, vector<unsigned long int>>& dbvector) override;
};

#endif // PATCH_H
