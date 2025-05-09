import socket
import sys

def main():
    # Check for getting exactly 2 command line arguments(IP and port).
    if len(sys.argv) != 3:
        return

    # Declare server IP and port.
    server_ip = sys.argv[1]
    server_port = int(sys.argv[2])

    sock = None
    # Try create connection and handle with failure and unordered exit.
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.connect((server_ip, server_port))
        
        # Loop for communicating with server.
        while True:
            msg = input()
            # Sends newline in case of empty string was accepted from user.
            if msg == '':
                msg = '\n'
            sock.send(bytes(msg, 'utf-8'))
            data = sock.recv(4096)
            print(data.decode('utf-8'))

    # Handle with termination.
    except KeyboardInterrupt:
        exit

    # Handle with errors like connection failure.
    except Exception as e:
        exit

    # Performs graceful exit if the socket is still open
    finally:
        if sock:
            try:
                sock.close()
            except Exception as close_error:
                exit

if __name__ == "__main__":
    main()
