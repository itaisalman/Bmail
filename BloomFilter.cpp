#include <unordered_set>
#include <vector>
#include <string>
#include <iostream>
#include <functional>
#include "BloomFilter.h"

// constructor
BloomFilter::BloomFilter(long int size, long int num_times_h1, long int num_times_h2)
{
    this->bit_array = new int[size]();
    this->bit_array_size = size;
    this->blacklist = std::unordered_set<std::string>();
    auto hash1 = std::hash<std::string>();
    auto hash2 = std::hash<std::string>();
    this->hash_functions_vector = std::vector<std::pair<std::function<size_t(const std::string &)>, int>>();
    this->hash_functions_vector.push_back(make_pair(hash1, num_times_h1));
    this->hash_functions_vector.push_back(make_pair(hash2, num_times_h2));
}

// destructor
BloomFilter::~BloomFilter()
{
    delete[] this->bit_array;
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

// Returns the vector of hash functions and their running count
// Each pair consists of a hash function and an integer used for running count
std::vector<std::pair<std::function<size_t(const std::string &)>, int>> BloomFilter::getHashFuncVector()
{
    return this->hash_functions_vector;
}

// Executes the hash function on the given URL according to the number of times provided.
int getIndexAfterHash(std::function<std::size_t(const std::string &)> hashFunc, int times, std::string url)
{
    int result = hashFunc(url);
    for (int i = 0; i < times - 1; i++)
    {
        result = hashFunc(std::to_string(result));
    }
    return result;
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
void BloomFilter::checkUrl(const std::string url)
{
    // First-checking.
    bool first_check_result = firstUrlCheck(url);
    std::cout << first_check_result << std::endl;
    if (first_check_result)
    {
        // Double-checking.
        bool second_check_result = secondUrlCheck(url);
        std::cout << second_check_result << std::endl;
    }
}