#ifndef RECOMMEND_H
#define RECOMMEND_H

#include <unordered_map>
#include <vector>
#include <unordered_set>
#include <string>
#include "../headers/ICommandable.hpp"
#include "../headers/IMenu.h"

class Recommend : public ICommandable {
protected:
    IMenu* menu;

public:
    // Constructor
    Recommend(IMenu* menu);

    unordered_map<unsigned long int, vector<unsigned long int>> relevantUsersVector(
        unsigned long int movieID,
        unordered_map<unsigned long int, vector<unsigned long int>> dbvector);

    unordered_map<unsigned long int, unsigned long int> compareMovies(
        unsigned long int userID,
        unordered_map<unsigned long int, vector<unsigned long int>> dbvector);

    unsigned long int foo(
        unordered_map<unsigned long int, vector<unsigned long int>> updatedDbvector,
        unsigned long int movieID,
        unordered_map<unsigned long int, unsigned long int> amounts);

    unordered_set<unsigned long int> allOtherMovies(
        unordered_map<unsigned long int, vector<unsigned long int>> updatedDbvector,
        unsigned long int movieID);

    unordered_map<unsigned long int, unsigned long int> totalRelevance(
        unordered_map<unsigned long int, vector<unsigned long int>> updatedDbvector,
        unsigned long int movieID,
        unordered_map<unsigned long int, unsigned long int> amounts);

    vector<unsigned long int> recommendations(
        unordered_map<unsigned long int, unsigned long int> finalResults,
        unordered_map<unsigned long int, vector<unsigned long int>> localDBVector,
        unsigned long int userID);

    string createMessage(vector<unsigned long int> topMovies);
    
    void printResults(string results);

    unordered_set<unsigned long int> allMovies(
        unordered_map<unsigned long int, vector<unsigned long int>> localDBvector);

    string calculateAlgo(string input,  unordered_map<unsigned long int, vector<unsigned long int>>& dbvector);
    
    
    void execute(
        string input,
        unordered_map<unsigned long int, vector<unsigned long int>>& dbvector) override;
};

#endif // RECOMMEND_H
