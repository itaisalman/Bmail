import socket
import sys

def main():
    if len(sys.argv) != 3:
        print("Usage: python client.py <server_ip> <port>")
        return

    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_ip = sys.argv[1]
    server_port = int(sys.argv[2])
    sock.connect((server_ip, server_port))

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