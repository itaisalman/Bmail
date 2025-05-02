#include "Check.h"
#include "BloomFilter.h"

// The Check class execution function – responsible for checking if URL is in the blacklist
void Check::execute(const std::string &url, BloomFilter &bf)
{
    std::string outputCheck = bf.checkUrl(url);
    output(outputCheck);
}
