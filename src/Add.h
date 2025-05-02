#ifndef ADD_H
#define ADD_H

#include "Command.h"

class Add : public Command
{
public:
    void execute(const std::string &url, BloomFilter &bf) override;
};

#endif