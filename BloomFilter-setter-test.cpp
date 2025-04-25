#include <gtest/gtest.h>
#include "BloomFilter.h"

using namespace std;

// Check if a given url is in the blacklist.
bool isBlacklisted(unordered_set<string> blacklist, string url)
{
    if (blacklist.find(url) != blacklist.end())
    {
        return true;
    }
    return false;
}

// Checks if the setBlacklist fucntion inserts the URL list correctly to the blacklist field.
TEST(SettersTests, UpdateBlacklist)
{
    std::unordered_set<std::string> new_list = {"www.example.com", "www.example7.com"};
    vector<int> times_vector = {1, 2};
    BloomFilter bf(10, times_vector);
    bf.setBlacklist(new_list);
    for (auto url : new_list)
    {
        EXPECT_TRUE(isBlacklisted(bf.getBlacklist(), url));
    }
}

int main(int argc, char **argv)
{
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}