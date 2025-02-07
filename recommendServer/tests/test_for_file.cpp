#include <gtest/gtest.h>
#include "../headers/FileDb.h"
#include <fstream>
#include <unordered_map>
#include <vector>

using namespace std;

class FileTest : public ::testing::Test {
protected:
    const string testFileName = "test_database_file.txt";
    unordered_map<unsigned long int, vector<unsigned long int>> db;
    // אולי לא צריך
    void SetUp() override {
        // Ensure a clean start by removing the file if it exists
        remove(testFileName.c_str());// convert string from cpp format into c format
    }

    void TearDown() override {
        // Clean up after each test
        remove(testFileName.c_str());// convert string from cpp format into c format
    }
};
// tests for initializeDatabaseFile
TEST_F(FileTest, InitializeDatabaseFile_CreatesFileIfNotExists_Sanity) {
    FileDb file(testFileName, db); // Pass db directly, not &db

    // Act
    file.initializeDatabaseFile();
    fstream fileStream(testFileName);
    
    EXPECT_TRUE(fileStream.is_open());
    fileStream.close();
}
TEST_F(FileTest, InitializeDatabaseFile_CreatesFileIfNotExists_Negative) {
    FileDb file(testFileName, db); // Pass db directly, not &db

    fstream fileStream1(testFileName);
    // Act
    file.initializeDatabaseFile();
    fstream fileStream(testFileName);
    
    EXPECT_TRUE(fileStream.is_open());
    fileStream1.close();
}

TEST_F(FileTest, Parse_PopulatesInMemoryDataStructure_Sanity) {
    // Arrange: Create a file with some data
    std::ofstream outFile(testFileName);
    outFile << "1|101?102?103|\n2|102?104|\n";
    outFile.close(); // Ensure data is flushed and file is closed before parsing

    // Debug: Ensure the file contents match expectations
    std::ifstream debugFile(testFileName);
    std::string line;
    std::cout << "File contents:" << std::endl;
    while (std::getline(debugFile, line)) {
        std::cout << line << std::endl;
    }
    debugFile.close();

    // Act: Parse the file
    FileDb file(testFileName, db);
    auto parsedData = file.parse();

    // Debug: Log parsed data
    std::cout << "Parsed data size: " << parsedData.size() << std::endl;
    for (const auto& entry : parsedData) {
        std::cout << "Key: " << entry.first << " Values: ";
        for (auto value : entry.second) {
            std::cout << value << " ";
        }
        std::cout << std::endl;
    }

    // Assert: Validate parsed data
    ASSERT_EQ(parsedData.size(), 2) << "Parsed data size is incorrect.";
    EXPECT_EQ(parsedData[1], (std::vector<unsigned long>{101, 102, 103})) << "Key 1 values are incorrect.";
    EXPECT_EQ(parsedData[2], (std::vector<unsigned long>{102, 104})) << "Key 2 values are incorrect.";

    // Cleanup: Remove the test file
    std::remove(testFileName.c_str());
}

TEST_F(FileTest, Parse_PopulatesInMemoryDataStructure_Negative) {
    // Create a file with some data
    ofstream outFile(testFileName);
    outFile << "1|101?102?103|\n2|102?104|\n";
    

    FileDb file(testFileName, db);

    // Act
    auto parsedData = file.parse();
    
    EXPECT_NE(parsedData.size(), 3);
    EXPECT_NE(parsedData[1], (vector<unsigned long int>{101, 209, 103}));
    EXPECT_NE(parsedData[2], (vector<unsigned long int>{102}));
    // closing the file 
    outFile.close();
}

TEST_F(FileTest, AddToDatabase_AddsDataAndUpdatesFile) {
    FileDb file(testFileName, db);

    // Initialize the file
    file.initializeDatabaseFile();

    // Act
    file.addToDatabase(1, {10, 20, 30}, false); // new user
    file.addToDatabase(1, {40}, true); // update exist user

    // // Assert in-memory data structure
    // EXPECT_EQ(db[1], (vector<unsigned long int>{10, 20, 30, 40}));

    // Expect file content
    ifstream inFile(testFileName);
    EXPECT_TRUE(inFile.is_open());
    string fileContent;
    getline(inFile, fileContent);
    inFile.close();
    EXPECT_EQ(fileContent, "1|10?20?30?40|");
}
