#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <netinet/in.h>
#include <sys/socket.h>
#include <arpa/inet.h>
#include <unistd.h>
#include "./shared.hpp"


int main()
{
	// Step 1: Create a socket
	const auto socket_file_descriptor{socket(AF_INET, SOCK_STREAM, kTcpProtocolValue)};

	// Step 2: Set the destination information
	struct sockaddr_in dest;
	memset(&dest, 0, sizeof(struct sockaddr_in));
	dest.sin_family = AF_INET;
	dest.sin_addr.s_addr = inet_addr(kLocalHostIpOnCurrentMachine);
	dest.sin_port = htons(kPort);

	// Step 3: Connect to the server
	connect(socket_file_descriptor, (struct sockaddr *)&dest, sizeof(struct sockaddr_in));

	// Step 4: Send data to the server
	const char *buffer1 = "Hello Server!\n";
	const char *buffer2 = "Hello Again!\n";
	write(socket_file_descriptor, buffer1, strlen(buffer1));
	write(socket_file_descriptor, buffer2, strlen(buffer2));

	// Step 5: Close the connection
	close(socket_file_descriptor);

	return 0;
}