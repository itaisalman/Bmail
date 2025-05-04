import socket
import sys

def main():
    # Check for getting exactly 2 command line arguments(IP and port).
    if len(sys.argv) != 3:
        print("Expecting exactly 2 arguments: IP and port\n")
        return

    # Declare server IP and port.
    server_ip = sys.argv[1]
    server_port = int(sys.argv[2])

    sock = None
    # Try create connection and handle with failure and unordered exit.
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.connect((server_ip, server_port))
        print("Connected to server.")
        
        # Loop for communicating with server.
        while True:
            msg = input("Enter your request: ")
            sock.sendall(msg.encode('utf-8'))
            data = sock.recv(4096)
            print("Server sent:", data.decode('utf-8'))

    # Handle with termination.
    except KeyboardInterrupt:
        print("\nClient terminated with keyboard interrupt (Ctrl+C).")

    # Handle with errors like connection failure.
    except Exception as e:
        print(f"An error occurred: {e}")
        
    # Performs graceful exit if the socket is still open
    finally:
        if sock:
            try:
                sock.close()
                print("Socket closed.")
            except Exception as close_error:
                print(f"Failed to close socket: {close_error}")

if __name__ == "__main__":
    main()
