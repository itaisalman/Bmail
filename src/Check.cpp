#include "Check.h"
#include "BloomFilter.h"

// The Check class execution function – responsible for checking if URL is in the blacklist
std::string Check::execute(const std::string &url, BloomFilter &bf)
{
    std::string first_output_check = "200 Ok\n\n";
    std::string second_output_check = bf.checkUrl(url);
    std::string concated_output = first_output_check + second_output_check;
    return concated_output;
}
