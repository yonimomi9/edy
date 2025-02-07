#ifndef CONSOLEMENU_H
#define CONSOLEMENU_H

#include "IMenu.h"
#include <string>
#include <map>
#include <tuple> // For structured command input

using namespace std;

class ConsoleMenu : public IMenu
{
private:
    map<string, string> commandArguments;
    map<string, int> commandMap; // Maps command names to IDs

public:
    // Constructor to initialize the command map
    ConsoleMenu();

    // Implementing the IMenu interface
    tuple<int, string> nextCommand() override; // Returns command ID and arguments
    void displayOutput(const string &output) override;
    string getMenuOutput() const override;
    map<string, string>& getCommandArguments() const override;
};


#endif // CONSOLEMENU_H
