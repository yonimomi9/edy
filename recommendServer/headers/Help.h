#ifndef HELP_H
#define HELP_H

#include "IMenu.h"
#include "ICommandable.hpp"
#include <string>
#include <unordered_map>
#include <vector>

class Help : public ICommandable {
private:
    IMenu* menu;  // Pointer to the IMenu interface

public:
    // Constructor
    Help(IMenu* menu);

    // Override the execute function
    void execute(std::string input, std::unordered_map<unsigned long int, std::vector<unsigned long int>>& dbvector) override;

    // Accessor for menu
    IMenu* getMenu();

    // Get menu output as a string
    std::string getMenuOutput();
};

#endif // HELP_H
