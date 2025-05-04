#include <gtest/gtest.h>
#include <sys/socket.h>
#include <arpa/inet.h>
#include <fstream>
#include "BloomFilter.h"
#include "Input.h"
#include "Storage.h"

#define PORT 8080
using namespace std;

int createDemoClient(const std::string &ip, int port)
{
    // Create socket
    int sock = socket(AF_INET, SOCK_STREAM, 0);
    if (sock < 0)
    {
        return -1;
    }
    // Specifying address
    sockaddr_in server_address;
    server_address.sin_family = AF_INET;
    server_address.sin_port = htons(port);

    // Convert IPv4 and IPv6 addresses from text to binary
    inet_pton(AF_INET, ip.c_str(), &server_address.sin_addr);

    // Connect to server
    if (connect(sock, (struct sockaddr *)&server_address, sizeof(server_address)) < 0)
    {
        close(sock);
        return -1;
    }

    return sock;
}

TEST(ServerTests, ConnectionTest)
{
    // Create client
    int client_socket = createDemoClient("127.0.0.1", 8080);
    ASSERT_GE(client_socket, 0) << "Socket creation or connection failed";
    close(client_socket);
}
