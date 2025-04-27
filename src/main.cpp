#include "BloomFilter.h"
#include "Input.h"
#include "Storage.h"
#include <iostream>
#include <vector>

using namespace std;

// Loading the blacklist from the given file to an unordered set, then copying it into the blacklist.
void loadBlacklistFromFile(BloomFilter &bf, const string &filename)
{
    unordered_set<string> loaded_set = loadFromFile(filename);
    bf.setBlacklist(loaded_set);
}

int main(int argc, char const *argv[])
{
    // Check the first input (the one that initialize the BloomFilter).
    // Asking for it until the user provide fitted input.
    string input;
    pair<bool, pair<int, vector<int>>> parsed_input;
    do
    {
        std::getline(std::cin, input);
        parsed_input = checkInitInput(input);
    } while (!parsed_input.first);
    // Initializing our BloomFilter
    int array_size = parsed_input.second.first;
    vector<int> initialize_filter = parsed_input.second.second;
    BloomFilter our_filter(array_size, initialize_filter);
    const string file_name = "/app/data/Blacklist.txt";
    // Loading the blacklist from the given file.
    loadBlacklistFromFile(our_filter, file_name);
    std::unordered_set<std::string> set = our_filter.getBlacklist();
    while (true)
    {
        std::getline(std::cin, input);
        // cout << input << endl;
        pair<int, string> input_pair = isValidURLRequest(input);
        switch (input_pair.first)
        {
        // Adding the given URL to our blacklist.
        case 1:
            our_filter.addUrl(input_pair.second);
            saveToFile(input_pair.second, file_name);
            continue;
            // Checking if the URL given exists in our blacklist.
        case 2:
            our_filter.checkUrl(input_pair.second);
            continue;
        // No valid key inserted.
        default:
            continue;
        }
    }
}
