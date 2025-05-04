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

// Test the connection to the server
TEST(ServerTests, ConnectionTest)
{
    // Create client
    int client_socket = createDemoClient("127.0.0.1", 8080);
    ASSERT_GE(client_socket, 0) << "Socket creation or connection failed";
    close(client_socket);
}

// Test how the server handles various of valid inputs
TEST(ServerTests, ExpectedOutput)
{
    // Create client
    int client_socket = createDemoClient("127.0.0.1", 8080);
    ASSERT_GE(client_socket, 0) << "Socket creation or connection failed";
    // Send messages to server and see how he handles them
    char buffer[1024] = {0};
    // Check if handle addition of non-existing URL to the blacklist correctly
    const char *message = "POST www.example.com";
    send(client_socket, message, strlen(message), 0);
    read(client_socket, buffer, 1024);
    EXPECT_EQ(buffer, "201 Created\n");
    // Check if handle GET command on an existing URL correctly
    memset(buffer, 0, sizeof(buffer));
    message = "GET www.example.com";
    send(client_socket, message, strlen(message), 0);
    read(client_socket, buffer, 1024);
    EXPECT_EQ(buffer, "200 Ok\n");
    // Check if handle GET command on non-existing URL correctly
    memset(buffer, 0, sizeof(buffer));
    message = "GET www.example.com0";
    send(client_socket, message, strlen(message), 0);
    read(client_socket, buffer, 1024);
    EXPECT_EQ(buffer, "404 Not Found\n");
    // Check if handle Add command on existing URL correctly
    memset(buffer, 0, sizeof(buffer));
    message = "POST www.example.com";
    send(client_socket, message, strlen(message), 0);
    read(client_socket, buffer, 1024);
    EXPECT_EQ(buffer, "201 Created\n");
    // Check if handle Delete command on existing URL correctly
    memset(buffer, 0, sizeof(buffer));
    message = "DELETE www.example.com";
    send(client_socket, message, strlen(message), 0);
    read(client_socket, buffer, 1024);
    EXPECT_EQ(buffer, "204 No Content\n");
    // Check if handle Delete command on non-existing URL correctly
    memset(buffer, 0, sizeof(buffer));
    message = "DELETE www.example.com1";
    send(client_socket, message, strlen(message), 0);
    read(client_socket, buffer, 1024);
    EXPECT_EQ(buffer, "404 Not Found\n");
}

// Test how the server handles various of invalid inputs
TEST(ServerTests, edgeCasesOutput)
{
    // Create client
    int client_socket = createDemoClient("127.0.0.1", 8080);
    ASSERT_GE(client_socket, 0) << "Socket creation or connection failed";
    // Send messages to server and see how he handles them
    char buffer[1024] = {0};
    // Check if handle Delte command on an empty blacklist
    const char *message = "DELETE www.example.com";
    send(client_socket, message, strlen(message), 0);
    read(client_socket, buffer, 1024);
    EXPECT_EQ(buffer, "404 Not Found\n");
    // Check if handle undefined commands correctly
    memset(buffer, 0, sizeof(buffer));
    message = "DELETE wwwww.example.com";
    send(client_socket, message, strlen(message), 0);
    read(client_socket, buffer, 1024);
    EXPECT_EQ(buffer, "400 Bad Request\n");
    memset(buffer, 0, sizeof(buffer));
    message = "DELETEEE www.example.com";
    send(client_socket, message, strlen(message), 0);
    read(client_socket, buffer, 1024);
    EXPECT_EQ(buffer, "400 Bad Request\n");
    memset(buffer, 0, sizeof(buffer));
    message = "DELETEwww.example.com";
    send(client_socket, message, strlen(message), 0);
    read(client_socket, buffer, 1024);
    EXPECT_EQ(buffer, "400 Bad Request\n");
    memset(buffer, 0, sizeof(buffer));
    message = "www.example.com DELETE";
    send(client_socket, message, strlen(message), 0);
    read(client_socket, buffer, 1024);
    EXPECT_EQ(buffer, "400 Bad Request\n");
}
