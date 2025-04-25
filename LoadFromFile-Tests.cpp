#include <gtest/gtest.h>
#include "BloomFilter.h"
#include <fstream>

// The BloomFilter correctly loads URLs from a file
TEST(LoadFromFile, LoadBlacklistFromFile)
{
    std::string file_name = "Blacklist.txt";
    // Simulates a blacklist file
    std::ofstream out(file_name);

    // Writes two lines to the file and then closes it
    out << "www.test1.com\n";
    out << "www.test2.com\n";
    out.close();

    std::vector<int> num_hash = {4, 3, 1};
    BloomFilter bf(128, num_hash);
    bf.loadBlacklistFromFile(file_name);

    std::unordered_set<std::string> blacklist = bf.getBlacklist();

    EXPECT_EQ(blacklist.size(), 2);
    EXPECT_TRUE(blacklist.find("www.test1.com") != blacklist.end());
    EXPECT_TRUE(blacklist.find("www.test2.com") != blacklist.end());
}

TEST(LoadFromFile, LoadCumulativeBlacklist)
{
    std::string file_name = "Blacklist.txt";
    // Simulates a blacklist file
    std::ofstream out(file_name);

    out << "www.test3.com";

    std::vector<int> num_hash = {1, 2};
    BloomFilter bf(8, num_hash);
    bf.loadBlacklistFromFile(file_name);

    std::unordered_set<std::string> blacklist = bf.getBlacklist();

    // Verifies that the existing URL was successfully loaded
    ASSERT_EQ(blacklist.size(), 1);
    ASSERT_TRUE(blacklist.find("www.test3.com") != blacklist.end());

    bf.addUrl("www.test4.com");

    // Save the new blacklist to a file (should include both old and new ones)
    bf.saveBlacklistToFile();

    BloomFilter bf2(8, num_hash);

    // Reloads the file
    bf2.loadBlacklistFromFile(file_name);

    std::unordered_set<std::string> updateBlacklist = bf2.getBlacklist();

    // Checks that the previous data was saved, and that the new data was added correctly
    EXPECT_EQ(updateBlacklist.size(), 2);
    EXPECT_TRUE(updateBlacklist.find("www.test3.com") != updateBlacklist.end());
    EXPECT_TRUE(updateBlacklist.find("www.test4.com") != updateBlacklist.end());
}

// Checks that the function does not throw an exception even if the file does not exist
TEST(LoadFromFile, LoadFromNonExistentFile)
{
    std::vector<int> num_hash = {2, 1};
    BloomFilter bf(8, num_hash);
    EXPECT_NO_THROW(bf.loadBlacklistFromFile("nonexist_file.txt"));
}

int main(int argc, char **argv)
{
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}
