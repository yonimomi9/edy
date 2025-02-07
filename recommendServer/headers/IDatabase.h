#ifndef IDATABASE_H
#define IDATABASE_H

#include <unordered_map>
#include <vector>

using namespace std;
/**
 * Interface representing a database handler.
 * - Manages access to a shared in-memory data structure (`dbvector`).
 * - Allows derived classes to define methods for database operations.
 * - IDatabase is the interface that declares, if you derive from it you must use all the methods in the contract (abstract class).
 * - If you choose to include it, as "#include <IDatabase.h>" you can use part of the methods.
 */

class IDatabase
{
protected:
    unordered_map<unsigned long int, vector<unsigned long int>> &dbvector; // Pointer to the shared in-memory database

public:
    // Constructor accepting a pointer to the shared database
    explicit IDatabase(unordered_map<unsigned long int, vector<unsigned long int>> &db)
        : dbvector(db) {}

    virtual void initializeDatabaseFile() = 0;

    // Virtual method to add/update data in the file database
    virtual void addToDatabase(unsigned long int userID, const vector<unsigned long int> &movieIDs, bool userExists) = 0;

    // Virtual method to remove data from the database file
    virtual void RemoveFromDatabase(unsigned long userID, const vector<unsigned long>& movieIDs) = 0;

    virtual unordered_map<unsigned long int, vector<unsigned long int>> parse() = 0;

    virtual void saveDatabase(const unordered_map<unsigned long int, vector<unsigned long int>> &updatedDb) = 0;
};

#endif // IDATABASE_H
