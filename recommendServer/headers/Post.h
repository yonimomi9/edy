#ifndef POST_H
#define POST_H

#include "../headers/Add.h"          // Base class Add
#include "ICommandable.hpp"          // Interface for command-based classes
#include "../headers/IMenu.h"        // Interface for menu-related interactions
#include "IDatabase.h"               // Interface for database operations
#include <iostream>                  // Standard input-output library
#include <sstream>                   // String stream handling

using namespace std;

/**
 * @class Post
 * @brief Handles the logic for a "post" operation, extending the Add class.
 *
 * This class is responsible for adding users and movies to the database
 * while also interacting with a menu for displaying results.
 */
class Post : public Add {
private:
    IMenu* menu; /**< Pointer to an IMenu instance for interacting with the user interface */

public:
    /**
     * @brief Constructor for the Post class.
     * @param menu Pointer to an IMenu instance for menu interaction.
     * @param db Reference to an IDatabase instance for database operations.
     */
    Post(IMenu* menu, IDatabase& db);

    /**
     * @brief Sends a message to the menu for display.
     * @param message The message string to send.
     */
    void sendData(string message);

    /**
     * @brief Core logic for handling a "post" operation.
     * 
     * Parses the arguments, checks the database, and determines if the user
     * can be added or not.
     * 
     * @param arguments The input string containing user ID and movie IDs.
     * @param dbvector The database structure to update.
     * @return A string representing the operation result ("201 Created", "404 Not Found", or "400 Bad Request").
     */
    string logicPost(string arguments, unordered_map<unsigned long int, vector<unsigned long int>>& dbvector);

    /**
     * @brief Executes the "post" command.
     * 
     * Invokes the logicPost function and sends the result to the menu for display.
     * 
     * @param arguments The input string containing user ID and movie IDs.
     * @param dbvector The database structure to update.
     */
    void execute(string arguments, unordered_map<unsigned long int, vector<unsigned long int>>& dbvector) override;
};

#endif // POST_H
