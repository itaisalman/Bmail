#include "Check.h"
#include "BloomFilter.h"
#include <iostream>
#include <sstream>

// The Check class execution function – responsible for checking if URL is in the blacklist
void Check::execute(const std::string &url, BloomFilter &bf)
{
    bf.checkUrl(url);
}