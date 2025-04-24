#include "input.h"
#include <sstream>
#include <string>
#include <vector>
#include <cctype>
#include <regex>

using namespace std;

// A function that checks if the initial input is valid.
bool checkInitInput(string input)
{
    if (input.empty())
        return false;

    // Checks if the input contains a line break
    for (char c : input)
    {
        if (c == '\n')
            return false;
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
        return false;
    }
    // Check each token is a positive integer
    for (string &temp : tokens)
    {
        for (char c : temp)
        {
            if (!isdigit(c))
                return false;
        }
        if (stoll(temp) <= 0)
            return false;
    }
    return true;
}
// Function that checks whether the link command (URL) is valid
int isValidURLRequest(string input)
{

    istringstream iss(input);
    string command, url;

    // Breaks the input into a command (1 or 2) and a URL
    iss >> command >> url;

    // If one of them is empty – the input is invalid
    if (command.empty() || url.empty())
        return 0;

    // Check that there are no more tokens beyond two
    string extra;
    if (iss >> extra)
        return 0;

    // Checking the validity of a URL using a regular expression
    if (command != "1" && command != "2")
        return 0;

    regex url_regex("^www\\.([a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,}[0-9]*$");

    // If the URL does not match the template – rejected
    if (!regex_match(url, url_regex))
        return 0;

    // Returns 1 if it is an addition, 2 if it is a test
    return (command == "1") ? 1 : 2;
}
