#include <gtest/gtest.h>
#include "BloomFilter.h"

using namespace std;

// Returning URL example.
std::string exampleUrl()
{
    return "www.example.com";
}

// Construct expected array.
void setExpectedBit(int *array, vector<int> indices)
{
    for (auto index : indices)
    {
        array[index] = 1;
    }
}

// Check if a given url is in the blacklist.
bool isBlacklisted(unordered_set<string> blacklist, string url)
{
    if (blacklist.find(url) != blacklist.end())
    {
        return true;
    }
    return false;
}

// Gets the corresponding argument in order to give back the correct index.
int hashIndex(std::function<std::size_t(const std::string &)> hashFunc, int times, int array_size, std::string url)
{
    int result = hashFunc(url);
    times--;
    for (int i = 0; i < times; i++)
    {
        result = hashFunc(std::to_string(result));
    }
    return result % array_size;
}

// Check if a file added as expected.
TEST(AdditionTest, AddURLSuccessfully)
{
    std::vector<int> num_times_vector = {1, 1};
    BloomFilter bf(128, num_times_vector);
    string url = exampleUrl();
    bf.addUrl(url);
    unordered_set<string> blacklist = bf.getBlacklist();
    EXPECT_TRUE(isBlacklisted(blacklist, url));
}

// Check if the BloomFilter array is as expected.
bool checkArray(int *correct_array, int *checked_array, int size)
{
    for (int i = 0; i < size; i++)
    {
        if (correct_array[i] != checked_array[i])
        {
            return false;
        }
    }
    return true;
}

// Check if handles correctly with one Loop over the hash functions.
TEST(AdditionTest, UpdateArray1)
{
    std::vector<int> num_times_vector = {1, 1};
    BloomFilter bf(128, num_times_vector);
    string url = exampleUrl();
    bf.addUrl(url);
    std::vector<std::pair<std::function<std::size_t(const std::string &)>, int>> hash_structure = bf.getHashFuncVector();
    int first_index = hashIndex(hash_structure[0].first, hash_structure[0].second, 128, url);
    int second_index = hashIndex(hash_structure[1].first, hash_structure[1].second, 128, url);
    int correct_array[128] = {0};
    std::vector<int> indices = {first_index, second_index};
    setExpectedBit(correct_array, indices);
    int *checked_array = bf.getBitArray();
    EXPECT_TRUE(checkArray(correct_array, checked_array, 128));
}

// Check if handles correctly with multiple Loops over the hash functions.
TEST(AdditionTest, UpdateArray2)
{
    vector<int> num_times_vector = {2, 3, 20};
    BloomFilter bf(8, num_times_vector);
    string url = exampleUrl();
    bf.addUrl(url);
    std::vector<std::pair<std::function<std::size_t(const std::string &)>, int>> hash_structure = bf.getHashFuncVector();
    int first_index = hashIndex(hash_structure[0].first, hash_structure[0].second, 8, url);
    int second_index = hashIndex(hash_structure[1].first, hash_structure[1].second, 8, url);
    int third_index = hashIndex(hash_structure[2].first, hash_structure[2].second, 8, url);
    int correct_array[8] = {0};
    std::vector<int> indices = {first_index, second_index, third_index};
    setExpectedBit(correct_array, indices);
    int *checked_array = bf.getBitArray();
    EXPECT_TRUE(checkArray(correct_array, checked_array, 8));
}

// Check if handle big arrays correctly.
TEST(AdditionTest, ArraySize)
{
    std::vector<int> num_times_vector = {1, 1};
    BloomFilter bf(8000, num_times_vector);
    string url = exampleUrl();
    bf.addUrl(url);
    std::vector<std::pair<std::function<std::size_t(const std::string &)>, int>> hash_structure = bf.getHashFuncVector();
    int first_index = hashIndex(hash_structure[0].first, hash_structure[0].second, 8000, url);
    int second_index = hashIndex(hash_structure[1].first, hash_structure[1].second, 8000, url);
    int correct_array[8000] = {0};
    std::vector<int> indices = {first_index, second_index};
    setExpectedBit(correct_array, indices);
    int *checked_array = bf.getBitArray();
    EXPECT_TRUE(checkArray(correct_array, checked_array, 8000));
}

int main(int argc, char **argv)
{
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}
