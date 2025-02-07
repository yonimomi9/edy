#ifndef FILEDB_H
#define FILEDB_H

#include "IDatabase.h"
#include <unordered_map>
#include <vector>
#include <string>
#include <fstream>
#include <mutex>
using namespace std;

// File class for file-specific operations, extending IDatabase
class FileDb : public IDatabase
{
private:
    string databaseFile;                                                   // Path to the file
    unordered_map<unsigned long int, vector<unsigned long int>> &dbvector; // Pointer to the shared in-memory database
    mutex dbMutex;                                                         // Mutex for thread safety

public:
    // Constructor
    FileDb(const string &dbFile, unordered_map<unsigned long int, vector<unsigned long int>> &db);

    // Initialize the file (create it if it doesn't exist)
    void initializeDatabaseFile();

    // Parse the file and populate the in-memory data structure
    unordered_map<unsigned long int, vector<unsigned long int>> parse();

    // Add new data to the database file
    void addToDatabase(unsigned long int userID, const vector<unsigned long int> &movieIDs, bool userExists) override;
    
    // Remove data from the database file
    void RemoveFromDatabase(unsigned long userID, const vector<unsigned long>& movieIDs);
    
    void saveDatabase(const unordered_map<unsigned long int, vector<unsigned long int>> &updatedDb);
};

#endif // FILEDB_H
