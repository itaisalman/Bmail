#include <gtest/gtest.h>
#include "Input.h"
#include <vector>

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

int main(int argc, char **argv)
{
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}
