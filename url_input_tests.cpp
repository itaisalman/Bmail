#include <gtest/gtest.h>
#include "input.h"

// sanity test
TEST(isValidURLRequest, ValidInput) 
{
    EXPECT_TRUE(isValidURLRequest("1 www.example.com"));   
    EXPECT_TRUE(isValidURLRequest("2 www.example.com"));
}

// a bit different URL's but still valid
TEST(isValidURLRequest, ValidInput1)
{
    EXPECT_TRUE(isValidURLRequest("1 www.example34278.com"));
    EXPECT_TRUE(isValidURLRequest("1 www.342sf78example.com"));
    EXPECT_TRUE(isValidURLRequest("2 www.exampleexample.com"));
    EXPECT_TRUE(isValidURLRequest("2 www.example4637example.com"));
}

// long but valid URL's
TEST(isValidURLRequest, ValidInput2) 
{
    EXPECT_TRUE(isValidURLRequest("1 www.fndkjfnkjdvsjvdkvnldnvnsckllkbkjexample34278.com"));
    EXPECT_TRUE(isValidURLRequest("2 www.fbejfnmvllknvjdfbkgdlml436743784mmkfmkmfkmkfdfd28472vj.com"));
}

// different numbers for first argumnet
TEST(isValidURLRequest, inValidInput) 
{
    EXPECT_FALSE(isValidURLRequest("3 www.example.com"));
    EXPECT_FALSE(isValidURLRequest("0 www.example.com"));
    EXPECT_FALSE(isValidURLRequest("11 www.example.com"));
    EXPECT_FALSE(isValidURLRequest("222 www.example.com"));
    EXPECT_FALSE(isValidURLRequest("# www.example.com"));
    EXPECT_FALSE(isValidURLRequest("' www.example.com"));
}

// different order/number of argumnets
TEST(isValidURLRequest, inValidInput1) 
{
    EXPECT_FALSE(isValidURLRequest("www.example.com"));
    EXPECT_FALSE(isValidURLRequest("www.example.com 2"));
    EXPECT_FALSE(isValidURLRequest("1"));
    EXPECT_FALSE(isValidURLRequest("1 www.com"));
}


// different spaces between the argumnets
TEST(isValidURLRequest, inValidInput2) 
{
    EXPECT_FALSE(isValidURLRequest("2www.example.com"));
    EXPECT_TRUE(isValidURLRequest("1        www.example.com"));    
}

// spaces in the URL
TEST(isValidURLRequest, inValidInput3) 
{
    EXPECT_FALSE(isValidURLRequest("1 w ww.example.com"));
    EXPECT_FALSE(isValidURLRequest("1 ww w.example.com"));
    EXPECT_FALSE(isValidURLRequest("2 www .example.com"));
    EXPECT_FALSE(isValidURLRequest("2 www. example.com"));
    EXPECT_FALSE(isValidURLRequest("2 www.exam ple.com"));
    EXPECT_FALSE(isValidURLRequest("2 www.example .com"));
    EXPECT_FALSE(isValidURLRequest("1 www.example. com"));
    EXPECT_FALSE(isValidURLRequest("1 www.example.c om"));
    EXPECT_FALSE(isValidURLRequest("2 www.example.co m"));
}

// invalid chars in URL
TEST(isValidURLRequest, inValidInput4) 
{
    EXPECT_FALSE(isValidURLRequest("2,www.example.com"));
    EXPECT_FALSE(isValidURLRequest("2 w1ww.example.com"));
    EXPECT_FALSE(isValidURLRequest("1 www,example.com"));
    EXPECT_FALSE(isValidURLRequest("1 www.example:com"));
    EXPECT_FALSE(isValidURLRequest("2 www.ex'ample.com"));
    EXPECT_FALSE(isValidURLRequest("2 www.example.co;m"));
    EXPECT_FALSE(isValidURLRequest("2 www.example.co6m"));
    EXPECT_FALSE(isValidURLRequest("2 w?ww.example.com"));
    EXPECT_FALSE(isValidURLRequest("2 www..example.com"));
    EXPECT_FALSE(isValidURLRequest("1 www.example..com"));
    EXPECT_FALSE(isValidURLRequest("1 .www.example.com"));
    EXPECT_FALSE(isValidURLRequest("1 www.example.com."));
}

// upper cases in URL
TEST(isValidURLRequest, inValidInput5) 
{
    EXPECT_FALSE(isValidURLRequest("2 WWW.EXAMPLE.COM"));
    EXPECT_FALSE(isValidURLRequest("1 WWw.example.com"));
    EXPECT_TRUE(isValidURLRequest("2 www.exAamWple.com"));
}


int main(int argc, char **argv) 
{
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}



