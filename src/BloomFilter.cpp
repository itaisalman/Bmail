#include <unordered_set>
#include <vector>
#include <string>
#include <functional>
#include <iostream>
#include "BloomFilter.h"

// Constructor
BloomFilter::BloomFilter(long int size, std::vector<int> num_times_vector)
{
    this->bit_array = new int[size]();
    this->bit_array_size = size;
    this->blacklist = std::unordered_set<std::string>();
    this->hash_functions_vector = std::vector<std::pair<std::function<size_t(const std::string &)>, int>>();
    for (int times : num_times_vector)
    {
        this->hash_functions_vector.push_back(make_pair(std::hash<std::string>(), times));
    }
    this->file_path = "/app/data/Blacklist.txt";
}

// Destructor
BloomFilter::~BloomFilter()
{
    delete[] this->bit_array;
}
// Returns the file path
std::string BloomFilter::getFilePath()
{
    return this->file_path;
}
// Returns a pointer to the internal bit array used by the Bloom filter
int *BloomFilter::getBitArray()
{
    return this->bit_array;
}

// Returns the size of the bit array
long int BloomFilter::getSize()
{
    return this->bit_array_size;
}

// Returns the current URL blacklist
std::unordered_set<std::string> BloomFilter::getBlacklist()
{
    return this->blacklist;
}

// Sets the blacklist from the provided unordered set of strings
void BloomFilter::setBlacklist(std::unordered_set<std::string> list)
{
    this->blacklist.clear();
    for (const auto &item : list)
    {
        this->blacklist.insert(item);
    }
}

// Returns the vector of hash functions and their running count
// Each pair consists of a hash function and an integer used for running count
std::vector<std::pair<std::function<size_t(const std::string &)>, int>> BloomFilter::getHashFuncVector()
{
    return this->hash_functions_vector;
}

// Computes the index in the bit array after applying the given hash function multiple times
int BloomFilter::getIndexAfterHash(std::function<std::size_t(const std::string &)> hashFunc, int times, std::string url)
{
    size_t result = hashFunc(url);
    times--;
    for (int i = 0; i < times; i++)
    {
        result = hashFunc(std::to_string(result));
    }
    return result % this->bit_array_size;
}

// Updates the bit array by setting bits corresponding to the hash results of the URL
void BloomFilter::updatingBitArray(std::string url)
{
    for (int i = 0; i < hash_functions_vector.size(); i++)
    {
        int index = BloomFilter::getIndexAfterHash(hash_functions_vector[i].first, hash_functions_vector[i].second, url);
        this->bit_array[index] = 1;
    }
}

// Updates BloomFilter's bit array and adding the URL to the its blacklist
void BloomFilter::addUrl(std::string url)
{
    BloomFilter::updatingBitArray(url);
    this->blacklist.insert(url);
}

// Adds each index obtained by running the hash on the given URL the required number of times to the vector.
// Then, it checks the corresponding cells in the bit array according to the returned indices. If it finds at least one that is 0, return false.
// Otherwise, True.
bool BloomFilter::firstUrlCheck(const std::string url)
{
    std::vector<int> indices;
    // Iterate over each pair of hash function and times to run it.
    for (auto pair : hash_functions_vector)
    {
        indices.push_back(getIndexAfterHash(pair.first, pair.second, url));
    }

    // Iterate over the indices that needs to be checked.
    for (auto index : indices)
    {
        if (this->bit_array[index] == 0)
        {
            return false;
        }
    }
    return true;
}

// Double-checking,In case it passed the first checking
// Check if given url is in the blacklist
bool BloomFilter::secondUrlCheck(const std::string url)
{
    if (this->blacklist.find(url) != blacklist.end())
    {
        return true;
    }
    return false;
}

// Checks if given URL exists in the blacklist.
// Prints results accordingly
std::string BloomFilter::checkUrl(const std::string url)
{
    // First-checking.
    if (firstUrlCheck(url))
    {
        // Double-checking.
        if (secondUrlCheck(url))
        {
            return "true true\n";
        }
        else
        {
            return "true false\n";
        }
    }
    else
    {
        return "false\n";
    }
}

std::string BloomFilter::deleteUrl(const std::string url)
{
    if (this->blacklist.find(url) != this->blacklist.end())
    {
        this->blacklist.erase(url);
        return "204 No Content\n";
    }
    return "404 Not Found\n";
}