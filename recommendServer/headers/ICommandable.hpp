#ifndef ICOMMANDABLE_HPP
#define ICOMMANDABLE_HPP

/**
 * This class is an interface which will be inherited by commands classes.
 * It only contains the function execute which will evoke every command.
 */

using namespace std;
#include <string>
#include <unordered_map>
#include <vector>


class ICommandable{
    //private:
    //    IMenu* menu;
    public:
        // evoke the suitable command
        virtual void execute(string input, unordered_map<unsigned long int, vector<unsigned long int>>& dbvector)=0;
        // Accessor for menu
    //    virtual IMenu* getMenu() = 0;
};
#endif