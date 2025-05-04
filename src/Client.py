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

    # Try create connection and handle with failure.
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.connect((server_ip, server_port))
    except Exception as e:
        print(f"Connection failed: {e}")
        return

    sock.close()

# Call for main
if __name__ == "__main__":
    main()