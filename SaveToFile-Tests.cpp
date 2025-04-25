#include <gtest/gtest.h>
#include "BloomFilter.h"
#include <fstream>

// Checks that the blacklist is correctly saved to a file
TEST(SaveToFile, SaveBlacklistSuccess)
{
    std::vector<int> num_hash = {2, 3};
    BloomFilter bf(64, num_hash);

    bf.addUrl("www.test5.com");
    bf.saveBlacklistToFile();
    {
        std::ifstream in("Blacklist.txt");
        ASSERT_TRUE(in.is_open());

        std::string line;
        // Read the first and only line of input
        std::getline(in, line);
        // Check that the saved line matches the entered URL
        EXPECT_EQ(line, "www.test5.com");

        // Check that there is no additional row – only one is saved
        EXPECT_FALSE(std::getline(in, line));
    }

    bf.addUrl("www.test6.com");
    bf.saveBlacklistToFile();
    {
        // Reopen the file for re-examination
        std::ifstream in("Blacklist.txt");
        ASSERT_TRUE(in.is_open());

        // Set to store all rows (no duplicates)
        std::unordered_set<std::string> lines;
        std::string line;
        // Read all lines in the file
        while (std::getline(in, line))
        {
            lines.insert(line);
        }

        EXPECT_EQ(lines.size(), 2);
        // Check that the first URL exists
        EXPECT_TRUE(lines.find("www.test5.com") != lines.end());
        // Check that the second URL exists
        EXPECT_TRUE(lines.find("www.test6.com") != lines.end());
    }
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
