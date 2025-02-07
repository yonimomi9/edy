#ifndef ADD_H
#define ADD_H

#include <unordered_map>
#include <vector>
#include <string>
#include "ICommandable.hpp"
#include "IDatabase.h"

using namespace std;

class Add : public ICommandable {
private:
    IDatabase& db;

public:
    // Constructor
    Add(IDatabase& db);

    /**
     * Checks if a user exists in the database.
     * @param userID: The user ID to check.
     * @param dbvector: The database vector to search in.
     * @return 1 if the user exists, 0 otherwise.
     */
    int doesTheUserExist(
        unsigned long int userID,
        std::unordered_map<unsigned long int, std::vector<unsigned long int>>& dbvector);

    /**
     * Adds movies to an existing user, avoiding duplicates.
     * @param userID: The user ID.
     * @param dbvector: The database vector.
     * @param movies: The vector of movie IDs to add.
     */
    void addMovies(
        unsigned long int userID,
        unordered_map<unsigned long int, vector<unsigned long int>>& dbvector,
        vector<unsigned long int> movies);

    /**
     * Adds a new user and their movies to the database.
     * @param userID: The new user ID.
     * @param dbvector: The database vector.
     * @param movies: The vector of movie IDs.
     */
    void addUser(
        unsigned long int userID,
        unordered_map<unsigned long int, vector<unsigned long int>>& dbvector,
        vector<unsigned long int> movies);

    /**
     * Creates a vector of movie IDs from a string of input arguments.
     * @param arguments: The input string.
     * @return A vector of unsigned long integers representing movie IDs.
     */
    vector<unsigned long int> createMoviesVector(string arguments);
    /**
     * Extracts the user ID from a string of input arguments.
     * @param arguments: The input string containing user ID followed by movie IDs.
     * @return The user ID as an unsigned long integer.
     * @throws An exception if the user ID is invalid (e.g., contains non-numeric characters).
     * 
     * This function processes the input string to extract the first token, which represents
     * the user ID. It validates that the extracted token consists of numeric characters only
     * and converts it to an unsigned long integer. If the user ID is invalid, an exception
     * is thrown to indicate the error.
     */
    unsigned long int extractUserID(string arguments);

    /**
     * Executes the "add" command.
     * @param arguments: User input as a string.
     * @param dbvector: Reference to the database map of user IDs and their watched movies.
     * @return None.
     */
    void execute(
        string arguments,
        unordered_map<unsigned long int, vector<unsigned long int>>& dbvector) override;
};

#endif // ADD_H
