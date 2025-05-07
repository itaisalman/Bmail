#include "Delete.h"
#include "BloomFilter.h"
#include "Storage.h"
#include <iostream>

// Delete the given URL from the BloomFilter's blacklist.
std::string Delete::execute(const std::string &url, BloomFilter &bf)
{
    int delete_output = bf.deleteUrl(url);
    const std::string file_name = bf.getFilePath();
    if (delete_output)
    {
        deleteFromFile(url, file_name);
        return "204 No Content";
    }
    return "404 Not Found";
}