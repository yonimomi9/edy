#include <gtest/gtest.h>
#include <unordered_map>
#include <vector>
#include <algorithm>
#include "../headers/Add.h"
#include "../headers/ICommandable.hpp"
#include "../headers/IMenu.h"
#include "../headers/FileDb.h"
#include "../headers/Post.h"
#include "../headers/IDatabase.h"

using namespace std;

class PostTest : public ::testing::Test {
protected:
    unordered_map<unsigned long int, vector<unsigned long int>> dbvector;
    unique_ptr<Post> postHandler;
    IMenu* menu; 
    unique_ptr<IDatabase> database;

    void SetUp() override {
        dbvector.clear();
        database = make_unique<FileDb>("test_db.txt", dbvector); // Provide a database mock or actual instance
        menu = nullptr; 
        postHandler = make_unique<Post>(menu, *database);
    }

    void TearDown() override {
        postHandler.reset();
    }
};

// Tests for `logicPost`
TEST_F(PostTest, LogicPost_NewUser_ReturnsCreated) {
    string arguments = "3 201 202"; // Valid arguments
    string result = postHandler->logicPost(arguments, dbvector);

    // Verify "201 Created" is returned for a new user
    EXPECT_EQ(result, "201 Created");
    EXPECT_EQ(dbvector.size(), 1);
    EXPECT_EQ(dbvector[3].size(), 2);
}

TEST_F(PostTest, LogicPost_ExistingUser_ReturnsNotFound) {
    dbvector[3] = {201, 202}; // Simulate existing user
    string arguments = "3 203";
    string result = postHandler->logicPost(arguments, dbvector);

    // Verify "404 Not Found" is returned for an existing user
    EXPECT_EQ(result, "404 Not Found");
    EXPECT_EQ(dbvector[3].size(), 2);
}

TEST_F(PostTest, LogicPost_InvalidArguments_ReturnsBadRequest) {
    string arguments = "invalid input";
    string result = postHandler->logicPost(arguments, dbvector);

    // Verify "400 Bad Request" is returned for invalid arguments
    EXPECT_EQ(result, "400 Bad Request");
}

TEST_F(PostTest, LogicPost_EmptyArguments_ReturnsBadRequest) {
    string arguments = "";
    string result = postHandler->logicPost(arguments, dbvector);

    // Verify "400 Bad Request" is returned for empty arguments
    EXPECT_EQ(result, "400 Bad Request");
}

// Tests for `execute`
TEST_F(PostTest, Execute_ValidArguments_AddsUser) {
    string arguments = "4 301 302"; // Valid arguments
    postHandler->execute(arguments, dbvector);

    // Verify the user is added correctly
    EXPECT_EQ(dbvector.size(), 1);
    EXPECT_EQ(dbvector[4].size(), 2);
    EXPECT_NE(find(dbvector[4].begin(), dbvector[4].end(), static_cast<unsigned long>(301)), dbvector[4].end());
    EXPECT_NE(find(dbvector[4].begin(), dbvector[4].end(), static_cast<unsigned long>(302)), dbvector[4].end());
}

TEST_F(PostTest, Execute_ExistingUser_DoesNotAdd) {
    dbvector[2] = {101, 102}; // Simulate existing user
    string arguments = "2 201 202";
    postHandler->execute(arguments, dbvector);

    // Verify no changes are made for an existing user
    EXPECT_EQ(dbvector.size(), 1);
    EXPECT_EQ(dbvector[2].size(), 2);
    EXPECT_EQ(find(dbvector[2].begin(), dbvector[2].end(), static_cast<unsigned long>(201)), dbvector[2].end());
}

TEST_F(PostTest, Execute_InvalidArguments_ThrowsBadRequest) {
    string arguments = "invalid input";
    postHandler->execute(arguments, dbvector);

    // Verify the database remains unchanged
    EXPECT_EQ(dbvector.size(), 0);
}

TEST_F(PostTest, Execute_EmptyArguments_ThrowsBadRequest) {
    string arguments = "";
    postHandler->execute(arguments, dbvector);

    // Verify the database remains unchanged
    EXPECT_EQ(dbvector.size(), 0);
}

// Additional Edge Cases for `logicPost` and `execute`
TEST_F(PostTest, LogicPost_ExtraSpaces_HandlesGracefully) {
    string arguments = "   5   401  402  ";
    string result = postHandler->logicPost(arguments, dbvector);

    // Verify extra spaces are handled correctly
    EXPECT_EQ(result, "201 Created");
    EXPECT_EQ(dbvector.size(), 1);
    EXPECT_EQ(dbvector[5].size(), 2);
}

TEST_F(PostTest, Execute_ExtraSpaces_HandlesGracefully) {
    string arguments = "   6   501  502  ";
    postHandler->execute(arguments, dbvector);

    // Verify extra spaces are handled correctly
    EXPECT_EQ(dbvector.size(), 1);
    EXPECT_EQ(dbvector[6].size(), 2);
    EXPECT_NE(find(dbvector[6].begin(), dbvector[6].end(), static_cast<unsigned long>(501)), dbvector[6].end());
    EXPECT_NE(find(dbvector[6].begin(), dbvector[6].end(), static_cast<unsigned long>(502)), dbvector[6].end());
}
