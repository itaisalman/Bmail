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

    for (char c : input)
    {
        if (c == '\n')
            return false;
    }

    istringstream iss(input);
    string token;
    vector<string> tokens;

    // Splits the string into individual numbers
    while (iss >> token)
    {
        tokens.push_back(token);
    }
    // Allow only 2 or 3 numbers
    if (tokens.size() < 2 || tokens.size() > 3)
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
