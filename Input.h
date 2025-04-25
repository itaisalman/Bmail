#ifndef INPUT_H
#define INPUT_H
#include <string>
#include <vector>

std::pair<bool, std::pair<int, std::vector<int>>> checkInitInput(std::string input);
std::pair<int, std::string> isValidURLRequest(std::string input);

#endif
