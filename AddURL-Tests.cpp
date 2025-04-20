#include <gtest/gtest.h>
#include "BloomFilter.h"

using namespace std;

// Check if a given url is in the blacklist
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
    string url = "www.example.com";
    bf.addUrl(url);
    unordered_set<string> blacklist = bf.getBlacklist();
    EXPECT_TRUE(isBlacklisted(blacklist, url));
}

// Check if the BloomFilter array is as expected
bool checkArray(int *correct_array, int *checked_array, int size)
{
    for (int i = 0; i < size; i++)
    {
        if (correctArray[i] != checkedArray[i])
        {
            return false;
        }
    }
    return true;
}

// Check if handle one hash function correctly
TEST(AdditionTest, UpdateArray1)
{
    BloomFilter bf(128, 1, 1);
    string url = "“www.example.com";
    bf.addUrl(url);
    hash<string> h;
    int index = h(url) % 128;
    int correct_array[128] = {0};
    correct_array[index] = 1;
    int *checked_array = bf.getBitArray();
    EXPECT_TRUE(checkArray(correct_array, checked_array, 128));
}

// Check if handle two hash function correctly
TEST(AdditionTest, UpdateArray2)
{
    BloomFilter bf(8, 2, 1);
    string url = "“www.example.com";
    bf.addUrl(url);
    hash<string> h1;
    hash<int> h2;
    int first_index = h1(url) % 8;
    int second_index = h2(h1(url)) % 8;
    int correct_array[8] = {0};
    correct_array[first_index] = 1;
    correct_array[second_index] = 1;
    int *checked_array = bf.getBitArray();
    EXPECT_TRUE(checkArray(correct_array, checked_array, 8));
}

int main(int argc, char **argv)
{
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}
