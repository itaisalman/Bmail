#include "Input.h"
#include <sstream>
#include <string>
#include <vector>
#include <cctype>
#include <regex>

using namespace std;

// A function that checks if the initial input is valid.
pair<bool, pair<int, vector<int>>> checkInitInput(string input)
{
    vector<int> hashFunctions;
    int filterSize = 0;

    if (input.empty())
        return {false, {0, hashFunctions}};

    // Checks if the input contains a line break
    for (char c : input)
    {
        if (c == '\n')
            return {false, {0, hashFunctions}};
    }

    // Breaks the input by spaces and stores each part in tokens
    istringstream iss(input);
    string token;
    vector<string> tokens;

    // Splits the string into individual numbers
    while (iss >> token)
    {
        tokens.push_back(token);
    }
    // At least two numbers
    if (tokens.size() < 2)
    {
        return {false, {0, hashFunctions}};
    }

    for (size_t i = 0; i < tokens.size(); ++i)
    {
        const string &temp = tokens[i];
        for (char c : temp)
        {
            // Check each temp character in each token is a digit
            if (!isdigit(c))
                return {false, {0, hashFunctions}};
        }

        // Stoll converts to integer, if negative - false
        long long val = stoll(temp);
        if (val <= 0)
            return {false, {0, hashFunctions}};

        if (i == 0)
            // The first number for the array size
            filterSize = static_cast<int>(val);
        else
            // All other numbers go to
            hashFunctions.push_back(static_cast<int>(val));
    }
    return {true, {filterSize, hashFunctions}};
}
// Function that checks whether the link command (URL) is valid
std::pair<int, std::string> isValidURLRequest(std::string input)
{

    istringstream iss(input);
    string command, url;

    // Breaks the input into a command (1 or 2) and a URL
    iss >> command >> url;

    // If one of them is empty – the input is invalid
    if (command.empty() || url.empty())
        return {0, ""};

    // Check that there are no more tokens beyond two
    string extra;
    if (iss >> extra)
        return {0, ""};

    // Only two commands are allowed.
    if (command != "1" && command != "2")
        return {0, ""};

    // Checking the validity of a URL using a regular expression
    regex url_regex(R"(^(https?:\/\/)?www\.[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+[0-9]*$)", regex_constants::icase);

    // If the URL does not match the template – rejected
    if (!regex_match(url, url_regex))
        return {0, ""};

    // Returns 1 if it is an addition, 2 if it is a test
    return (command == "1") ? std::make_pair(1, url) : std::make_pair(2, url);
}
