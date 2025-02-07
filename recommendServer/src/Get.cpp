#include "../headers/Get.h"
#include "../headers/ICommandable.hpp"  // Interface for command-based operations
#include "../headers/IMenu.h" // Menu interface
#include <iostream>           // For input/output operations
#include <sstream>            // For string stream operations
#include <string>             // For string manipulation

Get::Get(IMenu* menu) : Recommend(menu), menu(menu) {};
/**
 * calculate the logic for the get commend
 * @param input : string of input
 * @param dbvector : local map of the data
 * @return : string of the right message
 */
string Get::logicGet(string input, unordered_map<unsigned long int, vector<unsigned long int>>& dbvector) {
    // set the prefix to add for the sending message
    string prefix = "200 Ok";
    // get the string result from recommend
    string recResult = Recommend::calculateAlgo(input,dbvector);
    // check which case of message it should send 
    if(recResult =="invalid argument"){
        return "400 Bad Request";
    }else if(recResult == "logical error"){
        return "404 Not Found";
    }else{
        return prefix + "\n" + "\n" + recResult;
    }
}
/**
 * send the message for the menu
 * @param message : string of the message
 * @return : none
 */
void Get::send(string message){
    if(menu){
        menu->displayOutput(message);
    }
}
/**
 * execute the get command
 * @param input : string of the input to the command
 * @param dbvector : local map of the data
 * @return none.
 */
void Get::execute(string input, unordered_map<unsigned long int, vector<unsigned long int>>& dbvector){
    string results = logicGet(input,dbvector);
    send(results);
}