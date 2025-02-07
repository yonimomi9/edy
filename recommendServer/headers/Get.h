# ifndef GET_H
# define GET_H

#include <unordered_map>
#include <vector>
#include <unordered_set>
#include <string>
#include "../headers/ICommandable.hpp"
#include "../headers/Recommend.h"
#include "../headers/IMenu.h"

using namespace std;

class Get : public Recommend {
private:
    IMenu* menu;


public:
    // constructor
    Get(IMenu* menu);
    
    void send(string message);
    string logicGet(string input,
        unordered_map<unsigned long int, vector<unsigned long int>>& dbvector);
    void execute(
        string input,
        unordered_map<unsigned long int, vector<unsigned long int>>& dbvector) override;

};
# endif // GET_H