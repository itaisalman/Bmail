#ifndef BLOOM_FILTER_H
#define BLOOM_FILTER_H
#include <unordered_set>
#include <vector>
#include <string>
#include <functional>
#include <mutex>

class BloomFilter
{
private:
    std::mutex mtx;
    int *bit_array;
    std::unordered_set<std::string> blacklist;
    std::string file_path;
    std::vector<std::pair<std::function<std::size_t(const std::string &)>, int>> hash_functions_vector;
    long int bit_array_size;
    int getIndexAfterHash(std::function<std::size_t(const std::string &)> hashFunc, int times, std::string url);
    void updatingBitArray(std::string url);
    bool firstUrlCheck(const std::string url);
    bool secondUrlCheck(const std::string url);

public:
    BloomFilter(long int size, std::vector<int> num_times_vector);
    ~BloomFilter();
    void addUrl(const std::string url);
    std::string checkUrl(const std::string url);
    int deleteUrl(const std::string url);
    int *getBitArray();
    std::string getFilePath();
    std::unordered_set<std::string> getBlacklist();
    std::vector<std::pair<std::function<std::size_t(const std::string &)>, int>> getHashFuncVector();
    long int getSize();
    void setBlacklist(std::unordered_set<std::string> list);
};
#endif