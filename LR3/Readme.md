### _To create TCP listener:_  
`sudo apt-get install -y netcat`  
`nc -l <port>`  

### _To send some messages from client:_  
_Set port to `<port>` in `client.cpp`_  
`make client`  
`./client_app`  


____  
`sudo apt install net-tools`  
`sudo apt-get install netwox`  
`netstat -tna` _to see active internet connections (check with running `server_app` and without)_  
_We do not see any half-open connections. In normal situations, there should not be
many half-open connections._  

__
So run `netstat -tna` without `server_app` running. Ensure that there are no 0:0:0:0:9000 connections  
Run server `./server_app`  
Run again `netstat -tna` and check that there's one ESTABLISHED 0:0:0:0:9000  
Then run attack-tool: `sudo sysctl -w net.ipv4.tcp_syncookies=0`   
And check again `netstat -tna` - you will see that there appeared SYN_RECV values
