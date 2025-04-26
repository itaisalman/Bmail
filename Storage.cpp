#include "Storage.h"

// Loads lines from a file into an unordered set of strings
std::unordered_set<std::string> loadFromFile(const std::string &filename)
{
    std::unordered_set<std::string> loaded_url_set;
    // Defines an object to read a file and attempts to open it
    std::ifstream in(filename);
    std::string url;
    // Read the file line by line
    while (std::getline(in, url))
    {
        loaded_url_set.insert(url);
    }
    return loaded_url_set;
}