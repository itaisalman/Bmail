#ifndef BLOOM_FILTER_H
#define BLOOM_FILTER_H
#include <unordered_set>
#include <vector>
#include <string>

class BloomFilter
{
private:
    int *bit_array;
    std::unordered_set<std::string> blacklist;
    long int bit_array_size;
    long int num_of_hash_func;
    long int num_times;

public:
    BloomFilter(long int size, long int num_of_hash_func, long int num_times);
    void addUrl(const std::string url);
    void checkUrl(const std::string url);
    std::unordered_set<std::string> getBlacklist();
    int *getBitArray();
    long int getSize();
    long int getNumOfHashFunc();
    long int getNumTimes();
};
#endif