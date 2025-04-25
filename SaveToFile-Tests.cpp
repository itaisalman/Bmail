#include <gtest/gtest.h>
#include "BloomFilter.h"
#include <fstream>

// Checks that the blacklist is correctly saved to a file
TEST(SaveToFile, SaveBlacklistSuccess)
{
    std::vector<int> num_hash = {2, 3};
    BloomFilter bf(64, num_hash);
    bf.addUrl("www.test5.com");
    bf.addUrl("www.test6.com");

    // save to file
    bf.saveBlacklistToFile();

    // read file back
    std::ifstream in("Blacklist.txt");
    ASSERT_TRUE(in.is_open());

    std::unordered_set<std::string> blacklist;
    std::string line;

    // Each line (url) is entered into the blacklist.
    while (std::getline(in, line))
    {
        blacklist.insert(line);
    }

    EXPECT_EQ(blacklist.size(), 2);
    EXPECT_TRUE(blacklist.find("www.test5.com") != blacklist.end());
    EXPECT_TRUE(blacklist.find("www.test6.com") != blacklist.end());
}

// Ensures that saving an empty blacklist creates an empty file.
TEST(SaveToFile, SaveEmptyBlacklist)
{
    std::vector<int> num_hash = {1, 2, 3};
    BloomFilter bf(64, num_hash);
    bf.saveBlacklistToFile();

    std::ifstream in("Blacklist.txt");

    // Verifies that the file is actually opened, otherwise, the test fails
    ASSERT_TRUE(in.is_open());

    std::string line;

    // If there was at least one line in the file
    bool hasLines = static_cast<bool>(std::getline(in, line));

    // Should be empty
    EXPECT_FALSE(hasLines);
}

int main(int argc, char **argv)
{
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}
