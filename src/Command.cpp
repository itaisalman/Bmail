#include "Command.h"
#include <iostream>
#include <string>

// Default implementation for output function
void Command::output(const std::string &out)
{
    std::cout << out;
}
