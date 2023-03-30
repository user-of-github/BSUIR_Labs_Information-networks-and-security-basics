import http from 'http'
import url from 'url'


const port: number = 4000

const identificatorsBase: string[] = ['user1',  'user2', 'user3']

const error: string = 'ERROR_AS'



const server = http.createServer((request, response): void => {
    const urlParts = url.parse(request.url!, true)

    if (urlParts.pathname !== '/') {
        response.end(error)
        return
    }

    const clientIdentificator = urlParts.query['user']
    
    const foundUser: boolean = (identificatorsBase.find(id => id === clientIdentificator) !== undefined)

    if (!foundUser) {
        response.end(error)
        return
    }


    response.end(clientIdentificator)
})

server.listen(port)