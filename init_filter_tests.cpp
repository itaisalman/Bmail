#include <gtest/gtest.h>
#include "BloomFilter.h"

// sanity test
TEST(InitFilterTest, ValidInput) {
    // default values for test
    BloomFilter filter(10, 1, 2);

    // execute function and check if the values changed
    filter.init_filter(16, 2, 1);
    EXPECT_EQ(filter.getSize(), 16);
    EXPECT_EQ(filter.getNumOfHashFunc(), 2);
    EXPECT_EQ(filter.getNumTimes(), 1);
}

// large numbers but still valid 
TEST(InitFilterTest, ValidInput1) {
    // default values for test
    BloomFilter filter(10, 1, 2);

    // execute function and check if the values changed
    filter.init_filter(100000000000, 9, 1);
    EXPECT_EQ(filter.getSize(), 100000000000);
    EXPECT_EQ(filter.getNumOfHashFunc(), 9);
    EXPECT_EQ(filter.getNumTimes(), 1);

    filter.init_filter(100, 20004235300, 3);
    EXPECT_EQ(filter.getSize(), 100);
    EXPECT_EQ(filter.getNumOfHashFunc(), 20004235300);
    EXPECT_EQ(filter.getNumTimes(), 3);

    filter.init_filter(10, 2, 56438956);
    EXPECT_EQ(filter.getSize(), 10);
    EXPECT_EQ(filter.getNumOfHashFunc(), 2);
    EXPECT_EQ(filter.getNumTimes(), 56438956);
}

// check edge case
TEST(InitFilterTest, ValidEdgeInput) {
    // default values for test
    BloomFilter filter(2, 2, 2);
    
    // execute function and check if the values changed
    filter.init_filter(1, 1, 1);
    EXPECT_EQ(filter.getSize(), 1);
    EXPECT_EQ(filter.getNumOfHashFunc(), 1);
    EXPECT_EQ(filter.getNumTimes(), 1);
}

// zero's
TEST(InitFilterTest, InvalidInputIgnored) {
    // default values for test
    BloomFilter filter(50, 4, 1); 

    // execute function and check ingnorance
    filter.init_filter(0, 3, 2); 
    EXPECT_EQ(filter.getSize(), 50);
    EXPECT_EQ(filter.getNumOfHashFunc(), 4);
    EXPECT_EQ(filter.getNumTimes(), 1);

    filter.init_filter(100, 0, 2); 
    EXPECT_EQ(filter.getSize(), 50);
    EXPECT_EQ(filter.getNumOfHashFunc(), 4);
    EXPECT_EQ(filter.getNumTimes(), 1);

    filter.init_filter(10, 2, 0); 
    EXPECT_EQ(filter.getSize(), 50);
    EXPECT_EQ(filter.getNumOfHashFunc(), 4);
    EXPECT_EQ(filter.getNumTimes(), 1);
}

// negative values
TEST(InitFilterTest, InvalidInputIgnored1) {
    // default values for test
    BloomFilter filter(50, 4, 1); 

    // execute function and check ingnorance
    filter.init_filter(-8, 2, 2); 
    EXPECT_EQ(filter.getSize(), 50);
    EXPECT_EQ(filter.getNumOfHashFunc(), 4);
    EXPECT_EQ(filter.getNumTimes(), 1);

    filter.init_filter(8, -2, 2); 
    EXPECT_EQ(filter.getSize(), 50);
    EXPECT_EQ(filter.getNumOfHashFunc(), 4);
    EXPECT_EQ(filter.getNumTimes(), 1);

    filter.init_filter(8, 2, -2); 
    EXPECT_EQ(filter.getSize(), 50);
    EXPECT_EQ(filter.getNumOfHashFunc(), 4);
    EXPECT_EQ(filter.getNumTimes(), 1);
}

// undecimal numbers
TEST(InitFilterTest, InvalidInputIgnored2) {
    // default values for test
    BloomFilter filter(50, 4, 1); 

    // execute function and check ingnorance
    filter.init_filter(8.6, 1, 2);
    EXPECT_EQ(filter.getSize(), 50);
    EXPECT_EQ(filter.getNumOfHashFunc(), 4);
    EXPECT_EQ(filter.getNumTimes(), 1);

    filter.init_filter(8, 1.5, 2);
    EXPECT_EQ(filter.getSize(), 50);
    EXPECT_EQ(filter.getNumOfHashFunc(), 4);
    EXPECT_EQ(filter.getNumTimes(), 1);
    
    filter.init_filter(8, 2, 2.3);
    EXPECT_EQ(filter.getSize(), 50);
    EXPECT_EQ(filter.getNumOfHashFunc(), 4);
    EXPECT_EQ(filter.getNumTimes(), 1);    
}  


int main(int argc, char **argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}

