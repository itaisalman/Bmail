#ifndef STORAGE_H
#define STORAGE_H
#include <string>
#include <vector>
#include <fstream>
#include <iostream>
#include "BloomFilter.h"

std::unordered_set<std::string> loadFromFile(const std::string &filename);
void saveToFile(std::string url, const std::string &file_path);
void deleteFromFile(std::string url, const std::string &file_path);

#endif