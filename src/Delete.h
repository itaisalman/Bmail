#ifndef DELETE_H
#define DELETE_H

#include "Command.h"

class Delete : public Command
{
public:
    std::string execute(const std::string &url, BloomFilter &bf) override;
};

#endif