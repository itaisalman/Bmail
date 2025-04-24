#include <gtest/gtest.h>
#include "BloomFilter.h"

// Test for a URL that is in the blacklist.
// Should return True in both checks → prints "true true\n"
TEST(CheckURLTest, ExistingURL)
{
    BloomFilter bf(128, 1, 1);
    std::string url = "www.test1.com";
    bf.addUrl(url);
    {
        std::stringstream buffer;
        std::streambuf *old = std::cout.rdbuf(buffer.rdbuf());

        bf.checkUrl(url);

        std::cout.rdbuf(old);

        EXPECT_EQ(buffer.str(), "true true\n");
    }
}

// Test for a URL that is not exist blacklist.
// Should return False in the first check → prints "false\n
TEST(CheckURLTest, NonExistingURL)
{
    BloomFilter bf(128, 1, 1);
    std::string url = "www.test2.com";
    {
        std::stringstream buffer;
        std::streambuf *old = std::cout.rdbuf(buffer.rdbuf());

        bf.checkUrl(url);

        std::cout.rdbuf(old);

        EXPECT_EQ(buffer.str(), "false\n");
    }
}
// Test for a URL that is FalsePositive.
// First check returns true, second check (blacklist) fails → prints "true\nfalse\n"
TEST(CheckURLTest, FalsePositive)
{
    std::vector<int> num_hash = {2, 1} BloomFilter bf(8, num_hash);
    std::string real_url = "www.real8.com";
    std::string false_positive_url = "www.fake6.com";

    bf.addUrl(real_url);

    std::vector<std::pair<std::function<std::size_t(const std::string &)>, int>> hash_funcs = bf.getHashFuncVector();

    auto h1 = hash_funcs[0].first;
    auto h2 = hash_funcs[1].first;

    size_t result_h1 = h1(real_url);
    result_h1 = h1(std::to_string(result_h1));
    int index_h1 = result_h1 % bf.getSize();

    size_t result_h2 = h2(real_url);
    int index_h2 = result_h2 % bf.getSize();

    bf.getBitArray()[index_h1] = 1;
    bf.getBitArray()[index_h2] = 1;

    {
        std::stringstream buffer;
        std::streambuf *old = std::cout.rdbuf(buffer.rdbuf());

        bf.checkUrl(real_url);

        std::cout.rdbuf(old);
        EXPECT_EQ(buffer.str(), "true true\n");
    }

    size_t result_f1 = h1(false_positive_url);
    result_f1 = h1(std::to_string(result_f1));
    int index_f1 = result_f1 % bf.getSize();

    size_t result_f2 = h2(false_positive_url);
    int index_f2 = result_f2 % bf.getSize();

    if (index_h1 == index_f1 && index_h2 == index_f2)
    {

        {
            std::stringstream buffer;
            std::streambuf *old = std::cout.rdbuf(buffer.rdbuf());

            bf.checkUrl(false_positive_url);

            std::cout.rdbuf(old);

            EXPECT_EQ(buffer.str(), "true false\n");
        }
    }
}

int main(int argc, char **argv)
{
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}
