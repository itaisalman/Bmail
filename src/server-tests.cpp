#include <gtest/gtest.h>
#include <sys/socket.h>
#include <arpa/inet.h>
#include <cstring>
#include <string>
#include <unistd.h>

#define PORT 8080

using namespace std;

int shared_socket;
char shared_buffer[1024];

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

TEST(ServerTest, SingleClientPostRequest)
{
    shared_socket = createDemoClient("127.0.0.1", PORT);
    ASSERT_NE(shared_socket, -1) << "Failed to connect to server";

    const char *message = "POST www.example.com";
    ASSERT_GT(send(shared_socket, message, strlen(message), 0), 0) << "Failed to send message";

    memset(shared_buffer, 0, sizeof(shared_buffer));
    ssize_t bytesRead = read(shared_socket, shared_buffer, sizeof(shared_buffer) - 1);
    ASSERT_GT(bytesRead, 0) << "No response from server";

    string response(shared_buffer);
    EXPECT_EQ(response, "201 Created");

    message = "GET www.example.com";
    send(shared_socket, message, strlen(message), 0);
    memset(shared_buffer, 0, sizeof(shared_buffer));
    read(shared_socket, shared_buffer, 1024);
    EXPECT_EQ(string(shared_buffer), "200 Ok\n\ntrue true");

    message = "GET www.example.com0";
    send(shared_socket, message, strlen(message), 0);
    memset(shared_buffer, 0, sizeof(shared_buffer));
    read(shared_socket, shared_buffer, 1024);
    EXPECT_EQ(string(shared_buffer), "200 Ok\n\nfalse");

    message = "POST www.example.com";
    send(shared_socket, message, strlen(message), 0);
    memset(shared_buffer, 0, sizeof(shared_buffer));
    read(shared_socket, shared_buffer, 1024);
    EXPECT_EQ(string(shared_buffer), "201 Created");

    message = "DELETE www.example.com";
    send(shared_socket, message, strlen(message), 0);
    memset(shared_buffer, 0, sizeof(shared_buffer));
    read(shared_socket, shared_buffer, 1024);
    EXPECT_EQ(string(shared_buffer), "204 No Content");

    message = "DELETE www.example.com1";
    send(shared_socket, message, strlen(message), 0);
    memset(shared_buffer, 0, sizeof(shared_buffer));
    read(shared_socket, shared_buffer, 1024);
    EXPECT_EQ(string(shared_buffer), "404 Not Found");

    message = "DELETE www.example.com";
    send(shared_socket, message, strlen(message), 0);
    memset(shared_buffer, 0, sizeof(shared_buffer));
    read(shared_socket, shared_buffer, 1024);
    EXPECT_EQ(string(shared_buffer), "404 Not Found");

    const char *bad_messages[] = {
        "DELETE wwwww.example.com",
        "DELETEEE www.example.com",
        "DELETEwww.example.com",
        "www.example.com DELETE"};

    for (const char *bad : bad_messages)
    {
        send(shared_socket, bad, strlen(bad), 0);
        memset(shared_buffer, 0, sizeof(shared_buffer));
        read(shared_socket, shared_buffer, 1024);
        EXPECT_EQ(string(shared_buffer), "400 Bad Request");
    }

    close(shared_socket);
}