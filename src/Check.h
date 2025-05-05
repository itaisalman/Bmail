#ifndef CHECK_H
#define CHECK_H

#include "Command.h"

class Check : public Command
{
public:
    std::string execute(const std::string &url, BloomFilter &bf) override;
};

#endif