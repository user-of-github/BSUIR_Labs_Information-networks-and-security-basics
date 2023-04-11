#include <cstring>
#include <iostream>
#include <netinet/ip.h>
#include <unistd.h>
#include <sys/socket.h>
#include <arpa/inet.h>
#include "./shared.hpp"


int main()
{
	sockaddr_in my_addr{};
	sockaddr_in client_addr{};
	char buffer[kBufferMaxSize];

	// socket itself
	const auto socket_file_descriptor{socket(AF_INET, SOCK_STREAM, kTcpProtocolValue)};

	// bind to a port number
	memset(&my_addr, 0, sizeof(struct sockaddr_in));
	my_addr.sin_family = AF_INET;
	my_addr.sin_port = htons(kPort);
	bind(socket_file_descriptor, (struct sockaddr *)&my_addr, sizeof(struct sockaddr_in));

	// listening for connections
	listen(socket_file_descriptor, 5);

	const auto client_len{sizeof(client_addr)};

	while (true) {
		const auto new_socket_file_descriptor{
			accept(
				socket_file_descriptor,
				(struct sockaddr *)&client_addr,
				(socklen_t * ) & client_len
			)
		};

		if (const auto process_id{fork()}; process_id == 0) {
			// 0 <==> child (new) process
			close(socket_file_descriptor);

			// Read data.
			memset(buffer, 0, sizeof(buffer));
			const auto received_data_length{read(new_socket_file_descriptor, buffer, kBufferMaxSize)};

			std::cout << "Received " << received_data_length << " bytes" << '\n';
			std::cout << "Message received : " << '\n' << "{" << '\n' << buffer << "}" << '\n' << '\n';

			close(new_socket_file_descriptor);

			return 0;
		} else {
			// not 0 <==> parent (source) process
			close(new_socket_file_descriptor);
		}
	}

	return 0;
}