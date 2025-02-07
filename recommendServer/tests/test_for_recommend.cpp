#include <gtest/gtest.h>
#include <unordered_map>
#include <unordered_set>
#include <vector>
#include <string>
#include "../headers/Recommend.h"

using namespace std;

// Tests for relevantUsersVector
TEST(RecommendTest, RelevantUsersVector_BasicInput) {
    unordered_map<unsigned long int, vector<unsigned long int>> dbvector = {
        {1, {101, 102}},   
        {2, {102, 103}},   
        {3, {101, 104}}   
    };
    unsigned long int movieID = 101;
    Recommend recommendHandler(nullptr);

    auto result = recommendHandler.relevantUsersVector(movieID, dbvector);
    EXPECT_EQ(result.size(), 2);
    EXPECT_TRUE(result.find(1) != result.end());
    EXPECT_TRUE(result.find(3) != result.end());

    if (result.find(1) != result.end()) {
        EXPECT_EQ(result[1], vector<unsigned long int>({101, 102}));
    }
    if (result.find(3) != result.end()) {
        EXPECT_EQ(result[3], vector<unsigned long int>({101, 104}));
    }
}

TEST(RecommendTest, RelevantUsersVector_NoUsersWatchedMovie) {
    unordered_map<unsigned long int, vector<unsigned long int>> dbvector = {
        {1, {101, 102}},   
        {2, {102, 103}},   
        {3, {101, 104}}   
    };
    unsigned long int movieID = 999;
    Recommend recommendHandler(nullptr);

    auto result = recommendHandler.relevantUsersVector(movieID, dbvector);
    EXPECT_TRUE(result.empty());
}

TEST(RecommendTest, RelevantUsersVector_EmptyDatabase) {
    unordered_map<unsigned long int, vector<unsigned long int>> dbvector;
    unsigned long int movieID = 101;
    Recommend recommendHandler(nullptr);

    auto result = recommendHandler.relevantUsersVector(movieID, dbvector);
    EXPECT_TRUE(result.empty());
}

// Tests for compareMovies
TEST(RecommendTest, CompareMovies_BasicInput) {
    unordered_map<unsigned long int, vector<unsigned long int>> dbvector = {
        {1, {200, 300, 400}},
        {2, {300, 500}},
        {3, {100, 200}}
    };
    unsigned long int userID = 1;
    Recommend recommendHandler(nullptr);

    auto result = recommendHandler.compareMovies(userID, dbvector);
    EXPECT_FALSE(result.empty());
    EXPECT_EQ(result[3], 1);
    EXPECT_EQ(result[2], 1);
}

TEST(RecommendTest, CompareMovies_Negative) {
    unordered_map<unsigned long int, vector<unsigned long int>> dbvector = {
        {1, {200, 300, 400}},
        {2, {600, 500}},
        {3, {100, 600}}
    };
    unsigned long int userID = 1;
    Recommend recommendHandler(nullptr);

    auto result = recommendHandler.compareMovies(userID, dbvector);
    EXPECT_EQ(result[3], 0);
    EXPECT_EQ(result[2], 0);
}

// Tests for foo
TEST(RecommendTest, Foo_BasicInput) {
    unordered_map<unsigned long int, vector<unsigned long int>> dbvector = {
        {1, {101, 102}},
        {2, {102, 103}},
        {3, {101, 104}}
    };
    unsigned long int movieID = 101;
    unordered_map<unsigned long int, unsigned long int> amounts = {
        {1, 5},
        {2, 10},
        {3, 15}
    };
    Recommend recommendHandler(nullptr);

    auto result = recommendHandler.foo(dbvector, movieID, amounts);
    EXPECT_EQ(result, 20);
}

TEST(RecommendTest, Foo_InvalidMovieID) {
    unordered_map<unsigned long int, vector<unsigned long int>> dbvector = {
        {1, {101, 102}},
        {2, {102, 103}},
        {3, {101, 104}}
    };
    unsigned long int invalidMovieID = 999;
    unordered_map<unsigned long int, unsigned long int> amounts = {
        {1, 5},
        {2, 10},
        {3, 15}
    };
    Recommend recommendHandler(nullptr);

    auto result = recommendHandler.foo(dbvector, invalidMovieID, amounts);
    EXPECT_EQ(result, 0);
}

TEST(RecommendTest, Foo_EdgeCase1) {
    unordered_map<unsigned long int, vector<unsigned long int>> dbvector;
    unsigned long int invalidMovieID = 101;
    unordered_map<unsigned long int, unsigned long int> amounts = {
        {1, 5},
        {2, 10},
        {3, 15}
    };
    Recommend recommendHandler(nullptr);

    auto result = recommendHandler.foo(dbvector, invalidMovieID, amounts);
    EXPECT_EQ(result, 0);
}

TEST(RecommendTest, Foo_EdgeCase2) {
    unordered_map<unsigned long int, vector<unsigned long int>> dbvector = {
        {1, {101, 102}},
        {2, {102, 103}},
        {3, {101, 104}}
    };
    unsigned long int invalidMovieID = 101;
    unordered_map<unsigned long int, unsigned long int> amounts;
    Recommend recommendHandler(nullptr);

    auto result = recommendHandler.foo(dbvector, invalidMovieID, amounts);
    EXPECT_EQ(result, 0);
}

// Tests for allOtherMovies
TEST(RecommendTest, AllOtherMovies_BasicInput) {
    unordered_map<unsigned long int, vector<unsigned long int>> dbvector = {
        {1, {101, 102}},
        {2, {102, 103}},
        {3, {101, 104}}
    };
    unsigned long int movieID = 101;
    Recommend recommendHandler(nullptr);

    auto result = recommendHandler.allOtherMovies(dbvector, movieID);
    EXPECT_EQ(result.size(), 3);
    EXPECT_TRUE(result.find(102) != result.end());
    EXPECT_TRUE(result.find(103) != result.end());
    EXPECT_TRUE(result.find(104) != result.end());
}

TEST(RecommendTest, AllOtherMovies_EmptyDatabase) {
    unordered_map<unsigned long int, vector<unsigned long int>> dbvector;
    unsigned long int movieID = 101;
    Recommend recommendHandler(nullptr);

    auto result = recommendHandler.allOtherMovies(dbvector, movieID);
    EXPECT_TRUE(result.empty());
}

// Tests for totalRelevance
TEST(RecommendTest, TotalRelevance_BasicInput) {
    unordered_map<unsigned long int, vector<unsigned long int>> dbvector = {
        {1, {101, 102}},
        {2, {102, 103, 101}},
        {3, {101, 104}}
    };
    unsigned long int movieID = 101;
    unordered_map<unsigned long int, unsigned long int> amounts = {
        {1, 5},
        {2, 10},
        {3, 15}
    };
    Recommend recommendHandler(nullptr);

    auto result = recommendHandler.totalRelevance(dbvector, movieID, amounts);
    EXPECT_EQ(result.size(), 3);
    EXPECT_EQ(result[103], 10);
    EXPECT_EQ(result[102], 15);
    EXPECT_EQ(result[104], 15);
}

TEST(RecommendTest, TotalRelevance_NoRelevanceFound) {
    unordered_map<unsigned long int, vector<unsigned long int>> dbvector = {
        {1, {101, 102}},
        {2, {102, 103, 101}},
        {3, {101, 104}}
    };
    unsigned long int movieID = 999;
    unordered_map<unsigned long int, unsigned long int> amounts = {
        {1, 5},
        {2, 10},
        {3, 15}
    };
    Recommend recommendHandler(nullptr);

    auto result = recommendHandler.totalRelevance(dbvector, movieID, amounts);
    EXPECT_EQ(result.size(),4);
}

// Tests for recommendations
TEST(RecommendTest, Recommendations_BasicInput) {
    unordered_map<unsigned long int, vector<unsigned long int>> dbvector = {
        {1, {101, 102}}, 
        {2, {102, 103}}, 
        {3, {101, 104}} 
    };
    unordered_map<unsigned long int, unsigned long int> finalResults = {
        {101, 5},  
        {102, 15},  
        {103, 10},  
        {104, 20},  
        {105, 25}   
    };
    unsigned long int userID = 1;
    Recommend recommendHandler(nullptr);

    auto result = recommendHandler.recommendations(finalResults, dbvector, userID);
    EXPECT_EQ(result.size(), 3);
    EXPECT_EQ(result[0], 105);
    EXPECT_EQ(result[1], 104);
    EXPECT_EQ(result[2], 103);
}

TEST(RecommendTest, Recommendations_Top10Movies) {
    unordered_map<unsigned long int, vector<unsigned long int>> dbvector = {
        {1, {101, 102}} // User 1 has watched movies 101, 102
    };
    unordered_map<unsigned long int, unsigned long int> finalResults;
    for (unsigned long int i = 100; i <= 120; ++i) {
        finalResults[i] = i;
    }
    unsigned long int userID = 1;
    Recommend recommendHandler(nullptr);

    auto result = recommendHandler.recommendations(finalResults, dbvector, userID);

    EXPECT_EQ(result.size(), 10);
    EXPECT_EQ(result[0], 120);
    EXPECT_EQ(result[9], 111);
}

TEST(RecommendTest, Recommendations_AllMoviesWatched) {
    unordered_map<unsigned long int, vector<unsigned long int>> dbvector = {
        {1, {101, 102, 103, 104, 105}} // User 1 has watched all the movies
    };
    unordered_map<unsigned long int, unsigned long int> finalResults = {
        {101, 5}, {102, 15}, {103, 10}, {104, 20}, {105, 25}
    };
    unsigned long int userID = 1;
    Recommend recommendHandler(nullptr);

    auto result = recommendHandler.recommendations(finalResults, dbvector, userID);

    EXPECT_TRUE(result.empty());
}

TEST(RecommendTest, Recommendations_EmptyDatabase) {
    unordered_map<unsigned long int, vector<unsigned long int>> dbvector;
    unordered_map<unsigned long int, unsigned long int> finalResults = {
        {101, 5}, {102, 15}, {103, 10}
    };
    unsigned long int userID = 1;
    Recommend recommendHandler(nullptr);

    auto result = recommendHandler.recommendations(finalResults, dbvector, userID);

    EXPECT_EQ(result.size(), 3);
    EXPECT_EQ(result[0], 102);
    EXPECT_EQ(result[2], 101);
}

TEST(RecommendTest, Recommendations_TieInScores) {
    unordered_map<unsigned long int, vector<unsigned long int>> dbvector = {
        {1, {101, 102}}
    };
    unordered_map<unsigned long int, unsigned long int> finalResults = {
        {103, 15}, // Movie 103: Score 15
        {104, 15}, // Movie 104: Score 15
        {105, 20}  // Movie 105: Score 20
    };
    unsigned long int userID = 1;
    Recommend recommendHandler(nullptr);

    auto result = recommendHandler.recommendations(finalResults, dbvector, userID);
    EXPECT_EQ(result.size(), 3);
    EXPECT_EQ(result[0], 105);
    EXPECT_EQ(result[1], 103);
    EXPECT_EQ(result[2], 104);
}

// Tests for createMessage
TEST(RecommendTest, CreateMessage_BasicInput) {
    std::vector<unsigned long int> topMovies = {101, 102, 103};
    Recommend recommendHandler(nullptr);

    auto result = recommendHandler.createMessage(topMovies);
    EXPECT_EQ(result, "101 102 103");
}

TEST(RecommendTest, CreateMessage_EmptyInput) {
    std::vector<unsigned long int> topMovies;
    Recommend recommendHandler(nullptr);

    auto result = recommendHandler.createMessage(topMovies);
    EXPECT_TRUE(result.empty());
}

TEST(RecommendTest, CreateMessage_SingleMovie) {
    std::vector<unsigned long int> topMovies = {101};
    Recommend recommendHandler(nullptr);

    auto result = recommendHandler.createMessage(topMovies);
    EXPECT_EQ(result, "101");
}

// Tests for allMovies
TEST(RecommendTest, AllMovies_BasicInput) {
    unordered_map<unsigned long int, vector<unsigned long int>> dbvector = {
        {1, {101, 102}},
        {2, {102, 103}},
        {3, {101, 104}}
    };
    Recommend recommendHandler(nullptr);

    auto result = recommendHandler.allMovies(dbvector);

    EXPECT_EQ(result.size(), 4);
    EXPECT_TRUE(result.find(101) != result.end());
    EXPECT_TRUE(result.find(102) != result.end());
    EXPECT_TRUE(result.find(103) != result.end());
    EXPECT_TRUE(result.find(104) != result.end());
}

TEST(RecommendTest, AllMovies_EmptyDatabase) {
    unordered_map<unsigned long int, vector<unsigned long int>> dbvector;
    Recommend recommendHandler(nullptr);

    auto result = recommendHandler.allMovies(dbvector);
    EXPECT_TRUE(result.empty());
}

// Tests for calculateAlgo
TEST(RecommendTest, CalculateAlgo_ValidInput) {
    unordered_map<unsigned long int, vector<unsigned long int>> dbvector = {
        {1, {100, 101, 102, 103}},
        {2, {101, 102, 104, 105, 106}},
        {3, {100, 104, 105, 107, 108}},
        {4, {101, 105, 106, 107, 109, 110}},
        {5, {100, 102, 103, 105, 108, 111}},
        {6, {100, 103, 104, 110, 111, 112, 113}},
        {7, {102, 105, 106, 107, 108, 109, 110}},
        {8, {101, 104, 105, 106, 109, 111, 114}},
        {9, {100, 103, 105, 107, 112, 113, 115}},
        {10, {100, 102, 105, 106, 107, 109, 110, 116}}
  
    };
    string input = "1 104";
    Recommend recommendHandler(nullptr);

    auto result = recommendHandler.calculateAlgo(input, dbvector);
    EXPECT_EQ(result, "105 106 111 110 112 113 107 108 109 114");
}

TEST(RecommendTest, CalculateAlgo_InvalidUserID) {
    unordered_map<unsigned long int, vector<unsigned long int>> dbvector = {
        {1, {101, 102}},  
        {2, {102, 103}},  
        {3, {101, 104}}  
    };
    string input = "999 101"; // Invalid userID
    Recommend recommendHandler(nullptr);

    auto result = recommendHandler.calculateAlgo(input, dbvector);

    EXPECT_EQ(result, "logical error");
}


TEST(RecommendTest, CalculateAlgo_ExtraInput) {
    unordered_map<unsigned long int, vector<unsigned long int>> dbvector = {
        {1, {101, 102}},  
        {2, {102, 103}},  
        {3, {101, 104}}   
    };
    string input = "1 101 extra"; // Extra input
    Recommend recommendHandler(nullptr);

    auto result = recommendHandler.calculateAlgo(input, dbvector);

    EXPECT_EQ(result, "invalid argument");
}

TEST(RecommendTest, CalculateAlgo_BadInput) {
    unordered_map<unsigned long int, vector<unsigned long int>> dbvector = {
        {1, {101, 102}},  
        {2, {102, 103}},  
        {3, {101, 104}}   
    };
    string input = "a 101"; 
    Recommend recommendHandler(nullptr);

    auto result = recommendHandler.calculateAlgo(input, dbvector);

    EXPECT_EQ(result, "invalid argument");
}

TEST(RecommendTest, CalculateAlgo_BadInputSecond) {
    unordered_map<unsigned long int, vector<unsigned long int>> dbvector = {
        {1, {101, 102}},  
        {2, {102, 103}},  
        {3, {101, 104}}   
    };
    string input = "101 a"; 
    Recommend recommendHandler(nullptr);

    auto result = recommendHandler.calculateAlgo(input, dbvector);

    EXPECT_EQ(result, "invalid argument");
}