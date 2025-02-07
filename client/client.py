import socket
import sys  # To capture command-line arguments

def validate_input(destIp, destPort):
    """
    Validates the provided IP address/hostname and port number.
    Raises ValueError if invalid.
    """
    # Check if the port is an integer and in a valid range
    try:
        port = int(destPort)
        if not (0 < port < 65536):
            raise ValueError("Port number must be between 1 and 65535.")
    except ValueError:
        raise ValueError("Invalid port number.")

    # Validate IP/hostname resolution
    try:
        socket.gethostbyname(destIp)
    except socket.gaierror:
        raise ValueError(f"Invalid IP or hostname: {destIp}")

    """
    Connects to the server at the specified IP and port,
    sends commands entered by the user, and displays responses from the server.
    """
def run_client(destIp, destPort):
    client_socket = None  # Initialize the socket variable
    try:
        # Validate input before creating the socket
        validate_input(destIp, destPort)

        # Create a TCP socket
        client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

        # Connect to the server
        client_socket.connect((destIp, int(destPort)))

        # Main loop to read user input, send commands, and receive responses
        while True:
            command = input()

            if not command:
                continue  # Ignore empty input

            # Send the command to the server
            client_socket.sendall(command.encode('utf-8'))

            # Wait for the server response
            response = client_socket.recv(4096)
            if not response:
                break

            # Print the server response
            print(response.decode('utf-8'))

    except ValueError as ve:
        print(f"Input error: {ve}")
    except socket.gaierror:
        print("Unable to resolve server address.")
    except ConnectionError as e:
        print(f"Connection error: {e}")
    except KeyboardInterrupt:
        print("\nClient interrupted. Sending disconnect message.")
        try:
            if client_socket:
                client_socket.sendall(b"DISCONNECT")
        except:
            pass

    finally:
        # Only close the socket if it was created
        if client_socket:
            client_socket.close()

if __name__ == "__main__":
    # Ensure correct number of arguments are provided
    if len(sys.argv) != 3:
        print("Usage: python client.py <serverIP> <serverPort>")
        sys.exit(1)

    # Parse command-line arguments
    SERVER_HOST = sys.argv[1]  # First argument: server IP/hostname
    SERVER_PORT = sys.argv[2]  # Second argument: server port

    # Run the client
    run_client(SERVER_HOST, SERVER_PORT)
