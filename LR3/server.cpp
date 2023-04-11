#include <stdio.h>
#include <string.h>
#include <netinet/ip.h>
#include <unistd.h>
#include <sys/socket.h>
#include <arpa/inet.h>


int main()
{
	sockaddr_in my_addr {};
	sockaddr_in client_addr {};
	char buffer[100];

	// socket itself
	const auto socket_file_descriptor {socket(AF_INET, SOCK_STREAM, 0)};

	// bind to a port number
	memset(&my_addr, 0, sizeof(struct sockaddr_in));
	my_addr.sin_family = AF_INET;
	my_addr.sin_port = htons(9000);
	bind(socket_file_descriptor, (struct sockaddr *)&my_addr, sizeof(struct sockaddr_in));
	// Step 3: Listen for connections
	listen(socket_file_descriptor, 5);

	const auto client_len {sizeof(client_addr)};

	while (true) {
		const auto new_socket_file_descriptor {accept(socket_file_descriptor, (struct sockaddr *)&client_addr,(socklen_t  *)&client_len)};

		if (fork() == 0) { // The child process ➀
			close (socket_file_descriptor);
			// Read data.
			memset(buffer, 0, sizeof(buffer));
			int len = read(new_socket_file_descriptor, buffer, 100);
			printf("Received %d bytes.\n%s\n", len, buffer);
			close (new_socket_file_descriptor);
			return 0;
		} else { // The parent process
			close (new_socket_file_descriptor);
		}
	}
	return 0;
}