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
    long int bitArraySize;
    long int numOfHashFunc;
    long int numTimes;

public:
    BloomFilter(long int size, long int numOfHashFunc, long int numTimes);
    void add_url(const std::string &url);
    void check_url(const std::string &url);
    std::unordered_set<std::string> getBlacklist();
    int *getBitArray();
    long int getSize();
    long int getNumOfHashFunc();
    long int getNumTimes();
};
#endif