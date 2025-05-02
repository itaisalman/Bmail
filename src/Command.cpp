#include "Command.h"
#include <iostream>

// Default implementation for the output function
void Command::output(const std::string &out)
{
    std::cout << out;
}
