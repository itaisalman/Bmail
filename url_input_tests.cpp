#include <gtest/gtest.h>
#include "Input.h"
#include <string>

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

int main(int argc, char **argv)
{
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}
