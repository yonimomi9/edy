#include <gtest/gtest.h>
#include <unordered_map>
#include <vector>
#include <string>
#include "../headers/ICommandable.hpp"
#include "../headers/Help.h"

using namespace std;

class helpTest : public ::testing::Test {
protected:
    unique_ptr<Help> helpHandler;
    unordered_map<unsigned long int, vector<unsigned long int>> dbvector;

    void SetUp() override {
        helpHandler = make_unique<Help>(nullptr); // Initialize the Help handler
    }

    void TearDown() override {
        // unique_ptr automatically cleans up
    }
};

// Test if the menu string is correct
TEST_F(helpTest, Execute_ProcessesArgumentsCorrectly_Sanity) {
    string arguments = "";

    // Execute the Help command
    helpHandler->execute(arguments, dbvector);

    // Verify the output
    EXPECT_EQ(helpHandler->getMenuOutput(), "add[userid] [movieid1] [movieid2]...\nrecommend[userid] [movieid]\nhelp\n");
}

// Test if the menu string does not match an incorrect value
TEST_F(helpTest, Execute_ProcessesArgumentsCorrectly_Negative) {
    string arguments = "";

    // Execute the Help command
    helpHandler->execute(arguments, dbvector);

    // Verify the output is not equal to an incorrect value
    EXPECT_NE(helpHandler->getMenuOutput(), "hii");
}

// Additional test for non-empty arguments (to validate robustness)
TEST_F(helpTest, Execute_WithNonEmptyArguments) {
    string arguments = "some invalid arguments";

    // Execute the Help command with invalid arguments
    helpHandler->execute(arguments, dbvector);

    // Verify that the output remains consistent regardless of arguments
    EXPECT_EQ(helpHandler->getMenuOutput(), "add[userid] [movieid1] [movieid2]...\nrecommend[userid] [movieid]\nhelp\n");
}
