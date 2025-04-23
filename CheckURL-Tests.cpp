#include <gtest/gtest.h>
#include "BloomFilter.h"

// Test for a URL that is in the blacklist.
// Should return True in both checks → prints "true true\n"
TEST(CheckURLTest, ExistingURL) {
    BloomFilter bf(128, 1, 1);
    std::string url = "www.test1.com";
    bf.addUrl(url);
    {
        std::stringstream buffer;
        std::streambuf* old = std::cout.rdbuf(buffer.rdbuf());

        bf.checkUrl(url);

        std::cout.rdbuf(old);

        EXPECT_EQ(buffer.str(), "true true\n");
    }
}

// Test for a URL that is not exist blacklist.
// Should return False in the first check → prints "false\n
TEST(CheckURLTest, NonExistingURL){
    BloomFilter bf(128, 1, 1);
    std::string url = "www.test2.com";
    {
        std::stringstream buffer;
        std::streambuf* old = std::cout.rdbuf(buffer.rdbuf());

        bf.checkUrl(url);

        std::cout.rdbuf(old);

        EXPECT_EQ(buffer.str(), "false\n");
    } 
}
// Test for a URL that is FalsePositive.
// First check returns true, second check (blacklist) fails → prints "true\nfalse\n"
TEST(CheckURLTest, FalsePositive){
    BloomFilter bf(8, 2, 1);
    std::string real_url = "www.real.com";
    std::string false_positive_url = "www.fake7.com";
   
    hash_funcs = bf.getHashFuncVector();
    h1 = hash_funcs[0].first;
    int index = h1(real_url) % 8;

    bf.getBitArray()[index] = 1;

    bf.getBlacklist().insert(real_url);

    {
        std::stringstream buffer;
        std::streambuf* old = std::cout.rdbuf(buffer.rdbuf());

        bf.checkUrl(real_url);

        std::cout.rdbuf(old);
        EXPECT_EQ(buffer.str(), "true true\n");
    }

    int index_fake = h1(false_positive_url) % 8;
    EXPECT_EQ(index_fake, index);

    {
        std::stringstream buffer;
        std::streambuf* old = std::cout.rdbuf(buffer.rdbuf());

        bf.checkUrl(false_positive_url);

        std::cout.rdbuf(old);

        EXPECT_EQ(buffer.str(), "true false\n");
    } 
}

int main(int argc, char **argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}
