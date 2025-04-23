#include <gtest/gtest.h>
#include "input.h"

// sanity test
TEST(checkInitInput, ValidInput) {
    // regular inputs
    EXPECT_TRUE(checkInitInput("8 1"));   
    EXPECT_TRUE(checkInitInput("16 2 1"));
    EXPECT_TRUE(checkInitInput("100 2"));
}

// large numbers but still valid 
TEST(checkInitInput, ValidInput1) {
    EXPECT_TRUE(checkInitInput("100000000000 9"));
    EXPECT_TRUE(checkInitInput("100 20004235300"));
    EXPECT_TRUE(checkInitInput("356298693865 5462986 56438956"));
}

// wrong number of arguments
TEST(checkInitInput, InValidInput1) {
    EXPECT_FALSE(checkInitInput("-4"));
    EXPECT_FALSE(checkInitInput("x"));
    EXPECT_FALSE(checkInitInput("&"));
    EXPECT_FALSE(checkInitInput("88888"));
    EXPECT_FALSE(checkInitInput("x x x x x x x"));
    EXPECT_FALSE(checkInitInput("2 6 7 3 2 0"));
}

// chars instead of numbers
TEST(checkInitInput, InValidInput2) {
    EXPECT_FALSE(checkInitInput("X Y"));
    EXPECT_FALSE(checkInitInput("x y z"));
    EXPECT_FALSE(checkInitInput("e -1"));   
    EXPECT_FALSE(checkInitInput("& 4 -1"));   
    EXPECT_FALSE(checkInitInput("3 %"));
    EXPECT_FALSE(checkInitInput("2 -4 t"));
}

// negative numbers and zeroes
TEST(checkInitInput, InValidInput3) {
    EXPECT_FALSE(checkInitInput("0 1"));
    EXPECT_FALSE(checkInitInput("8 0"));
    EXPECT_FALSE(checkInitInput("16 1 0"));
    EXPECT_FALSE(checkInitInput("20 0 4"));
    EXPECT_FALSE(checkInitInput("-8 1"));
    EXPECT_FALSE(checkInitInput("100 -2"));   
    EXPECT_FALSE(checkInitInput("64 1 -2"));
    EXPECT_FALSE(checkInitInput("32 -3 2"));
}

// spaces, tabs, new lines etc..
TEST(checkInitInput, InValidInput4) {
    // too many spaces between the numbers
    EXPECT_TRUE(checkInitInput("100              1"));               
    EXPECT_TRUE(checkInitInput("   8  2"));              
    EXPECT_TRUE(checkInitInput("16 1           4"));              
    EXPECT_TRUE(checkInitInput("50 1       "));               
    EXPECT_TRUE(checkInitInput("55  1")); 
    EXPECT_TRUE(checkInitInput("            8  1  2"));               
             
    // different lines
    EXPECT_FALSE(checkInitInput("8\n1"));     
    EXPECT_FALSE(checkInitInput("16\n1 1")); 
    EXPECT_FALSE(checkInitInput("100 1\n4")); 
}         

// undecimal numbers
TEST(checkInitInput, InValidInput5) {
    EXPECT_FALSE(checkInitInput("8.5 1"));       
    EXPECT_FALSE(checkInitInput("100 0.5"));              
    EXPECT_FALSE(checkInitInput("8 1 2.5"));              
    EXPECT_FALSE(checkInitInput("20 1.5 3")); 
    EXPECT_FALSE(checkInitInput("20.7 8 0.1"));               
}    

int main(int argc, char **argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}

