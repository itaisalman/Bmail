#include <gtest/gtest.h>
#include "BloomFilter.h"

using namespace std;

// Returning URL example.
std::string exampleUrl()
{
    return "www.example.com";
}

// Construct expected array.
void setExpectedBits(int *array, int first_index, int second_index)
{
    array[first_index] = 1;
    array[second_index] = 1;
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

// Check if a file added as expected.
TEST(AdditionTest, AddURLSuccessfully)
{
    BloomFilter bf(128, 1, 1);
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

// Check if handle with one Loop over the hash functions correctly.
TEST(AdditionTest, UpdateArray1)
{
    BloomFilter bf(128, 1, 1);
    string url = exampleUrl();
    bf.addUrl(url);
    std::vector<std::pair<std::function<std::size_t(const std::string &)>, int>> hash_structure = bf.getHashFuncVector();
    auto h1 = hash_structure[0].first;
    auto h2 = hash_structure[1].first;
    int first_index = h1(url) % 128;
    int second_index = h2(url) % 128;
    int correct_array[128] = {0};
    setExpectedBits(correct_array, first_index, second_index);
    int *checked_array = bf.getBitArray();
    EXPECT_TRUE(checkArray(correct_array, checked_array, 128));
}

// Check if handle with multiple Loops over the hash functions correctly.
TEST(AdditionTest, UpdateArray2)
{
    BloomFilter bf(8, 2, 3);
    string url = exampleUrl();
    bf.addUrl(url);
    std::vector<std::pair<std::function<std::size_t(const std::string &)>, int>> hash_structure = bf.getHashFuncVector();
    auto h1 = hash_structure[0].first;
    auto h2 = hash_structure[1].first;
    int first_index = h1(std::to_string(h1(url))) % 8;
    int second_index = h2(std::to_string(h2(std::to_string(h2(url))))) % 8;
    int correct_array[8] = {0};
    setExpectedBits(correct_array, first_index, second_index);
    int *checked_array = bf.getBitArray();
    EXPECT_TRUE(checkArray(correct_array, checked_array, 8));
}

// Check if handle big arrays correctly.
TEST(AdditionTest, ArraySize)
{
    BloomFilter bf(8000, 1, 1);
    string url = exampleUrl();
    bf.addUrl(url);
    std::vector<std::pair<std::function<std::size_t(const std::string &)>, int>> hash_structure = bf.getHashFuncVector();
    auto h1 = hash_structure[0].first;
    auto h2 = hash_structure[1].first;
    int first_index = h1(url) % 8000;
    int second_index = h2(url) % 8000;
    int correct_array[8000] = {0};
    setExpectedBits(correct_array, first_index, second_index);
    int *checked_array = bf.getBitArray();
    EXPECT_TRUE(checkArray(correct_array, checked_array, 8000));
}

int main(int argc, char **argv)
{
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}
