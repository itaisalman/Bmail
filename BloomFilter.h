#ifndef BLOOM_FILTER_H
#define BLOOM_FILTER_H
#include <unordered_set>
#include <vector>
#include <string>
#include <functional>

class BloomFilter
{
private:
    int *bit_array;
    std::unordered_set<std::string> blacklist;
    std::vector<std::pair<std::function<std::size_t(const std::string &)>, int>> hash_functions_vector;
    long int bit_array_size;

public:
    BloomFilter(long int size, long int num_times_h1, long int num_times_h2);
    ~BloomFilter();
    void addUrl(const std::string url);
    void checkUrl(const std::string url);
    int *getBitArray();
    std::unordered_set<std::string> getBlacklist();
    std::vector<std::pair<std::function<std::size_t(const std::string &)>, int>> getHashFuncVector();
    long int getSize();
};
#endif