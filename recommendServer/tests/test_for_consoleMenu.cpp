#include <gtest/gtest.h>
#include "../headers/ConsoleMenu.h"
// nextCommand
TEST(ConsoleMenuTest, NextCommandReturnsCorrectTuple) {
    // Arrange
    ConsoleMenu menu;
    std::istringstream input("add 101 102 103"); // input to check
    std::cin.rdbuf(input.rdbuf()); // redirect the input #rdbuf the function for dose that

    // Act
    auto command = menu.nextCommand();

    // Assert
    ASSERT_EQ(std::get<0>(command), 1) << "Command ID is incorrect.";
    ASSERT_EQ(std::get<1>(command), "101 102 103") << "Command string is incorrect.";
}
// displayOutput
TEST(ConsoleMenuTest, DisplayOutputPrintsCorrectString) {
    // Arrange
    ConsoleMenu menu;
    std::ostringstream output;
    std::cout.rdbuf(output.rdbuf()); //  redirect the input #rdbuf the function for dose that

    std::string expectedOutput = "Test output\n";

    // Act
    menu.displayOutput("Test output");

    // Assert
    ASSERT_EQ(output.str(), expectedOutput) << "Output string is incorrect.";
}

