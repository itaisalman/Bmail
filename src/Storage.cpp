#include "Storage.h"

// Loads lines from a file into an unordered set of strings
std::unordered_set<std::string> loadFromFile(const std::string &filename)
{
    std::unordered_set<std::string> loaded_url_set;
    // Defines an object to read a file and attempts to open it
    std::ifstream in(filename);
    std::string url;
    // Read the file line by line
    while (std::getline(in, url))
    {
        loaded_url_set.insert(url);
    }
    return loaded_url_set;
}

// Save to file the URL if doesn't exist
void saveToFile(std::string url, const std::string &file_path)
{
    // Open the file in read mode to check if the URL already exists
    std::ifstream in_file(file_path);
    std::string line;
    // Loop through each line in the file
    while (std::getline(in_file, line))
    {
        // If the URL is already in the file, exit the function early
        if (line == url)
        {
            return;
        }
    }
    in_file.close();
    // Open the file in append mode to add the URL at the end if it was not found
    std::ofstream out_file(file_path, std::ios::app);
    // Check if the file was opened successfully for writing
    if (!out_file.is_open())
    {
        std::cerr << "Failed to open file for writing: " << file_path << std::endl;
        return;
    }
    // Write the URL to the file, followed by a newline character
    out_file << url << '\n';
    out_file.close();
}

void deleteFromFile(std::string url, const std::string &file_path)
{
    // Open the file for reading.
    std::ifstream in_file(file_path);
    if (!in_file.is_open())
    {
        std::cerr << "Failed to open file for reading: " << file_path << std::endl;
        return;
    }
    std::string line;
    std::vector<std::string> list;
    // Loop through each line in the file
    while (std::getline(in_file, line))
    {
        // Save all the URL's except the one we want to delete.
        if (line != url)
        {
            list.push_back(line);
        }
    }
    in_file.close();

    // Open again the file for writing.
    std::ofstream out_file(file_path, std::ios::trunc);
    if (!out_file.is_open())
    {
        std::cerr << "Failed to open file for writing: " << file_path << std::endl;
        return;
    }

    // Write over the file all of the URL's without the one we skipped on.
    for (std::string file_line : list)
    {
        out_file << file_line << '\n';
    }
    out_file.close();
}