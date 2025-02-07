#include <iostream>
#include "../headers/ICommandable.hpp"
#include <vector>
#include <unordered_map>
#include "../headers/IMenu.h"
#include "../headers/Help.h"
#include "../headers/ConsoleMenu.h"
#include <sstream>

using namespace std;

// Constructor
Help::Help(IMenu* menu) : menu(menu) {}

/**
 * Execute the help command.
 * Retrieve commands and arguments from the menu and display them, ensuring "help" is displayed last.
 */
void Help::execute(string input, unordered_map<unsigned long int, vector<unsigned long int>>& dbvector) {
    try {
        // Check if the input contains arguments
        if (!input.empty()) {
            throw invalid_argument("Invalid command for Help.");
        }

        const auto& commandArguments = menu->getCommandArguments();
        ostringstream helpMessage;

        // Start with the "200 Ok" status and a double newline
        helpMessage << "200 Ok\n\n";

        // Collect all the outputs into a single string to avoid buffering issues
        for (const auto& [command, arguments] : commandArguments) {
            if (command == "help") continue; // Skip "help"
            if (arguments.empty()) {
                helpMessage << command << "\n";
            } else {
                helpMessage << command << ", arguments: " << arguments << "\n";
            }
        }

        // Display "help" last
        auto it = commandArguments.find("help");
        if (it != commandArguments.end()) {
            helpMessage << it->first << "\n";
        }

        // Send the entire help output at once
        menu->displayOutput(helpMessage.str());

    } catch (invalid_argument) {
        // Handle invalid input by sending "400 Bad Request"
        menu->displayOutput("400 Bad Request");
    }
}

/**
 * Get the menu associated with this command.
 */
IMenu* Help::getMenu() {
    return menu;
}

/**
 * Generate and return the help message as a string.
 * Useful for testing or output purposes.
 */
string Help::getMenuOutput() {
    if (!menu) {
        return "Menu not available.";
    }

    const auto& commandArguments = menu->getCommandArguments();
    ostringstream helpMessage;

    for (const auto& [command, arguments] : commandArguments) {
        helpMessage << command;
        if (!arguments.empty()) {
            helpMessage << ", arguments: " << arguments;
        }
        helpMessage << "\n";
    }

    return helpMessage.str();
}
