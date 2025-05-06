#include <iostream>
#include <sys/socket.h>
#include <stdio.h>
#include <netinet/in.h>
#include <unistd.h>
#include <string.h>

int main(int argc, char const *argv[])
{
    // Check num of arguments
    if (argc != 2)
    {
        std::cerr << "Usage: " << argv[0] << " <port>" << std::endl;
    }
    // As required in the exercise, the port the server is listening
    // on will be passed as a parameter to the program

    // Converting a string to int
    int server_port = std::stoi(argv[1]);

    // Create a TCP socket
    int sock = socket(AF_INET, SOCK_STREAM, 0);
    if (sock < 0)
    {
        perror("error creating socket");
    }

    // Set the server address
    struct sockaddr_in sin;
    memset(&sin, 0, sizeof(sin));
    sin.sin_family = AF_INET;
    sin.sin_addr.s_addr = INADDR_ANY;
    sin.sin_port = htons(server_port);

    // Bind between the socket and the address
    if (bind(sock, (struct sockaddr *)&sin, sizeof(sin)) < 0)
    {
        // Print error if bind fails
        perror("error binding socket");
    }
    // Start listening on the socket
    if (listen(sock, 5) < 0)
    {
        perror("error listening to a socket");
    }

    return 0;
}