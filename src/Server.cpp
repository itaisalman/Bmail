#include <iostream>
#include <sys/socket.h>
#include <stdio.h>
#include <netinet/in.h>
#include <unistd.h>
#include <string.h>
#include "Input.h"
#include "BloomFilter.h"
#include <unordered_map>
#include <memory>
#include "Command.h"
#include "Storage.h"
#include <sstream>
#include "Add.h"
#include "Check.h"
#include "Delete.h"

using namespace std;

// Recieves output string and wanted socket, and send the output via socket.
void output(const std::string output, int client_socket)
{
    int sent_bytes = send(client_socket, output.c_str(), output.length(), 0);
    if (sent_bytes < 0)
    {
        exit(1);
    }
}

// Loading the blacklist from the given file to an unordered set, then copying it into the blacklist.
void loadBlacklistFromFile(BloomFilter &bf, const string &filename)
{
    unordered_set<string> loaded_set = loadFromFile(filename);
    for (string url : loaded_set)
    {
        bf.addUrl(url);
    }
}

// Uses the input to init the bloomfilter. Returns null if input isnt valid.
BloomFilter *initBloomFilter(string input)
{
    pair<bool, pair<int, vector<int>>> parsed_input = checkInitInput(input);
    if (!parsed_input.first)
    {
        return nullptr;
    }

    int array_size = parsed_input.second.first;
    vector<int> initialize_filter = parsed_input.second.second;
    BloomFilter *our_filter = new BloomFilter(array_size, initialize_filter);
    loadBlacklistFromFile(*our_filter, our_filter->getFilePath());
    return our_filter;
}

// Extract the arguments from the command line and convert them to a string.
// If number of arguments is invalid, returns empty string.
string handleArgs(int argc, char const *argv[])
{
    // Check num of arguments
    if (argc < 4)
    {
        return "";
    }
    int server_port = stoi(argv[1]);
    if (server_port < 1024 || server_port > 65535)
    {
        exit(1);
    }

    // Parsing the arguments
    ostringstream BloomFilter_parameters;
    for (int i = 2; i < argc; i++)
    {
        BloomFilter_parameters << argv[i] << ' ';
    }
    return BloomFilter_parameters.str();
}

// Builds a map that links command names like "POST" to their corresponding Command object creators.
unordered_map<string, function<unique_ptr<Command>()>> createCommandFactory()
{
    return {
        {"POST", []
         { return make_unique<Add>(); }},
        {"GET", []
         { return make_unique<Check>(); }},
        {"DELETE", []
         { return make_unique<Delete>(); }}};
}

// Contains the loop of the communication with client. Reads from socket,
// performs the wanted functionality and sends back via socket to the client the output.
void handleClientLoop(int client_socket, const unordered_map<string, function<unique_ptr<Command>()>> &factory, BloomFilter *bf)
{
    char buffer[4096];
    int expected_data_len = sizeof(buffer);

    while (true)
    {
        int read_bytes = recv(client_socket, buffer, expected_data_len, 0);

        if (read_bytes == 0 || read_bytes < 0)
        {
            break;
        }
        // Extract the request and check if valid.
        pair<string, string> url_request_pair = isValidURLRequest(buffer);
        auto it = factory.find(url_request_pair.first);
        unique_ptr<Command> command;
        // If valid, executes the command and sends the output of it to the client.
        // If not, sends bad request output.
        if (it != factory.end())
        {
            command = it->second();
            output(command->execute(url_request_pair.second, *bf), client_socket);
        }
        else
        {
            output("400 Bad Request", client_socket);
        }
        memset(buffer, 0, sizeof(buffer));
    }
}

int main(int argc, char const *argv[])
{
    int server_port = stoi(argv[1]);
    string parameters_as_string = handleArgs(argc, argv);
    BloomFilter *our_filter = initBloomFilter(parameters_as_string);
    if (!our_filter)
    {
        return 0;
    }
    auto factory = createCommandFactory();

    // Creates the socket and listen on port that was given as an argument.
    int server_socket = socket(AF_INET, SOCK_STREAM, 0);
    if (server_socket < 0)
    {
        exit(1);
    }
    struct sockaddr_in sin;
    memset(&sin, 0, sizeof(sin));
    sin.sin_family = AF_INET;
    sin.sin_addr.s_addr = INADDR_ANY;
    sin.sin_port = htons(server_port);
    if (bind(server_socket, (struct sockaddr *)&sin, sizeof(sin)) < 0)
    {
        close(server_socket);
        exit(1);
    }
    if (listen(server_socket, 5) < 0)
    {
        close(server_socket);
        exit(1);
    }

    // Loop to keep server always running. Each iteration is for each connection.
    while (true)
    {
        struct sockaddr_in client_sin;
        unsigned int addr_len = sizeof(client_sin);
        int client_socket = accept(server_socket, (struct sockaddr *)&client_sin, &addr_len);
        if (client_socket < 0)
        {
            continue;
        }
        handleClientLoop(client_socket, factory, our_filter);
        close(client_socket);
    }
    close(server_socket);
    return 0;
}
