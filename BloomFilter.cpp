#include <unordered_set>
#include <vector>
#include <string>
#include <functional>
#include "BloomFilter.h"

// constructor
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
