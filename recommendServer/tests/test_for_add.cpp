#include <gtest/gtest.h>
#include <unordered_map>
#include <vector>
#include <algorithm>
#include <string>
#include "../headers/Add.h"
#include "../headers/FileDb.h"

using namespace std;

// Test fixture for Add functionality
class AddTest : public ::testing::Test {
protected:
    string testFilePath = "test_db.txt"; // Path to the test database file
    unique_ptr<FileDb> fileDb; // Unique pointer for FileDb instance
    unique_ptr<Add> addHandler; // Unique pointer for Add handler
    unordered_map<unsigned long int, vector<unsigned long int>> dbvector; 

    void SetUp() override {
        // Ensure the data directory exists and clear the test database file
        system("mkdir -p ./data");
        clearTestFile();
        dbvector = {};
        fileDb = make_unique<FileDb>(testFilePath, dbvector);
        addHandler = make_unique<Add>(*fileDb);
    }

    void TearDown() override {
        // Clear the test database file after each test
        clearTestFile();
    }

    void clearTestFile() {
        // Truncate the file to clear its contents
        ofstream ofs(testFilePath, ofstream::trunc);
        ofs.close();
    }
};

// doesTheUserExist tests
TEST_F(AddTest, DoesTheUserExist_SanityTest) {
    // Check that an existing user is correctly identified
    dbvector = {{1, {101, 102}}, {2, {201, 202}}};
    EXPECT_EQ(addHandler->doesTheUserExist(1, dbvector), 1);
    EXPECT_EQ(addHandler->doesTheUserExist(3, dbvector), 0);
}

TEST_F(AddTest, DoesTheUserExist_NegativeTest) {
    // Ensure negative cases return the expected results
    dbvector = {{1, {101, 102}}, {2, {201, 202}}};
    EXPECT_NE(addHandler->doesTheUserExist(1, dbvector), 0);
    EXPECT_NE(addHandler->doesTheUserExist(3, dbvector), 1);
}

// addMovies tests
TEST_F(AddTest, AddMovies_SanityTest) {
    // Validate adding movies to an existing user
    dbvector = {{1, {101, 102}}};
    vector<unsigned long int> movies = {103, 104};

    addHandler->addMovies(1, dbvector, movies);

    EXPECT_EQ(dbvector[1].size(), 4);
    EXPECT_NE(find(dbvector[1].begin(), dbvector[1].end(), static_cast<unsigned long int>(103)), dbvector[1].end());
    EXPECT_NE(find(dbvector[1].begin(), dbvector[1].end(), static_cast<unsigned long int>(104)), dbvector[1].end());
}

TEST_F(AddTest, AddMovies_NegativeTest) {
    // Ensure incorrect movie addition scenarios are handled
    dbvector = {{1, {101, 102}}};
    vector<unsigned long int> movies = {103, 104};

    addHandler->addMovies(1, dbvector, movies);

    EXPECT_NE(dbvector[1].size(), 5);
}

// addUser tests
TEST_F(AddTest, AddUser_SanityTest) {
    // Validate adding a new user with movies
    dbvector = {{1, {101, 102}}};
    vector<unsigned long int> movies = {102, 103};

    addHandler->addUser(3, dbvector, movies);

    EXPECT_EQ(dbvector.size(), 2);
    EXPECT_EQ(dbvector[1].size(), 2);
    EXPECT_EQ(dbvector[3].size(), 2);
    EXPECT_NE(find(dbvector[3].begin(), dbvector[3].end(), static_cast<unsigned long int>(102)), dbvector[3].end());
    EXPECT_NE(find(dbvector[3].begin(), dbvector[3].end(), static_cast<unsigned long int>(103)), dbvector[3].end());
}

TEST_F(AddTest, AddUser_NegativeTest) {
    // Ensure negative scenarios for adding users are handled
    dbvector = {{1, {101, 102}}};
    vector<unsigned long int> movies = {102, 103};

    addHandler->addUser(3, dbvector, movies);
    EXPECT_NE(dbvector.size(), 1);
    EXPECT_NE(dbvector[3].size(), 3);
}

// createMoviesVector tests
TEST_F(AddTest, CreateMoviesVector_SanityTest) {
    // Validate movie vector creation from valid arguments
    string arguments = "1 101 102 103";
    vector<unsigned long int> movies = addHandler->createMoviesVector(arguments);

    EXPECT_EQ(movies.size(), 3);
    EXPECT_EQ(movies[0], 101);
    EXPECT_EQ(movies[1], 102);
    EXPECT_EQ(movies[2], 103);
}

TEST_F(AddTest, CreateMoviesVector_MoreThenOneSpace) {
    // Handle arguments with extra spaces
    string arguments = "1 101 102    103";
    vector<unsigned long int> movies = addHandler->createMoviesVector(arguments);

    EXPECT_EQ(movies.size(), 3);
    EXPECT_EQ(movies[0], 101);
    EXPECT_EQ(movies[1], 102);
    EXPECT_EQ(movies[2], 103);
}

TEST_F(AddTest, CreateMoviesVector_NegativeTest) {
    // Ensure incorrect movie vector creation scenarios are handled
    string arguments = "1 101 102 103";
    vector<unsigned long int> movies = addHandler->createMoviesVector(arguments);

    EXPECT_NE(movies.size(), 5);
    EXPECT_NE(movies[0], 110);
    EXPECT_NE(movies[1], 103);
    EXPECT_NE(movies[2], 101);
}

// extractUserID tests
TEST_F(AddTest, ExtractUserID_ValidInput) {
    // Test valid user ID extraction
    string arguments = "12345 101 102";
    unsigned long int userID = addHandler->extractUserID(arguments);

    EXPECT_EQ(userID, 12345);
}

TEST_F(AddTest, ExtractUserID_InvalidUserID_NonNumeric) {
    // Ensure non-numeric user IDs throw an exception
    string arguments = "abc123 101 102";
    EXPECT_THROW(addHandler->extractUserID(arguments), const char*);
}

TEST_F(AddTest, ExtractUserID_InvalidUserID_Empty) {
    // Ensure empty user IDs throw an exception
    string arguments = " ";
    EXPECT_THROW(addHandler->extractUserID(arguments), invalid_argument);
}

TEST_F(AddTest, ExtractUserID_ExtraSpaces) {
    // Handle user IDs with extra spaces
    string arguments = "   12345 101 102";
    unsigned long int userID = addHandler->extractUserID(arguments);

    EXPECT_EQ(userID, 12345);
}

// execute tests
TEST_F(AddTest, Execute_SanityTest) {
    // Validate the execution of adding a new user with movies
    string arguments = "3 201 202";

    addHandler->execute(arguments, dbvector);

    EXPECT_EQ(dbvector.size(), 1);
    EXPECT_EQ(dbvector[3].size(), 2);
    EXPECT_NE(find(dbvector[3].begin(), dbvector[3].end(), 201), dbvector[3].end());
    EXPECT_NE(find(dbvector[3].begin(), dbvector[3].end(), 202), dbvector[3].end());
}

TEST_F(AddTest, Execute_NegativeTest) {
    // Ensure negative cases for execute are handled
    string arguments = "3 201 202";

    addHandler->execute(arguments, dbvector);

    EXPECT_NE(dbvector.size(), 2);
    EXPECT_NE(dbvector[3].size(), 3);
}

TEST_F(AddTest, Execute_LessThenTwoArgs) {
    // Check exception handling for insufficient arguments
    string arguments = "101";
    EXPECT_THROW(addHandler->execute(arguments, dbvector), std::invalid_argument);
}

TEST_F(AddTest, Execute_InvalidArgs) {
    // Ensure invalid arguments throw an exception
    string arguments = "abba lion_king_1 lion_king_2";
    EXPECT_THROW(addHandler->execute(arguments, dbvector), std::invalid_argument);
}

TEST_F(AddTest, Execute_InvalidDividedArgs) {
    // Handle invalid argument delimiters
    string arguments = "1 101 102,103";
    EXPECT_THROW(addHandler->execute(arguments, dbvector), std::invalid_argument);
}
