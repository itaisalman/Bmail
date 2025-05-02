#include "Check.h"
#include "BloomFilter.h"
#include <iostream>
#include <sstream>

void Check::execute(const std::string &url, BloomFilter &bf)
{
    // Save the original output of std::cout
    std::streambuf *originalCout = std::cout.rdbuf();

    // Create a temporary stream to capture
    std::stringstream ss;
    std::cout.rdbuf(ss.rdbuf());

    bf.checkUrl(url);

    // Return std::cout to its normal state
    std::cout.rdbuf(originalCout);

    // Parse the output
    std::string outputStr = ss.str();

    if (outputStr == "true true\n")
    {
        output("200 Ok\n");
    }
    else
    {
        output("404 Not Found\n");
    }
}
