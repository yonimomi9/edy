# ifndef DELETE_H
# define DELETE_H

#include <unordered_map>
#include <vector>
#include <string>
#include "ICommandable.hpp"
#include "IDatabase.h"
#include "IMenu.h"

using namespace std;

class Delete : public ICommandable {
private:
    IDatabase& db;
    IMenu* menu;

public:
    // Constructor
    Delete(IMenu* menu, IDatabase& db);

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
     * Creates a vector of movie IDs from a string of input arguments.
     * @param arguments: The input string.
     * @return A vector of unsigned long integers representing movie IDs.
     */
    vector<unsigned long int> createMoviesVector(string arguments);

    /**
     * Checks if a movie exists in explicit user in the database.
     * @param dbvector: The database vector to search in.
     * @param movieID : The movie ID to check.
     * @param userID: The user ID to check.
     * @return 1 if the user exists, 0 otherwise.
     */
    int doesTheMovieExist(
        unordered_map<unsigned long int, vector<unsigned long int>>& dbvector,
        unsigned long int movieID,
        unsigned long int userID);
    /**
     * Remove movie to an existing user.
     * @param dbvector: The database vector.
     * @param movieID: The movie ID.
     * @param userID: The user ID.
     */
    void removeMovie(
        unordered_map<unsigned long int, vector<unsigned long int>>& dbvector,
        unsigned long int movie,
        unsigned long int userID);
    /**
     * Executes the "delete" command.
     * @param arguments: User input as a string.
     * @param dbvector: Reference to the database map of user IDs and their watched movies.
     * @return None.
     */
    void execute(
        string arguments,
        unordered_map<unsigned long int, vector<unsigned long int>>& dbvector) override;

    void sendData(string message);
};


# endif // DELETE_H