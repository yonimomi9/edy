#include "../headers/ConsoleMenu.h"
#include <iostream>
#include <sstream>
#include <tuple>

using namespace std;

// Constructor to initialize the command map
ConsoleMenu::ConsoleMenu()
{ // delete, get ,patch, post, help
    commandMap["DELETE"] = 1;
    commandMap["GET"] = 2;
    commandMap["PATCH"] = 3;
    commandMap["POST"] = 4;
    commandMap["help"] = 5;

    commandArguments["DELETE"] = "[userid] [movieid1] [movieid2] ...";
    commandArguments["GET"] = "[userid] [movieid]";
    commandArguments["PATCH"] = "[userid] [movieid1] [movieid2]...";
    commandArguments["POST"] = "[userid] [movieid1] [movieid2]...";
    commandArguments["help"] = "";
}

// Implementing the nextCommand method to read user input
tuple<int, string> ConsoleMenu::nextCommand()
{
    string input;
    getline(cin, input); // Read the entire line of input

    // Extract the first word (command name) and the rest of the line (arguments)
    size_t firstSpace = input.find(' ');
    string commandName = input.substr(0, firstSpace);
    string arguments = (firstSpace == string::npos) ? "" : input.substr(firstSpace + 1);

    // Check if the command exists in the map
    if (commandMap.find(commandName) != commandMap.end())
    {
        int taskID = commandMap[commandName]; // Get the task ID
        return make_tuple(taskID, arguments); // Return the task ID and arguments as a tuple
    }

    // Return -1 as the task ID and an empty string if the command is not recognized
    return make_tuple(-1, "");
}

// Function to handle and display output in CLI
void ConsoleMenu::displayOutput(const string &output)
{
    if (!output.empty())
    {
        cout << output << endl; // Print the output to the console
    }
}

string ConsoleMenu::getMenuOutput() const{
     return "add[userid] [movieid1] [movieid2]...\nrecommend[userid] [movieid]\nhelp\n";
}

map<string, string>& ConsoleMenu::getCommandArguments() const {
    return const_cast<map<string, string>&>(commandArguments); // Return the command arguments map
}

