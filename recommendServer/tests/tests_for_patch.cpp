#include <gtest/gtest.h>
#include <unordered_map>
#include <vector>
#include "../headers/Add.h"
#include "ICommandable.hpp"
#include "../headers/Patch.h"
#include "IDatabase.h"
#include <algorithm>
#include "../headers/FileDb.h"
#include "../headers/IMenu.h" 

using namespace std;

/**
 * @class PatchTest
 * @brief Test suite for the Patch class.
 */
class PatchTest : public ::testing::Test {
protected:
    unordered_map<unsigned long int, vector<unsigned long int>> dbvector;
    unique_ptr<Patch> patchHandler;
    unique_ptr<IDatabase> database;

    void SetUp() override {
        dbvector.clear();
        database = make_unique<FileDb>("test_db.txt", dbvector); 
        patchHandler = make_unique<Patch>(nullptr, *database);
    }

    void TearDown() override {
        patchHandler.reset();
    }
};

// Tests for `logicPatch`
TEST_F(PatchTest, LogicPatch_ExistingUser_AddMovies_ReturnsSuccess) {
    dbvector[1] = {101, 102}; // Simulate an existing user
    string arguments = "1 201 202"; // Valid arguments
    string result = patchHandler->logicPatch(arguments, dbvector);

    // Verify "201 Created" is returned, and movies are added correctly
    EXPECT_EQ(result, "201 Created");
    EXPECT_EQ(dbvector[1].size(), 4);
    EXPECT_NE(find(dbvector[1].begin(), dbvector[1].end(), 201), dbvector[1].end());
    EXPECT_NE(find(dbvector[1].begin(), dbvector[1].end(), 202), dbvector[1].end());
}

TEST_F(PatchTest, LogicPatch_NonExistentUser_ReturnsNotFound) {
    string arguments = "2 301 302"; // Non-existent user ID
    string result = patchHandler->logicPatch(arguments, dbvector);

    // Verify "404 Not Found" is returned, and database remains unchanged
    EXPECT_EQ(result, "404 Not Found");
    EXPECT_EQ(dbvector.size(), 0);
}

TEST_F(PatchTest, LogicPatch_InvalidArguments_ReturnsBadRequest) {
    string arguments = "invalid input"; // Invalid arguments
    string result = patchHandler->logicPatch(arguments, dbvector);

    // Verify "400 Bad Request" is returned
    EXPECT_EQ(result, "400 Bad Request");
}

TEST_F(PatchTest, LogicPatch_EmptyArguments_ReturnsBadRequest) {
    string arguments = ""; // Empty arguments
    string result = patchHandler->logicPatch(arguments, dbvector);

    // Verify "400 Bad Request" is returned
    EXPECT_EQ(result, "400 Bad Request");
}

// Tests for `execute`
TEST_F(PatchTest, Execute_ValidArguments_AddMovies) {
    dbvector[3] = {101, 102}; // Simulate an existing user
    string arguments = "3 201 202"; // Valid arguments
    patchHandler->execute(arguments, dbvector);

    // Verify the movies are added correctly
    EXPECT_EQ(dbvector[3].size(), 4);
    EXPECT_NE(find(dbvector[3].begin(), dbvector[3].end(), 201), dbvector[3].end());
    EXPECT_NE(find(dbvector[3].begin(), dbvector[3].end(), 202), dbvector[3].end());
}

TEST_F(PatchTest, Execute_NonExistentUser_DoesNotAddMovies) {
    string arguments = "4 301 302"; // Non-existent user ID
    patchHandler->execute(arguments, dbvector);

    // Verify no changes are made for a non-existent user
    EXPECT_EQ(dbvector.size(), 0);
}

TEST_F(PatchTest, Execute_InvalidArguments_ThrowsBadRequest) {
    string arguments = "invalid input"; // Invalid arguments
    patchHandler->execute(arguments, dbvector);

    // Verify the database remains unchanged
    EXPECT_EQ(dbvector.size(), 0);
}

TEST_F(PatchTest, Execute_EmptyArguments_ThrowsBadRequest) {
    string arguments = ""; // Empty arguments
    patchHandler->execute(arguments, dbvector);

    // Verify the database remains unchanged
    EXPECT_EQ(dbvector.size(), 0);
}

// Additional Edge Cases for `logicPatch` and `execute`
TEST_F(PatchTest, LogicPatch_ExtraSpaces_HandlesGracefully) {
    dbvector[5] = {401}; // Simulate an existing user
    string arguments = "  5   501  502  "; // Extra spaces in arguments
    string result = patchHandler->logicPatch(arguments, dbvector);

    // Verify extra spaces are handled correctly
    EXPECT_EQ(result, "201 Created");
    EXPECT_EQ(dbvector[5].size(), 3);
}

TEST_F(PatchTest, Execute_ExtraSpaces_HandlesGracefully) {
    dbvector[6] = {601}; // Simulate an existing user
    string arguments = "   6   602  603  "; // Extra spaces in arguments
    patchHandler->execute(arguments, dbvector);

    // Verify extra spaces are handled correctly
    EXPECT_EQ(dbvector[6].size(), 3);
    EXPECT_NE(find(dbvector[6].begin(), dbvector[6].end(), 602), dbvector[6].end());
    EXPECT_NE(find(dbvector[6].begin(), dbvector[6].end(), 603), dbvector[6].end());
}
