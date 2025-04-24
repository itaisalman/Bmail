#include <gtest/gtest.h>
#include "BloomFilter.h"

using namespace std;

// Creating an instance and check if succeeded by comparing expected values to the fields.
TEST(BloomFilterTests, getters)
{
    vector<int> times_vector = {2, 1, 3};
    BloomFilter bf(8, times_vector);
    EXPECT_NE(bf.getBitArray(), nullptr);
    EXPECT_EQ(bf.getSize(), 8);
    for (int i = 0; i < bf.getSize(); i++)
    {
        EXPECT_EQ(bf.getBitArray()[i], 0);
    }
    ASSERT_EQ(bf.getHashFuncVector().size(), 3);
    EXPECT_EQ(bf.getHashFuncVector()[0].second, 2);
    EXPECT_EQ(bf.getHashFuncVector()[1].second, 1);
    EXPECT_EQ(bf.getHashFuncVector()[2].second, 3);
}

int main(int argc, char **argv)
{
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}