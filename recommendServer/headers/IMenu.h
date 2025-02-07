#ifndef IMENU_H
#define IMENU_H

#include <string>
#include <map>
using namespace std;

class IMenu
{
public:
    virtual tuple<int, string> nextCommand() = 0; // Returns the selected command ID
    virtual void displayOutput(const string &output) = 0;
    virtual ~IMenu() = default;
    virtual string getMenuOutput() const = 0;
    virtual map<string, string>& getCommandArguments() const = 0;
};

#endif // IMENU_H
