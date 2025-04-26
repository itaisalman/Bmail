#include <gtest/gtest.h>
#include "BloomFilter.h"
#include "Input.h"
#include "Storage.h"
#include <fstream>

using namespace std;

// Returning URL example.
std::string exampleUrl()
{
    return "www.example.com";
}

// Construct expected array.
void setExpectedBit(int *array, vector<int> indices)
{
    for (auto index : indices)
    {
        array[index] = 1;
    }
}

// Check if a given url is in the blacklist.
bool isBlacklisted(unordered_set<string> blacklist, string url)
{
    if (blacklist.find(url) != blacklist.end())
    {
        return true;
    }
    return false;
}

// Gets the corresponding argument in order to give back the correct index.
int hashIndex(std::function<std::size_t(const std::string &)> hashFunc, int times, int array_size, std::string url)
{
    size_t result = hashFunc(url);
    times--;
    for (int i = 0; i < times; i++)
    {
        result = hashFunc(std::to_string(result));
    }
    return result % array_size;
}

// Check if the BloomFilter array is as expected.
bool checkArray(int *correct_array, int *checked_array, int size)
{
    for (int i = 0; i < size; i++)
    {
        if (correct_array[i] != checked_array[i])
        {
            return false;
        }
    }
    return true;
}

// Check if a file added as expected.
TEST(AdditionTest, AddURLSuccessfully)
{
    std::vector<int> num_times_vector = {1, 1};
    BloomFilter bf(128, num_times_vector);
    string url = exampleUrl();
    bf.addUrl(url);
    unordered_set<string> blacklist = bf.getBlacklist();
    EXPECT_TRUE(isBlacklisted(blacklist, url));
}

// Check if handles correctly with one Loop over the hash functions.
TEST(AdditionTest, UpdateArray1)
{
    std::vector<int> num_times_vector = {1, 1};
    BloomFilter bf(128, num_times_vector);
    string url = exampleUrl();
    bf.addUrl(url);
    std::vector<std::pair<std::function<std::size_t(const std::string &)>, int>> hash_structure = bf.getHashFuncVector();
    int first_index = hashIndex(hash_structure[0].first, hash_structure[0].second, 128, url);
    int second_index = hashIndex(hash_structure[1].first, hash_structure[1].second, 128, url);
    int correct_array[128] = {0};
    std::vector<int> indices = {first_index, second_index};
    setExpectedBit(correct_array, indices);
    int *checked_array = bf.getBitArray();
    EXPECT_TRUE(checkArray(correct_array, checked_array, 128));
    unordered_set<string> blacklist = bf.getBlacklist();
    EXPECT_TRUE(isBlacklisted(blacklist, url));
}

// Check if handles correctly with multiple Loops over the hash functions.
TEST(AdditionTest, UpdateArray2)
{
    vector<int> num_times_vector = {2, 3, 20};
    BloomFilter bf(8, num_times_vector);
    string url = exampleUrl();
    bf.addUrl(url);
    std::vector<std::pair<std::function<std::size_t(const std::string &)>, int>> hash_structure = bf.getHashFuncVector();
    int first_index = hashIndex(hash_structure[0].first, hash_structure[0].second, 8, url);
    int second_index = hashIndex(hash_structure[1].first, hash_structure[1].second, 8, url);
    int third_index = hashIndex(hash_structure[2].first, hash_structure[2].second, 8, url);
    int correct_array[8] = {0};
    std::vector<int> indices = {first_index, second_index, third_index};
    setExpectedBit(correct_array, indices);
    int *checked_array = bf.getBitArray();
    EXPECT_TRUE(checkArray(correct_array, checked_array, 8));
    unordered_set<string> blacklist = bf.getBlacklist();
    EXPECT_TRUE(isBlacklisted(blacklist, url));
}

// Check if handle big arrays correctly.
TEST(AdditionTest, ArraySize)
{
    std::vector<int> num_times_vector = {1, 1};
    BloomFilter bf(8000, num_times_vector);
    string url = exampleUrl();
    bf.addUrl(url);
    std::vector<std::pair<std::function<std::size_t(const std::string &)>, int>> hash_structure = bf.getHashFuncVector();
    int first_index = hashIndex(hash_structure[0].first, hash_structure[0].second, 8000, url);
    int second_index = hashIndex(hash_structure[1].first, hash_structure[1].second, 8000, url);
    int correct_array[8000] = {0};
    std::vector<int> indices = {first_index, second_index};
    setExpectedBit(correct_array, indices);
    int *checked_array = bf.getBitArray();
    EXPECT_TRUE(checkArray(correct_array, checked_array, 8000));
    unordered_set<string> blacklist = bf.getBlacklist();
    EXPECT_TRUE(isBlacklisted(blacklist, url));
}

// sanity test
TEST(checkInitInput, ValidInput)
{
    // regular inputs
    std::pair<bool, std::pair<int, std::vector<int>>> result = checkInitInput("8 1");
    EXPECT_TRUE(result.first);
    EXPECT_EQ(result.second.first, 8);
    EXPECT_TRUE(std::vector<int>({1}) == result.second.second);

    result = checkInitInput("16 2 1");
    EXPECT_TRUE(result.first);
    EXPECT_EQ(result.second.first, 16);
    EXPECT_TRUE(std::vector<int>({2, 1}) == result.second.second);

    result = checkInitInput("100 2");
    EXPECT_TRUE(result.first);
    EXPECT_EQ(result.second.first, 100);
    EXPECT_TRUE(std::vector<int>({2}) == result.second.second);

    result = checkInitInput("8 2 3 4 5 1");
    EXPECT_TRUE(result.first);
    EXPECT_EQ(result.second.first, 8);
    EXPECT_TRUE(std::vector<int>({2, 3, 4, 5, 1}) == result.second.second);

    result = checkInitInput("128 2 3 4 5 1 2 3 4 5 1 2 3 4 5 7 7 77 2 3 4 5 1 2 3 4 5 1");
    EXPECT_TRUE(result.first);
    EXPECT_EQ(result.second.first, 128);
    EXPECT_TRUE(std::vector<int>({2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 7, 7, 77, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1}) == result.second.second);

    result = checkInitInput("128 30 26 16 15 70");
    EXPECT_TRUE(result.first);
    EXPECT_EQ(result.second.first, 128);
    EXPECT_TRUE(std::vector<int>({30, 26, 16, 15, 70}) == result.second.second);
}

// large numbers but still valid
TEST(checkInitInput, ValidInput1)
{
    std::pair<bool, std::pair<int, std::vector<int>>> result = checkInitInput("1000000000 9");
    EXPECT_TRUE(result.first);
    EXPECT_EQ(result.second.first, 1000000000);
    EXPECT_TRUE(std::vector<int>({9}) == result.second.second);

    result = checkInitInput("100 200042300");
    EXPECT_TRUE(result.first);
    EXPECT_EQ(result.second.first, 100);
    EXPECT_TRUE(std::vector<int>({200042300}) == result.second.second);

    result = checkInitInput("100 5462986 56438956 66666666");
    EXPECT_TRUE(result.first);
    EXPECT_EQ(result.second.first, 100);
    EXPECT_TRUE(std::vector<int>({5462986, 56438956, 66666666}) == result.second.second);
}

// wrong number of arguments
TEST(checkInitInput, InValidInput1)
{
    EXPECT_FALSE(checkInitInput("-4").first);
    EXPECT_FALSE(checkInitInput("x").first);
    EXPECT_FALSE(checkInitInput("&").first);
    EXPECT_FALSE(checkInitInput("88888").first);
    EXPECT_FALSE(checkInitInput("x x x x x x x").first);
}

// chars instead of numbers
TEST(checkInitInput, InValidInput2)
{
    EXPECT_FALSE(checkInitInput("X Y").first);
    EXPECT_FALSE(checkInitInput("x y z").first);
    EXPECT_FALSE(checkInitInput("e -1").first);
    EXPECT_FALSE(checkInitInput("& 4 -1").first);
    EXPECT_FALSE(checkInitInput("3 %").first);
    EXPECT_FALSE(checkInitInput("2 -4 t").first);
}

// negative numbers and zeroes
TEST(checkInitInput, InValidInput3)
{
    EXPECT_FALSE(checkInitInput("0 1").first);
    EXPECT_FALSE(checkInitInput("8 0").first);
    EXPECT_FALSE(checkInitInput("16 1 0").first);
    EXPECT_FALSE(checkInitInput("20 0 4").first);
    EXPECT_FALSE(checkInitInput("-8 1").first);
    EXPECT_FALSE(checkInitInput("100 -2").first);
    EXPECT_FALSE(checkInitInput("64 1 -2").first);
    EXPECT_FALSE(checkInitInput("32 -3 2").first);
    EXPECT_FALSE(checkInitInput("18 1 2 0").first);
    EXPECT_FALSE(checkInitInput("18 1 5 5 6 0").first);
}

// spaces, tabs, new lines etc..
TEST(checkInitInput, InValidInput4)
{
    // too many spaces between the numbers
    std::pair<bool, std::pair<int, std::vector<int>>> result = checkInitInput("100              1");
    EXPECT_TRUE(result.first);
    EXPECT_EQ(result.second.first, 100);
    EXPECT_TRUE(std::vector<int>({1}) == result.second.second);

    result = checkInitInput("   8  2");
    EXPECT_TRUE(result.first);
    EXPECT_EQ(result.second.first, 8);
    EXPECT_TRUE(std::vector<int>({2}) == result.second.second);

    result = checkInitInput("16 1           4");
    EXPECT_TRUE(result.first);
    EXPECT_EQ(result.second.first, 16);
    EXPECT_TRUE(std::vector<int>({1, 4}) == result.second.second);

    result = checkInitInput("50 1       ");
    EXPECT_TRUE(result.first);
    EXPECT_EQ(result.second.first, 50);
    EXPECT_TRUE(std::vector<int>({1}) == result.second.second);

    result = checkInitInput("55  1");
    EXPECT_TRUE(result.first);
    EXPECT_EQ(result.second.first, 55);
    EXPECT_TRUE(std::vector<int>({1}) == result.second.second);

    result = checkInitInput("            8  1  2");
    EXPECT_TRUE(result.first);
    EXPECT_EQ(result.second.first, 8);
    EXPECT_TRUE(std::vector<int>({1, 2}) == result.second.second);

    // different lines
    EXPECT_FALSE(checkInitInput("8\n1").first);
    EXPECT_FALSE(checkInitInput("16\n1 1").first);
    EXPECT_FALSE(checkInitInput("100 1\n4").first);
}

// undecimal numbers
TEST(checkInitInput, InValidInput5)
{
    EXPECT_FALSE(checkInitInput("8.5 1").first);
    EXPECT_FALSE(checkInitInput("100 0.5").first);
    EXPECT_FALSE(checkInitInput("8 1 2.5").first);
    EXPECT_FALSE(checkInitInput("20 1.5 3").first);
    EXPECT_FALSE(checkInitInput("20.7 8 0.1").first);
    EXPECT_FALSE(checkInitInput("207 8 3 4 0.1").first);
}

// Checks if the setBlacklist fucntion inserts the URL list correctly to the blacklist field.
TEST(SetterTest, UpdateBlacklist)
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

// Test for a URL that is in the blacklist.
// Should return True in both checks → prints "true true\n"
TEST(CheckURLTest, ExistingURL)
{
    std::vector<int> num_hash = {1, 1};
    BloomFilter bf(128, num_hash);
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
    std::vector<int> num_hash = {3, 5};
    BloomFilter bf(8, num_hash);
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
    std::vector<int> num_hash = {2, 1};
    BloomFilter bf(1, num_hash);
    std::string real_url = "www.real.com";
    std::string false_positive_url = "www.fake.com";

    bf.addUrl(real_url);

    std::vector<std::pair<std::function<std::size_t(const std::string &)>, int>> hash_funcs = bf.getHashFuncVector();

    auto h1 = hash_funcs[0].first;
    auto h2 = hash_funcs[1].first;

    size_t result_h1 = h1(real_url);
    result_h1 = h1(std::to_string(result_h1)) % bf.getSize();

    size_t result_h2 = h2(real_url) % bf.getSize();

    // Set the corresponding bits in the Bloom filter's bit array to 1
    bf.getBitArray()[result_h1] = 1;
    bf.getBitArray()[result_h2] = 1;

    {
        std::stringstream buffer;
        std::streambuf *old = std::cout.rdbuf(buffer.rdbuf());

        bf.checkUrl(real_url);

        std::cout.rdbuf(old);
        // Should print "true true" → found in Bloom Filter and passes second check
        EXPECT_EQ(buffer.str(), "true true\n");
    }

    // Compute the hash positions for the fake (false-positive) URL
    size_t result_f1 = h1(false_positive_url);
    result_f1 = h1(std::to_string(result_f1)) % bf.getSize();
    size_t result_f2 = h2(false_positive_url) % bf.getSize();

    // Only test false positive behavior if the fake URL happens to hash to the same indices
    if (result_h1 == result_f1 && result_h2 == result_f2)
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

// sanity test
TEST(isValidURLRequest, ValidInput)
{
    std::pair<int, std::string> result;

    result = isValidURLRequest("1 www.example.com");
    EXPECT_EQ(1, result.first);
    EXPECT_EQ("www.example.com", result.second);

    result = isValidURLRequest("2 www.example.com");
    EXPECT_EQ(2, result.first);
    EXPECT_EQ("www.example.com", result.second);
}

// a bit different URL's but still valid
TEST(isValidURLRequest, ValidInput1)
{
    std::pair<int, std::string> result;

    result = isValidURLRequest("1 www.example34278.com");
    EXPECT_EQ(1, result.first);
    EXPECT_EQ("www.example34278.com", result.second);

    result = isValidURLRequest("1 www.342sf78example.com");
    EXPECT_EQ(1, result.first);
    EXPECT_EQ("www.342sf78example.com", result.second);

    result = isValidURLRequest("2 www.exampleexample.com");
    EXPECT_EQ(2, result.first);
    EXPECT_EQ("www.exampleexample.com", result.second);

    result = isValidURLRequest("2 www.example4637example.com");
    EXPECT_EQ(2, result.first);
    EXPECT_EQ("www.example4637example.com", result.second);
}

// long but valid URL's
TEST(isValidURLRequest, ValidInput2)
{
    std::pair<int, std::string> result;

    result = isValidURLRequest("1 www.fndkjfnkjdvsjvdkvnldnvnsckllkbkjexample34278.com");
    EXPECT_EQ(1, result.first);
    EXPECT_EQ("www.fndkjfnkjdvsjvdkvnldnvnsckllkbkjexample34278.com", result.second);

    result = isValidURLRequest("2 www.fbejfnmvllknvjdfbkgdlml436743784mmkfmkmfkmkfdfd28472vj.com");
    EXPECT_EQ(2, result.first);
    EXPECT_EQ("www.fbejfnmvllknvjdfbkgdlml436743784mmkfmkmfkmkfdfd28472vj.com", result.second);
}

// different numbers for first argumnet
TEST(isValidURLRequest, inValidInput)
{
    EXPECT_EQ(0, isValidURLRequest("3 www.example.com").first);
    EXPECT_EQ(0, isValidURLRequest("0 www.example.com").first);
    EXPECT_EQ(0, isValidURLRequest("11 www.example.com").first);
    EXPECT_EQ(0, isValidURLRequest("222 www.example.com").first);
    EXPECT_EQ(0, isValidURLRequest("# www.example.com").first);
    EXPECT_EQ(0, isValidURLRequest("' www.example.com").first);
}

// different order/number of argumnets
TEST(isValidURLRequest, inValidInput1)
{
    EXPECT_EQ(0, isValidURLRequest("www.example.com").first);
    EXPECT_EQ(0, isValidURLRequest("www.example.com 2").first);
    EXPECT_EQ(0, isValidURLRequest("1").first);
    EXPECT_EQ(0, isValidURLRequest("1 www.com").first);
}

// different spaces between the argumnets
TEST(isValidURLRequest, inValidInput2)
{
    EXPECT_EQ(0, isValidURLRequest("2www.example.com").first);
    std::pair<int, std::string> result = isValidURLRequest("1        www.example.com");
    EXPECT_EQ(1, result.first);
    EXPECT_EQ("www.example.com", result.second);
}

// spaces in the URL
TEST(isValidURLRequest, inValidInput3)
{
    EXPECT_EQ(0, isValidURLRequest("1 w ww.example.com").first);
    EXPECT_EQ(0, isValidURLRequest("1 ww w.example.com").first);
    EXPECT_EQ(0, isValidURLRequest("2 www .example.com").first);
    EXPECT_EQ(0, isValidURLRequest("2 www. example.com").first);
    EXPECT_EQ(0, isValidURLRequest("2 www.exam ple.com").first);
    EXPECT_EQ(0, isValidURLRequest("2 www.example .com").first);
    EXPECT_EQ(0, isValidURLRequest("1 www.example. com").first);
    EXPECT_EQ(0, isValidURLRequest("1 www.example.c om").first);
    EXPECT_EQ(0, isValidURLRequest("2 www.example.co m").first);
}

// invalid chars in URL
TEST(isValidURLRequest, inValidInput4)
{
    EXPECT_EQ(0, isValidURLRequest("2,www.example.com").first);
    EXPECT_EQ(0, isValidURLRequest("2 w1ww.example.com").first);
    EXPECT_EQ(0, isValidURLRequest("1 www,example.com").first);
    EXPECT_EQ(0, isValidURLRequest("1 www.example:com").first);
    EXPECT_EQ(0, isValidURLRequest("2 www.ex'ample.com").first);
    EXPECT_EQ(0, isValidURLRequest("2 www.example.co;m").first);
    EXPECT_EQ(0, isValidURLRequest("2 www.example.co6m").first);
    EXPECT_EQ(0, isValidURLRequest("2 w?ww.example.com").first);
    EXPECT_EQ(0, isValidURLRequest("2 www..example.com").first);
    EXPECT_EQ(0, isValidURLRequest("1 www.example..com").first);
    EXPECT_EQ(0, isValidURLRequest("1 .www.example.com").first);
    EXPECT_EQ(0, isValidURLRequest("1 www.example.com.").first);
}

// upper cases in URL
TEST(isValidURLRequest, inValidInput5)
{
    std::pair<int, std::string> result;

    result = isValidURLRequest("1 WWw.example.com");
    EXPECT_EQ(1, result.first);
    EXPECT_EQ("WWw.example.com", result.second);

    result = isValidURLRequest("2 WWW.EXAMPLE.COM");
    EXPECT_EQ(2, result.first);
    EXPECT_EQ("WWW.EXAMPLE.COM", result.second);

    result = isValidURLRequest("2 www.exAamWple.com");
    EXPECT_EQ(2, result.first);
    EXPECT_EQ("www.exAamWple.com", result.second);
}

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

    unordered_set<std::string> urls = loadFromFile(file_name);

    EXPECT_EQ(urls.size(), 2);
    EXPECT_TRUE(urls.find("www.test1.com") != urls.end());
    EXPECT_TRUE(urls.find("www.test2.com") != urls.end());

    // Clearing the file at the end for the next test
    std::remove(file_name.c_str());
}

// Checks that the function does not throw an exception even if the file does not exist
TEST(LoadFromFile, LoadFromNonExistentFile)
{
    std::string file_name = "Blacklist.txt";
    EXPECT_NO_THROW({
        std::unordered_set<std::string> urls = loadFromFile(file_name);
        EXPECT_TRUE(urls.empty());
    });
}

// Checks that the URL is correctly saved to a file
TEST(SaveToFile, SaveURLSuccessfully)
{
    const std::string file_name = "/app/data/Blacklist.txt";
    // open the file (assume empty).
    std::ifstream in_file(file_name);
    ASSERT_TRUE(in_file);
    // should add URL to file.
    saveToFile("www.test5.com");
    {
        std::ifstream in(file_name);
        ASSERT_TRUE(in.is_open());

        std::string line;
        // Read the first and only line of input
        std::getline(in, line);
        // Check that the saved line matches the entered URL
        EXPECT_EQ(line, "www.test5.com");

        // Check that there is no additional row – only one is saved
        EXPECT_FALSE(std::getline(in, line));
    }
}

// Check if handles with non existing file.
TEST(SaveToFile, SaveToNonExistingFile)
{
    const std::string file_name = "/app/data/Blacklist.txt";
    // Add the URL to end of file.
    saveToFile("www.test6.com");
    std::fstream in(file_name);
    // Verifies that the file is actually opened, otherwise, the test fails
    ASSERT_TRUE(in.is_open());
    std::string line;
    // Make sure previous URL was not deleted.
    std::getline(in, line);
    EXPECT_EQ(line, "www.test5.com");
    // Expect the line written to be exactly what we passed
    std::getline(in, line);
    EXPECT_EQ(line, "www.test6.com");
    std::ofstream file(file_name, std::ios::trunc);
    in.close();
}

int main(int argc, char **argv)
{
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}