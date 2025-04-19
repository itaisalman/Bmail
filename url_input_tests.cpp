#include <gtest/gtest.h>
#include <url_input.h>

// sanity test
TEST(isValidInput, ValidInput) {
    // regular inputs
    EXPECT_TRUE(isValidInput("1 www.example.com"));   
    EXPECT_TRUE(isValidInput("2 www.example.com"));
}

// a bit different URL's but still valid
TEST(isValidInput, ValidInput1) {
    EXPECT_TRUE(isValidInput("1 www.example34278.com"));
    EXPECT_TRUE(isValidInput("1 www.342sf78example.com"));
    EXPECT_TRUE(isValidInput("2 www.exampleexample.com"));
    EXPECT_TRUE(isValidInput("2 www.example4637example.com"));
}

// long but valid URL's
TEST(isValidInput, ValidInput2) {
    EXPECT_TRUE(isValidInput("1 www.fndkjfnkjdvsjvdkvnldnvnsckllkbkjexample34278.com"));
    EXPECT_TRUE(isValidInput("2 www.fbejfnmvllknvjdfbkgdlml436743784mmkfmkmfkmkfdfd28472vj.com"));
}

// different numbers for first argumnet
TEST(isValidInput, inValidInput) {
    EXPECT_FALSE(isValidInput("3 www.example.com"));
    EXPECT_FALSE(isValidInput("0 www.example.com"));
    EXPECT_FALSe(isValidInput("11 www.example.com"));
    EXPECT_FALSe(isValidInput("222 www.example.com"));
    EXPECT_FALSe(isValidInput("# www.example.com"));
    EXPECT_FALSe(isValidInput("' www.example.com"));
}

// different order/number of argumnets
TEST(isValidInput, inValidInput1) {
    EXPECT_FALSE(isValidInput("www.example.com"));
    EXPECT_FALSE(isValidInput("www.example.com 2"));
    EXPECT_FALSe(isValidInput("1"));
    EXPECT_FALSe(isValidInput("1 www.com"));
}


// different spaces between the argumnets
TEST(isValidInput, inValidInput2) {
    EXPECT_FALSE(isValidInput("1www.example.com"));
    EXPECT_FALSE(isValidInput("2www.example.com"));
    EXPECT_FALSe(isValidInput("1  www.example.com"));
}

// spaces in the URL
TEST(isValidInput, inValidInput3) {
    EXPECT_FALSE(isValidInput("1 w ww.example.com"));
    EXPECT_FALSE(isValidInput("1 ww w.example.com"));
    EXPECT_FALSE(isValidInput("2 www .example.com"));
    EXPECT_FALSe(isValidInput("2 www. example.com"));
    EXPECT_FALSe(isValidInput("2 www.exam ple.com"));
    EXPECT_FALSe(isValidInput("2 www.example .com"));
    EXPECT_FALSe(isValidInput("1 www.example. com"));
    EXPECT_FALSe(isValidInput("1 www.example.c om"));
    EXPECT_FALSe(isValidInput("2 www.example.co m"));
}

// invalid chars in URL
TEST(isValidInput, inValidInput4) {
    EXPECT_FALSe(isValidInput("2,www.example.com"));
    EXPECT_FALSe(isValidInput("2 w1ww.example.com"));
    EXPECT_FALSE(isValidInput("1 www,example.com"));
    EXPECT_FALSE(isValidInput("1 www.example:com"));
    EXPECT_FALSE(isValidInput("2 www.ex'ample.com"));
    EXPECT_FALSe(isValidInput("2 www.example.co;m"));
    EXPECT_FALSe(isValidInput("2 www.example.co6m"));
    EXPECT_FALSe(isValidInput("2 w?ww.example.com"));
    EXPECT_FALSe(isValidInput("2 www..example.com"));
    EXPECT_FALSe(isValidInput("1 www.example..com"));
    EXPECT_FALSe(isValidInput("1 .www.example.com"));
    EXPECT_FALSe(isValidInput("1 www.example.com."));
}

// upper cases in URL
TEST(isValidInput, inValidInput5) {
    EXPECT_FALSe(isValidInput("2 WWW.EXAMPLE.COM"));
    EXPECT_FALSe(isValidInput("1 WWw.example.com"));
    EXPECT_FALSE(isValidInput("1 www.example.cOm"));
    EXPECT_FALSE(isValidInput("2 www.exAamWple.com"));
}


int main(int argc, char **argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}



