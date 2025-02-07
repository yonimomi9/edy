#include <iostream>
#include "../headers/Add.h" // Include the corresponding header file
#include <sstream>
#include <algorithm>

using namespace std;

// Constructor
Add::Add(IDatabase& db) : db(db) {}

/**
 * Checks if a user exists in the database.
 * @param userID: The user ID to check.
 * @param dbvector: The database vector to search in.
 * @return 1 if the user exists, 0 otherwise.
 */
int Add::doesTheUserExist(
    unsigned long int userID,
    unordered_map<unsigned long int, vector<unsigned long int>>& dbvector) {
    // Check if the userID exists in the unordered map
    if (dbvector.find(userID) != dbvector.end()) {
        return 1; // User exists
    }
    return 0; // User does not exist
}

/**
 * Adds movies to an existing user, avoiding duplicates.
 * @param userID: The user ID.
 * @param dbvector: The database vector.
 * @param movies: The vector of movie IDs to add.
 */
void Add::addMovies(
    unsigned long int userID,
    unordered_map<unsigned long int, vector<unsigned long int>>& dbvector,
    vector<unsigned long int> movies) {
    // Reference to the user's movies vector in the map
    auto it = dbvector.find(userID);
    if (it != dbvector.end()) {
        vector<unsigned long int>& userMovies = it->second;

        // Add movies that don't already exist in the user's movies vector
        for (unsigned long int movie : movies) {
            if (find(userMovies.begin(), userMovies.end(), movie) == userMovies.end()) {
                userMovies.push_back(movie);
            }
        }
    }
}

/**
 * Adds a new user and their movies to the database.
 * @param userID: The new user ID.
 * @param dbvector: The database vector.
 * @param movies: The vector of movie IDs.
 */
void Add::addUser(
    unsigned long int userID,
    unordered_map<unsigned long int, vector<unsigned long int>>& dbvector,
    vector<unsigned long int> movies) {
    dbvector[userID] = movies;
}

/**
 * Creates a vector of movie IDs from a string of input arguments.
 * @param arguments: The input string.
 * @return A vector of unsigned long integers representing movie IDs.
 */
vector<unsigned long int> Add::createMoviesVector(string arguments) {
    istringstream stream(arguments);
    string token;

    // Skip the first number
    stream >> token;

    // Store the remaining numbers in a vector
    vector<unsigned long int> movies;
    while (stream >> token) {
        try {
            size_t pos;
            unsigned long int movieID = stoul(token, &pos);

            // Check if the entire string was converted to a number
            if (pos != token.length()) {
                throw("Invalid movie ID format.");
            }
            movies.push_back(movieID);
        } catch (...) {
            // Throw a specific exception to indicate invalid movie ID
            throw("One or more movie IDs are invalid.");
        }
    }
    return movies;
}

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
unsigned long int Add::extractUserID(string arguments){
    //Create a variable for the userID
    unsigned long int userID;
    // Create a stream from the string
    istringstream stream(arguments);
    // Extract the first token
    string userIDToken;
    stream >> userIDToken;
    // Validate that the userID contains only digits
    if (!all_of(userIDToken.begin(), userIDToken.end(), ::isdigit)) {
        throw("Invalid userID format. UserID contains non-numeric characters.");
    }
    // Convert the valid userID string to unsigned long int
    return stoul(userIDToken);
}

/**
 * Executes the "add" command.
 * @param arguments: User input as a string.
 * @param dbvector: Reference to the database map of user IDs and their watched movies.
 * @return None.
 */
void Add::execute(
    string arguments,
    unordered_map<unsigned long int, vector<unsigned long int>>& dbvector) {
    try {
        vector<unsigned long int> moviesVector = createMoviesVector(arguments);
        if (moviesVector.empty()) {
            throw("No content attached");
        }

        unsigned long int userID = extractUserID(arguments);

        // Check if the user ID already exists in the DB
        int flag = doesTheUserExist(userID, dbvector);

        // If the user exists, add movies; otherwise, add the user
        if (flag) {
            addMovies(userID, dbvector, moviesVector);
        } else {
            addUser(userID, dbvector, moviesVector);
        }

        // Send the new info to the function "add to database"
        db.addToDatabase(userID, moviesVector, flag);
    }catch (...) {
        throw invalid_argument("Unknown error occurred while executing add command.");
        return;
    }
}
