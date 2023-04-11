all: client server attack

clean:
	rm -rf client_app
	rm -rf server_app
	rm -rf attack_app


client:
	g++ -o client_app ./client.cpp ./shared.hpp -std=c++17

server:
	g++ -o server_app ./server.cpp ./shared.hpp -std=c++17

attack:
	g++ -o attack_app ./attack.cpp ./shared.hpp -std=c++17