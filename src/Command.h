#include "src/BloomFilter.h"
#include <string>
class Command
{
public:
    // Pure virtual function that any class (like add, check, delete)
    // will need to implement execute(), which performs its action on the bloom filter.
    virtual void execute(const std::string &url, BloomFilter &bf);
    // Virtual destructor for that the destruction of a derived object
    // will be performed correctly even when deleting via a pointer to the base
    virtual ~Command() {}
};