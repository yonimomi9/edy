#ifndef SOCKETMENU_H
#define SOCKETMENU_H

#include "IMenu.h"
#include <string>
#include <map>
#include <memory>
#include <sys/socket.h>
#include <netinet/in.h>
#include <unistd.h>

using namespace std;

class SocketMenu : public IMenu {
private:
    int clientSocket;
    string outputBuffer;
    map<string, string> commandArguments;

public:
    // Constructor and Destructor
    explicit SocketMenu(int clientSocket);
    ~SocketMenu() override;

    // Overrides from IMenu
    tuple<int, string> nextCommand() override;
    void displayOutput(const string &output) override;
    string getMenuOutput() const override;
    map<string, string> &getCommandArguments() const override;

private:
    string receiveMessage();
    void sendMessage(const string &message);
};

#endif // SOCKETMENU_H
