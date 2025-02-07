#include <iostream>
#include "../headers/ICommandable.hpp"
#include <vector>
#include <unordered_map>
#include <string>
#include <iterator>
#include "../headers/IMenu.h"
#include "../headers/Recommend.h"
#include <algorithm>
#include <sstream>
#include <bits/stdc++.h>

using namespace std;

/*
 * The Recommend class implemets ICommandable interface.
 * When the user will insert "recommend" with his userID and a movieIDs,
 *  this class will be responsible to recommend him on relevant movies, base on other viewers.
 */
    Recommend::Recommend(IMenu* menu): menu(menu){}

    /**
     * @param: MovieID,  dbvector: unordered map with userIDs and vectors of movies the have watched.
     * @return: Unordered map including only users who watched the movie with the movieID.
     * @purpose: Filter non-relevant users for the calculation.
     */
    unordered_map<unsigned long int, vector<unsigned long int>> Recommend::relevantUsersVector(unsigned long int movieID, unordered_map<unsigned long int, vector<unsigned long int>> dbvector){
        
        unordered_map<unsigned long int, vector<unsigned long int>> result;

        // Iterate through each user in the database
        for (const auto& [userID, movies] : dbvector) {
            // Check if the current user's movie list contains the given movieID
            if (find(movies.begin(), movies.end(), movieID) != movies.end()) {
                // Add the user to the result
                result[userID] = movies;
            }
        }
        return result;
    }

    /**
     * @param: UserID, dbvector: unordered map with userIDs and vectors of movies the have watched
     * @return: For every user the number of similar movies with userID.
     */

    unordered_map<unsigned long int, unsigned long int> Recommend::compareMovies(unsigned long int userID, unordered_map<unsigned long int, vector<unsigned long int>> dbvector) {
        unordered_map<unsigned long int, unsigned long int> result;

        // Get the list of movies for the target user
        const vector<unsigned long int>& userMovies = dbvector[userID];
        unordered_set<unsigned long int> userMoviesSet(userMovies.begin(), userMovies.end());

        // Iterate over all other users in the database
        for (const auto& [otherUserID, movies] : dbvector) {
            if (otherUserID == userID) {
                continue; // Skip the target user
            }

            // Count common movies
            unsigned long int commonCount = 0;
            for (const auto& movie : movies) {
                if (userMoviesSet.find(movie) != userMoviesSet.end()) {
                    ++commonCount;
                }
            }

            // Add the result to the map
            result[otherUserID] = commonCount;
        }

        return result;
    }

    /**
     * @param: The filterd db vector, movieID, an unordered map numbers if similarities.
     * @return: total relevance for a specific movie
     */
    unsigned long int Recommend::foo(unordered_map<unsigned long int, vector<unsigned long int>> updatedDbvector, unsigned long int movieID, unordered_map<unsigned long int, unsigned long int> amounts) {
        unsigned long int sum = 0;

        // Iterate over all users in the filtered database
        for (const auto& [userID, movies] : updatedDbvector) {
            // Check if the user watched the given movieID
            if (find(movies.begin(), movies.end(), movieID) != movies.end()) {
                // Add the score from the first table (amounts) for this user
                if (amounts.find(userID) != amounts.end()) {
                    sum += amounts[userID];
                }
            }
        }
        return sum;
    }


    /**
     * @param: The filterd db vector, movieID
     * @return: a set with all the movies except from ours.
     */
    unordered_set<unsigned long int> Recommend::allOtherMovies(unordered_map<unsigned long int, vector<unsigned long int>> updatedDbvector,unsigned long int movieID) {
        unordered_set<unsigned long int> movieSet; // To store unique movie IDs

        // Iterate over the database
        for (const auto& [userID, movies] : updatedDbvector) {
            for (unsigned long int movie : movies) {
                if (movie != movieID) { // Exclude the specified movieID
                    movieSet.insert(movie);
                }
            }
        }
        // Return all movies except the target movieID
        return movieSet;
    }

    /**
     * @param: updatedDbvector, movieID, num of similarities.
     * @return: unorderd map with total relevance for all movies.
     */
    unordered_map<unsigned long int, unsigned long int> Recommend::totalRelevance(unordered_map<unsigned long int, vector<unsigned long int>> updatedDbvector, unsigned long int movieID, unordered_map<unsigned long int, unsigned long int> amounts) {
        unordered_map<unsigned long int, unsigned long int> result;

        // Get all unique movies except the recommended movie
        unordered_set<unsigned long int> allMovies = allOtherMovies(updatedDbvector, movieID);

        // Calculate relevance for each movie
        for (const auto& movie : allMovies) {
            result[movie] = foo(updatedDbvector, movie, amounts);
        }

        return result;
    }


    /**
     * @param: The total relevance of every movie, the dbVector, userID.
     * @return: Vector with top movies to recommend in the wanted order.
     */
    vector<unsigned long int> Recommend::recommendations(unordered_map<unsigned long int, unsigned long int> finalResults, unordered_map<unsigned long int, vector<unsigned long int>>localDBVector, unsigned long int userID) {
    // Step 1: Create a copy of finalResults
        unordered_map<unsigned long int, unsigned long int> filteredResults = finalResults;

        // Step 2: Filter the finalResults by removing movies the user has already watched
        unordered_set<unsigned long int> watchedMovies(localDBVector[userID].begin(), localDBVector[userID].end());
        for (const auto& movie : watchedMovies) {
            if (filteredResults.find(movie) != filteredResults.end()) {
                filteredResults.erase(movie); // Remove watched movies
            }
        }

        // Step 3: Sort the remaining movies by score (descending) and movieID (ascending)
        vector<pair<unsigned long int, unsigned long int>> sortedMovies(filteredResults.begin(), filteredResults.end());
        sort(sortedMovies.begin(), sortedMovies.end(), [](const pair<unsigned long int, unsigned long int>& a, const pair<unsigned long int, unsigned long int>& b) {
            if (a.second == b.second) {
                return a.first < b.first; // If scores are equal, sort by MovieID ascending
            }
            return a.second > b.second; // Otherwise, sort by score descending
        });

        // Step 4: Create a vector to store the top 10 movieIDs
        vector<unsigned long int> topMovies;
        for (size_t i = 0; i < sortedMovies.size() && topMovies.size() < 10; ++i) {
            topMovies.push_back(sortedMovies[i].first); // Add the movieID to the vector
        }
        
        // Step 5: Return the vector
        return topMovies;
    }
    string Recommend :: createMessage(vector<unsigned long int> topMovies){
        // Create a string stream to build the resulting string
        ostringstream resultStream;

        // Iterate over the vector to append elements to the string
        for (size_t i = 0; i < topMovies.size(); ++i) {
            resultStream << topMovies[i]; // Add the number
            if (i != topMovies.size() - 1) {
                resultStream << " "; // Add a space unless it's the last element
            }
        }

        // Convert the string stream into a string
        string resultString = resultStream.str();
        return resultString;
    }
    
    void Recommend::printResults(string result){
        if((result == "invalid argument") || (result == "logical error")){
            return;
        }
        if(menu){
            menu->displayOutput(result);
        }
    }

    unordered_set<unsigned long int> Recommend::allMovies(unordered_map<unsigned long int, vector<unsigned long int>> localDBvector){
        unordered_set<unsigned long int> completeMovieSet; // To store unique movie IDs
        // Iterate over the database
        for (const auto& [userID, movies] : localDBvector) {
            for (unsigned long int movie : movies) {
                completeMovieSet.insert(movie);
            }
        }
        return completeMovieSet;
    }
    /** calculate recommendation 
     * @param input : (string) and a reference to map of all data.
     * @param dbvector : the local data vector
     */
    string Recommend :: calculateAlgo(string input,  unordered_map<unsigned long int, vector<unsigned long int>>& dbvector){
        try {
            // Parse user input
            stringstream ss(input);
            unsigned long int userID, movieID;

            if (!(ss >> userID)) {
                throw invalid_argument("Invalid userID format. Expected unsigned long int.");// invalid argument
            }
            if (!(ss >> movieID)) {
                throw invalid_argument("Invalid movieID format. Expected unsigned long int.");// invalid argument
            }
            string extraInput;
            if (ss >> extraInput) {
                throw invalid_argument("Extra input detected after userID and movieID.");// invalid argument
            }

            // Validate userID and movieID
            if (dbvector.find(userID) == dbvector.end()) {
                throw logic_error("User not found"); //logic invalid
            }
            unordered_set<unsigned long int> allMovieIDs = allMovies(dbvector);
            // if (allMovieIDs.find(movieID) == allMovieIDs.end()) {
            //     throw logic_error("This movie doesn't exist"); //logic invalid
            // }
            // Step 1: Compare movies to calculate similarity (firstTable)
            unordered_map<unsigned long int, unsigned long int> firstTable = compareMovies(userID, dbvector);

            // Step 2: Get relevant users for the given movie
            unordered_map<unsigned long int, vector<unsigned long int>> filteredVector = relevantUsersVector(movieID, dbvector);

            // Step 3: Calculate total relevance (secondTable)
            unordered_map<unsigned long int, unsigned long int> secondTable = totalRelevance(filteredVector, movieID, firstTable);

            // Step 4: Generate recommendations and print the results
            vector<unsigned long int> vectorOfRecommendations = recommendations(secondTable, dbvector, userID);
            string result = createMessage(vectorOfRecommendations);
            return result;
        }catch (invalid_argument) {
            return "invalid argument";
        }catch(logic_error){
            return "logical error";
        }
    }

    /** execute the recommend command
     * @param input : (string) and a reference to map of all data.
     * @param dbvector : the local data vector
     * @return: None.
     * @purpose: The function will ran the "recommend" command. It will be responsible for calculating moovie recommendations to the user.
     */
    void Recommend::execute(string input, unordered_map<unsigned long int, vector<unsigned long int>>& dbvector) {
        //calculate recommendation and make string for him
        string result = calculateAlgo(input,dbvector);
        // send the message from recommend to the menu
        printResults(result);
    }
    