#include "Add.h"
#include "BloomFilter.h"
#include "Storage.h"
#include <iostream>

// The Add class execution function – responsible for adding a URL to the blacklist
void Add::execute(const std::string &url, BloomFilter &bf)
{
    if (bf.getBlacklist().find(url) == bf.getBlacklist().end())
    {
        const std::string file_name = "/app/data/Blacklist.txt";
        bf.addUrl(url);
        saveToFile(url, file_name);
    }
}
