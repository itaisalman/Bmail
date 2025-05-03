import socket
import sys

def main():
    # Check for getting exactly 2 command line arguments(IP and port).
    if len(sys.argv) != 3:
        print("Usage: python client.py <server_ip> <port>")
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

    # Loop that gets request from user, sends it to server and recieves back response.
    msg = input("Message to send (quit for exit): ")
    while not msg == 'quit':
        sock.send(bytes(msg, 'utf-8'))
        data = sock.recv(4096)
        print("Server sent: ", data.decode('utf-8'))
        msg = input("Message to send (quit for exit): ")

    sock.close()

# Call for main
if __name__ == "__main__":
    main()