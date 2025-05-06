#include "Delete.h"
#include "BloomFilter.h"
#include "Storage.h"
#include <iostream>

// Delete the given URL from the BloomFilter's blacklist.
std::string Delete::execute(const std::string &url, BloomFilter &bf)
{
    std::string delete_output = bf.deleteUrl(url);
    const std::string file_name = bf.getFilePath();
    deleteFromFile(url, file_name);
    return delete_output;
}