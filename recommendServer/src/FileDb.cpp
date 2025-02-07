#include "../headers/FileDb.h"
#include <sstream>
#include <iostream>
#include <algorithm>
#include <stdexcept>
#include <sys/stat.h>
#include <mutex>

using namespace std;

mutex dbMutex; // Global mutex to protect access to dbvector and file

// Constructor
FileDb::FileDb(const string &dbFile, unordered_map<unsigned long int, vector<unsigned long int>> &db)
    : IDatabase(db), dbvector(db), databaseFile(dbFile) {
    initializeDatabaseFile();
    auto parsedDb = parse();
    db.insert(parsedDb.begin(), parsedDb.end());
}

// Ensures the database file exists or creates a new one if it doesn't
void FileDb::initializeDatabaseFile() {
    fstream dbStream(databaseFile, ios::in);
    if (!dbStream) {
        ofstream newDbStream(databaseFile);
        if (!newDbStream) {
            cerr << "Error: Could not initialize database file." << endl;
            exit(1);
        }
        newDbStream.close();
    }
    if (chmod(databaseFile.c_str(), 0777) != 0) {
        cerr << "Error: Could not set permissions on database file." << endl;
        exit(1);
    }
}

// Parse the database file and populate the in-memory data structure
unordered_map<unsigned long int, vector<unsigned long int>> FileDb::parse() {
    unordered_map<unsigned long int, vector<unsigned long int>> dbvectorTemp;
    fstream dbStream(databaseFile, ios::in);
    if (!dbStream) {
        cerr << "Error: Could not open database file for parsing." << endl;
        return dbvectorTemp;
    }

    string line;
    while (getline(dbStream, line)) {
        if (line.empty()) continue;

        stringstream ss(line);
        string userIDStr, moviesStr;

        getline(ss, userIDStr, '|');
        getline(ss, moviesStr, '|');

        if (!userIDStr.empty() && !moviesStr.empty()) {
            try {
                unsigned long int userID = stoul(userIDStr);
                vector<unsigned long int> movieList;

                stringstream movieStream(moviesStr);
                string movieIDStr;

                while (getline(movieStream, movieIDStr, '?')) {
                    if (!movieIDStr.empty()) {
                        unsigned long int movieID = stoul(movieIDStr);
                        movieList.push_back(movieID);
                    }
                }

                dbvectorTemp[userID] = movieList;

            } catch (const exception &e) {
                cerr << "Error parsing line: " << line << ". Exception: " << e.what() << endl;
            }
        }
    }

    dbStream.close();
    return dbvectorTemp;
}

// Write new user/movie data to the file
void FileDb::addToDatabase(unsigned long int userID, const vector<unsigned long int>& movieIDs, bool userExists) {
    lock_guard<mutex> lock(dbMutex); // Lock for thread safety
    auto updatedDb = parse(); // Reload the latest state from file

    if (updatedDb.find(userID) != updatedDb.end()) {
        auto &userMovies = updatedDb[userID];
        for (const auto &movieID : movieIDs) {
            if (find(userMovies.begin(), userMovies.end(), movieID) == userMovies.end()) {
                userMovies.push_back(movieID);
            }
        }
    } else {
        updatedDb[userID] = movieIDs;
    }

    saveDatabase(updatedDb); // Save the updated database to the file
}

// Remove specific movies from a user's record in the database
void FileDb::RemoveFromDatabase(unsigned long userID, const vector<unsigned long>& movieIDs) {
    lock_guard<mutex> lock(dbMutex); // Lock for thread safety
    auto updatedDb = parse(); // Reload the latest state from file

    if (updatedDb.find(userID) != updatedDb.end()) {
        auto &userMovies = updatedDb[userID];
        for (const auto &movieID : movieIDs) {
            auto movieIt = find(userMovies.begin(), userMovies.end(), movieID);
            if (movieIt != userMovies.end()) {
                userMovies.erase(movieIt);
            }
        }

        if (userMovies.empty()) {
            updatedDb.erase(userID);
        }
    }

    saveDatabase(updatedDb); // Save the updated database to the file
}

// Save the database to the file
void FileDb::saveDatabase(const unordered_map<unsigned long int, vector<unsigned long int>> &updatedDb) {
    ofstream outFile(databaseFile, ios::trunc);
    if (!outFile.is_open()) {
        cerr << "Error: Could not open database file for writing." << endl;
        return;
    }

    for (const auto &[userID, movies] : updatedDb) {
        outFile << userID << "|";
        for (size_t i = 0; i < movies.size(); ++i) {
            outFile << movies[i];
            if (i != movies.size() - 1) {
                outFile << "?";
            }
        }
        outFile << "|" << endl;
    }

    outFile.close();
}
