#include <gtest/gtest.h>
#include "../headers/Add.h"
#include "../headers/FileDb.h"
#include "../headers/IMenu.h"
#include "../headers/ICommandable.hpp"
#include "../src/App.cpp"
#include "../headers/ConsoleMenu.h"
#include <map>

using namespace std;

TEST(AppTest, ConstructorInitializesDatabaseFile) {
    // Arrange
    ConsoleMenu menu;//see if its write
    map<int, ICommandable*> commands;
    string dbFilePath = "test.txt";

    // delete the file (if he exist) before
    remove(dbFilePath.c_str());

    // Act
    App app(&menu, commands, dbFilePath);

    // Assert
    // check if the file created
    ifstream dbFile(dbFilePath);
    EXPECT_TRUE(dbFile.is_open()) << "Database file was not created.";
    dbFile.close();

    // Ensure database vector is initially empty
   
}
TEST(AppTest, parseTheDataRight) {
    // Arrange
    ConsoleMenu menu;
    map<int, ICommandable*> commands;
    string dbFilePath = "test.txt";

    App app(&menu, commands, dbFilePath);

    //check if the data parse right
    EXPECT_TRUE(app.getDbVector().empty()) << "Database vector is not empty initially.";
}