#include <gtest/gtest.h>
#include "BloomFilter.h"

using namespace std;

// sanity test for 
TEST(BloomFilterTests, getters) 
{
    BloomFilter bf(8, 2, 1);
    EXPECT_NE(bf.getBitArray(), nullptr);
    EXPECT_EQ(bf.getSize(), 8);
    for (int i = 0; i < bf.getSize(); i++) 
    {
        EXPECT_EQ(bf.getBitArray()[i], 0);
    }
    ASSERT_EQ(bf.getHashFuncVector().size(), 2);
    EXPECT_EQ(bf.getHashFuncVector()[0].second, 2);
    EXPECT_EQ(bf.getHashFuncVector()[1].second, 1);       
}

int main(int argc, char **argv) 
{
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}