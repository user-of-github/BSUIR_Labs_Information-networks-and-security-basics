#include <stdio.h>
#include <ctime>
#include <string.h>
#include <sys/socket.h>
#include <netinet/ip.h>
#include "./shared.hpp"
#include <stdio.h>
#include <arpa/inet.h>
#include <unistd.h>
#include<cstdlib>

struct ipheader
{
  unsigned char iph_ihl: 4;
  unsigned char iph_ver: 4;
  unsigned char iph_tos;
  unsigned short int iph_len;
  unsigned short int iph_ident;
  unsigned short int iph_flag: 3;
  unsigned short int iph_offset: 13;
  unsigned char iph_ttl;
  unsigned char iph_protocol;
  unsigned short int iph_chksum;
  in_addr iph_sourceip;
  in_addr iph_destip;
};

struct tcpheader
{
  u_short tcp_sport;
  u_short tcp_dport;
  u_int tcp_seq;
  u_int tcp_ack;
  u_char tcp_offx2;
#define TH_OFF (th) (((th ) ->tcp_of fx2 & 0x f0 ) >> 4 )
  u_char tcp_flags;
#define TH_FIN 0x0l

#define TH SYN 0x02
#define TH_RST 0x04
#define TH_PUSH 0x08
#define TH_ACK 0x10
#define TH_URG 0x20
#define TH_ECE 0x40
#define TH_ CWR 0x80
#define TH_FLAGS (TH_FIN|TH_SYN|TH_RST|TH_ACK|TH_URG|TH_ECE|TH_CWR)
  u_short tcp_win;
  u_short tcp_sum;
  u_short tcp_urp;
};

unsigned short calculate_tcp_checksum(ipheader *ip);

void send_raw_ip_packet(ipheader *ip);

int main()
{
	char buffer[kBufferMaxSize];
	ipheader *ip{(ipheader *)buffer};
	tcpheader *tcp{(tcpheader *)(buffer + sizeof(ipheader))};

	srand(std::time(0)); // Initialize the seed for random # generation.

	while (true) {
		memset(buffer, 0, kBufferMaxSize);
		tcp->tcp_sum = calculate_tcp_checksum(ip);
		send_raw_ip_packet(ip);
	}

	return 0;
}

void send_raw_ip_packet(ipheader *ip)
{
	struct sockaddr_in dest_info;
	int enable = 1;
	// Step 1 : Create a raw network socket.
	int sock = socket(AF_INET, SOCK_RAW, IPPROTO_RAW);
	// Step 2 : Set socket option .
	setsockopt(sock, IPPROTO_IP, IP_HDRINCL, &enable, sizeof(enable));

	// Step 3 : Provide neede d informatio n a bout de stination .
	dest_info.sin_family = AF_INET;
	dest_info.sin_addr = ip->iph_destip;
	// Step 4 : Send the packet out .
	sendto(sock, ip, ntohs(ip->iph_len), 0, (sockaddr * ) & dest_info, sizeof(dest_info));
	close(sock);
}

struct pseudo_tcp
{
  unsigned saddr, daddr;
  unsigned char mbz;
  unsigned char ptcl;
  unsigned short tcpl;
  tcpheader tcp;
  char payload[1500];
};

unsigned short in_cksum(unsigned short *buf, int length)
{
	unsigned short *w = buf;
	int nleft = length;
	int sum = 0;
	unsigned short temp = 0;

	while (nleft > 1) {
		sum += *w++;
		nleft -= 2;
	}

	if (nleft == 1) {
		*(u_char * )(&temp) = *(u_char *)w;
		sum += temp;
	}

	sum = (sum >> 16) + (sum & 0xffff); // add hi 16 to low 16
	sum += (sum >> 16); // add carry
	return (unsigned short)(~sum);
}

unsigned short calculate_tcp_checksum(ipheader *ip)
{
	tcpheader *tcp = (tcpheader *)((u_char *)ip + sizeof(ipheader));

	int tcp_len = ntohs(ip->iph_len) - sizeof(ipheader);

	pseudo_tcp p_tcp;
	memset(&p_tcp, 0x0, sizeof(struct pseudo_tcp));
	p_tcp.saddr = ip->iph_sourceip.s_addr;
	p_tcp.daddr = ip->iph_destip.s_addr;
	p_tcp.mbz = 0;
	p_tcp.ptcl = IPPROTO_TCP;
	p_tcp.tcpl = htons(tcp_len);

	memcpy(&p_tcp.tcp, tcp, tcp_len);

	return (unsigned short)in_cksum((unsigned short *)&p_tcp, tcp_len + 12);
}

