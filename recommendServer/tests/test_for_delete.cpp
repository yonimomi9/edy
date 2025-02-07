# include <gtest/gtest.h>
#include <unordered_map>
#include <vector>
#include <algorithm>
#include <string>
#include "../headers/Delete.h"
#include "../headers/FileDb.h"
#include "../headers/IMenu.h"

using namespace std;

class DeleteTest : public ::testing::Test {
protected:
    string testFilePath = "test_db.txt"; // the data file
    unique_ptr<FileDb> fileDb;
    unique_ptr<Delete> deleteHandler;
    unordered_map<unsigned long int, vector<unsigned long int>> dbvector;

    void SetUp() override {
        system("mkdir -p ./data"); // Ensure the data directory exists
        clearTestFile();
        dbvector = {};
        fileDb = make_unique<FileDb>(testFilePath, dbvector);
        deleteHandler = make_unique<Delete>(nullptr, *fileDb);
    }

    void TearDown() override {
        clearTestFile();
    }

    void clearTestFile() {
        ofstream ofs(testFilePath, ofstream::trunc);
        ofs.close();
    }
};
// doesTheUserExist
TEST_F(DeleteTest, DoesTheUserExist_SanityTest) {
    dbvector = {{1, {101, 102}}, {2, {201, 202}}};
    
    EXPECT_EQ(deleteHandler->doesTheUserExist(1, dbvector), 1);
    EXPECT_EQ(deleteHandler->doesTheUserExist(3, dbvector), 0);
}
TEST_F(DeleteTest, DoesTheUserExist_NegativeTest) {
    dbvector = {{1, {101, 102}}, {2, {201, 202}}};
    
    EXPECT_NE(deleteHandler->doesTheUserExist(1, dbvector), 0);
    EXPECT_NE(deleteHandler->doesTheUserExist(3, dbvector), 1);
}
// createMoviesVector
TEST_F(DeleteTest, CreateMoviesVector_SanityTest) {
    string arguments = "1 101 102 103";
    vector<unsigned long int> movies = deleteHandler->createMoviesVector(arguments);

    EXPECT_EQ(movies.size(), 3);
    EXPECT_EQ(movies[0], 101);
    EXPECT_EQ(movies[1], 102);
    EXPECT_EQ(movies[2], 103);
    
}
// check if this valid also in delete?
TEST_F(DeleteTest, CreateMoviesVector_MoreThenOneSpace) {
    string arguments = "1 101 102    103";
    vector<unsigned long int> movies = deleteHandler->createMoviesVector(arguments);

    EXPECT_EQ(movies.size(), 3);
    EXPECT_EQ(movies[0], 101);
    EXPECT_EQ(movies[1], 102);
    EXPECT_EQ(movies[2], 103);
}
TEST_F(DeleteTest, CreateMoviesVector_NegativeTest) {
    string arguments = "1 101 102 103";
    vector<unsigned long int> movies = deleteHandler->createMoviesVector(arguments);

    EXPECT_NE(movies.size(), 5);
    EXPECT_NE(movies[0], 110);
    EXPECT_NE(movies[1], 103);
    EXPECT_NE(movies[2], 101);
}
// doesTheMovieExist
TEST_F(DeleteTest, DoesTheMovieExist_SanityTest) {
    dbvector = {{1, {101, 102}}, {2, {201, 202}}};
    
    EXPECT_EQ(deleteHandler->doesTheMovieExist(dbvector, 201, 2), 1);
    EXPECT_EQ(deleteHandler->doesTheMovieExist(dbvector, 205, 2), 0);
    EXPECT_EQ(deleteHandler->doesTheMovieExist(dbvector, 201, 1), 0);
}
TEST_F(DeleteTest, DoesTheMovieExist_NegativeTest) {
    dbvector = {{1, {101, 102}}, {2, {201, 202}}};
    
    EXPECT_NE(deleteHandler->doesTheMovieExist(dbvector, 201, 2), 0);
    EXPECT_NE(deleteHandler->doesTheMovieExist(dbvector, 205, 2), 1);
    EXPECT_NE(deleteHandler->doesTheMovieExist(dbvector, 201, 1), 1);
}
// removeMovie
TEST_F(DeleteTest, RemoveMovie_SanityTest){
    dbvector = {{1, {101, 102}}, {2, {201, 202}}};
    deleteHandler->removeMovie(dbvector, 201, 2);

    EXPECT_EQ(dbvector[2].size(), 1);
    EXPECT_EQ(find(dbvector[2].begin(), dbvector[2].end(), static_cast<unsigned long int>(201)), dbvector[2].end());
    EXPECT_NE(find(dbvector[2].begin(), dbvector[2].end(), static_cast<unsigned long int>(202)), dbvector[2].end());

}
TEST_F(DeleteTest, RemoveMovie_NegativeTest) {
    dbvector = {{1, {101, 102}}, {2, {201, 202}}};
    deleteHandler->removeMovie(dbvector, 201, 2);

    EXPECT_EQ(dbvector[2].size(), 1); // One movie should remain
    EXPECT_EQ(find(dbvector[2].begin(), dbvector[2].end(), 201), dbvector[2].end()); // 201 should not be found
    EXPECT_NE(find(dbvector[2].begin(), dbvector[2].end(), 202), dbvector[2].end()); // 202 should still exist
}

// execute
TEST_F(DeleteTest, Execute_SanityTest) {
    dbvector = {{1, {101, 102}}, {2, {201, 202}}, {3, {201, 202}}};
    string arguments = "3 201 202";

    deleteHandler->execute(arguments, dbvector);

    // Check if user 3 has been removed
    EXPECT_EQ(dbvector.find(3), dbvector.end());  // User 3 should not exist
    EXPECT_EQ(dbvector.size(), 2); // Only 2 users should remain
}
TEST_F(DeleteTest, Execute_NegativeTest) {
    dbvector = {{1, {101, 102}}, {2, {201, 202}}, {3, {201, 202}}};
    string arguments = "3 201 202";

    deleteHandler->execute(arguments, dbvector);

    EXPECT_NE(dbvector.size(), 3);
    EXPECT_NE(dbvector[3].size(), 2);
}
// //number of args should be more or equal 2 - should throw an exception
// TEST_F(AddTest, Execute_LessThenTwoArgs){
//     string arguments = "101";
//     EXPECT_THROW(addHandler->execute(arguments, dbvector), std::invalid_argument);
// }
// // agrs must be form type of int - should throw an exception
// TEST_F(AddTest, Execute_InvalidArgs){
//     string arguments = "abba lion_king_1 lion_king_2";
//     EXPECT_THROW(addHandler->execute(arguments, dbvector), std::invalid_argument);
// }
// // args divided by char that differ from space - should throw an exception
// TEST_F(AddTest, Execute_InvalidDividedArgs){
//     string arguments = "1 101 102,103";
//     EXPECT_THROW(addHandler->execute(arguments, dbvector), std::invalid_argument);
// }