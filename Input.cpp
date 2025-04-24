#include "input.h"
#include <sstream>
#include <string>
#include <vector>
#include <cctype>
#include <regex>

using namespace std;

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
