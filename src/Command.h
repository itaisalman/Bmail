#ifndef COMMAND_H
#define COMMAND_H
#include "BloomFilter.h"
#include <string>
#include <iostream>

class Command
{
public:
    // Pure virtual function that Add, Check, and Delete classes will need to implement execute(),
    // which performs their actions on the bloom filter.
    virtual void execute(const std::string &url, BloomFilter &bf) = 0;

    // A function that will be responsible for printing the appropriate outputs
    // for each case and according to each function.
    virtual void output(const std::string &out);
};

#endif
