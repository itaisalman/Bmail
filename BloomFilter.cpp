#include <unordered_set>
#include <vector>
#include <string>
#include <functional>
#include "BloomFilter.h"


// constructor
BloomFilter::BloomFilter (long int size, long int num_times_h1, long int num_times_h2)
{
    this->bit_array = new int[size]();
    this->bit_array_size = size;
    this->blacklist = std::unordered_set<std::string>(); 
    auto hash1 = std::hash<std::string>();
    auto hash2 = std::hash<std::string>();
    this->hash_functions_vector = std::vector<std::pair<std::function<size_t(const std::string&)>, int>>();
    this->hash_functions_vector.push_back(make_pair(hash1, num_times_h1));
    this->hash_functions_vector.push_back(make_pair(hash2, num_times_h2));
}

// destructor
BloomFilter::~BloomFilter() 
{
    delete[] this->bit_array;
}

// Returns a pointer to the internal bit array used by the Bloom filter
int* BloomFilter::getBitArray() 
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
