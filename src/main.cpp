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
    const string file_name = "../data/Blacklist.txt";
    // Loading the blacklist from the given file.
    loadBlacklistFromFile(our_filter, file_name);
}
