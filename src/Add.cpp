#include "Add.h"
#include "BloomFilter.h"
#include "Storage.h"
#include <iostream>

// The Add class execution function – responsible for adding a URL to the blacklist
std::string Add::execute(const std::string &url, BloomFilter &bf)
{
    if (bf.getBlacklist().find(url) == bf.getBlacklist().end())
    {
        bf.addUrl(url);
        saveToFile(url, bf.getFilePath());
    }
    return "201 Created\n";
}
