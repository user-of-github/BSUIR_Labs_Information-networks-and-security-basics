### _To create TCP listener:_  
`sudo apt-get install -y netcat`  
`nc -l <port>`  

### _To send some messages from client:_  
_Set port to `<port>` in `client.cpp`_  
`make client`  
`./client_app`  