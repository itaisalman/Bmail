#ifndef BLOOM_FILTER_H
#define BLOOM_FILTER_H
#include <unordered_set>
#include <vector>
#include <string>

class BloomFilter
{
private:
    int *bitArray;
    std::unordered_set<std::string> blacklist;
    int bitArraySize;
    int numOfHashFunc;
    int numTimes;

public:
    BloomFilter(int size, int numOfHashFunc, int numTimes);
    BloomFilter(int size, int numOfHashFunc);
    void add_url(const std::string &url);
    bool check_url(const std::string &url);
    // void init_filter(int size, int numOfHashFunctions);
    std::unordered_set<std::string> getBlacklist();
    int *getBitArray();
    int getSize();
    int getNumOfHashFunc();
    int getNumTimes();
};
#endif