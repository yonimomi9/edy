#include <iostream>
#include "../headers/Delete.h" // Include the corresponding header file
#include <sstream>
#include <algorithm>

using namespace std;

//constractor
Delete :: Delete(IMenu* menu, IDatabase& db) : db(db), menu(menu){}

/**
 * checks if the user exist in database
 * @param userId : The user ID to check.
 * @param dbvector : The database vector for search in.
 * @return 1 if the user exist and 0 otherwise.
 */
int Delete :: doesTheUserExist(unsigned long int userID,
    unordered_map<unsigned long int, vector<unsigned long int>> &dbvector){
    if(dbvector.find(userID) != dbvector.end()){
        return 1;
    }
    return 0;
}

/**
 * create movie vector from the arguments string.
 * @param arguments : the arguments string.
 * @return A vector
 */
vector <unsigned long int> Delete ::createMoviesVector(string arguments){
    // initialize variables for helping in the creation
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
            throw invalid_argument("One or more movie IDs are invalid.");
        }
    }
    return movies;
} 
/**
 * Checks if a movie exists in explicit user in the database.
 * @param dbvector: The database vector to search in.
 * @param movieID : The movie ID to check.
 * @param userID: The user ID to check.
 * @return 1 if the user exists, 0 otherwise.
 */
int Delete :: doesTheMovieExist(unordered_map<unsigned long int, vector<unsigned long int>> &dbvector,
    unsigned long int movieID,
    unsigned long int userID) {
    //
    vector<unsigned long int> movies = dbvector[userID];
    if (find(movies.begin(), movies.end(),movieID) != movies.end()) {
        return 1; 
    }
    return 0;
}
/**
 * Remove movie to an existing user.
 * @param dbvector: The database vector.
 * @param movieID: The movie ID.
 * @param userID: The user ID.
 */
void Delete:: removeMovie(unordered_map<unsigned long int, vector<unsigned long int>>& dbvector,
    unsigned long int movieID,
    unsigned long int userID) {
    // create a reference to the movies vector of this user ID
    vector<unsigned long int>& movies = dbvector[userID];
    // remove the movie from the dbvector
    movies.erase(find(movies.begin(), movies.end(), movieID));
}
/**
 * Executes the "delete" command.
 * @param arguments: User input as a string.
 * @param dbvector: Reference to the database map of user IDs and their watched movies.
 * @return None.
 */
void Delete::execute(string arguments,
                     unordered_map<unsigned long int, vector<unsigned long int>> &dbvector) {
    try {
        vector<unsigned long int> moviesVector = createMoviesVector(arguments);
        
        if (moviesVector.empty()) {
            throw invalid_argument("No content attached");
        }

        // Extract userID from arguments
        unsigned long int userID;
        istringstream stream(arguments);
        string userIDToken;
        stream >> userIDToken;

        if (!all_of(userIDToken.begin(), userIDToken.end(), ::isdigit)) {
            throw runtime_error("Invalid userID format. UserID contains non-numeric characters.");
        }

        userID = stoul(userIDToken);
        int flag = doesTheUserExist(userID, dbvector);
        // Check if the user exists
        if (!flag) {
            throw runtime_error("User ID does not exist.");
        }

        // Remove movies for the user
        for (const auto &movieID : moviesVector) {
            auto &userMovies = dbvector[userID];
            auto it = find(userMovies.begin(), userMovies.end(), movieID);

            if (it != userMovies.end()) {
                userMovies.erase(it);
            } else {
                throw runtime_error("Movie ID not found for the user.");
            }
        }

        // If the user has no movies left, remove the user from the database
        if (dbvector[userID].empty()) {
            dbvector.erase(userID);
        }
        // Save changes back to the database file
        db.RemoveFromDatabase(userID, moviesVector);
        sendData("204 No Content");


    } catch (runtime_error) {
        sendData("404 Not Found");
    } catch (invalid_argument){
        sendData("400 Bad Request");
    }
}

void Delete::sendData(string message){
    if (menu) {
        menu->displayOutput(message);
    }
}
