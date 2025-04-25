#include <gtest/gtest.h>
#include "BloomFilter.h"

using namespace std;

// Checks if the setBlacklist fucntion inserts the URL list correctly to the blacklist field.
TEST(SettersTests, UpdateBlacklist)
{
    std::unordered_set<std::string> new_list = {"www.example.com", "www.example7.com"};
    vector<int> times_vector = {1, 2};
    BloomFilter bf(10, times_vector);
    bf.setBlacklist(new_list);
    for (auto url : new_list)
    {
        EXPECT_EQ(isBlacklisted(bf.getBlacklist(), url));
    }
}

int main(int argc, char **argv)
{
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}