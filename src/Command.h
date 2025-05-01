#include "src/BloomFilter.h"
#include <string>
class Command
{
public:
    // Pure virtual function that Add, Check, and Delete classes will need to implement execute(),
    // which performs their actions on the bloom filter.
    virtual void execute(const std::string &url, BloomFilter &bf) = 0;

    // Virtual destructor for that the delete of a derived object
    // will be performed correctly even when deleting via a pointer to the base
    virtual ~Command() {}
};