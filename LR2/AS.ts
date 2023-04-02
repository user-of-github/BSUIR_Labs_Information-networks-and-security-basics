import http from 'http'
import url from 'url'
import {encryptWithDES} from './DES'


const PORT: number = 4000

const CLIENTS_DATABASE: string[] = ['user1',  'user2', 'user3']

const ERROR: string = 'ERROR_AS'

const TIME_OF_WORK_OF_TICKET: number = 1000000
const IDENTIFICATOR_OF_TGS: string = 'sometgs'
const TGT_DELIMETER: string = '&'
const KEY_FOR_ACCESS_TO_TGS: string = 'keyforaccesstotgs'
const K_C_AS_KEY: string = 'kcaskey' /// ????
const MESSAGE_DELIMETER: string = '@'
const BASE_KEY_C: string = 'baseKeyC' // ???


const server = http.createServer((request, response): void => {
    const urlParts = url.parse(request.url!, true)

    if (urlParts.pathname !== '/') {
        response.end(ERROR)
        return
    }

    const clientIdentificator = urlParts.query['user'] // с
    
    const foundUser: boolean = (CLIENTS_DATABASE.find(id => id === clientIdentificator) !== undefined)

    if (!foundUser) {
        response.end(ERROR)
        return
    }

    const c: string = clientIdentificator as string
    const tgs: string = IDENTIFICATOR_OF_TGS // tgs => for tgt
    const t1: string = new Date().toISOString() // time label
    const p1: string = TIME_OF_WORK_OF_TICKET.toString() // life time label

    const K_C_TGS: string = KEY_FOR_ACCESS_TO_TGS

    const tgtUnencrypted: string = [c, tgs, t1, p1, K_C_TGS].join(TGT_DELIMETER)
    const tgt: string = encryptWithDES(tgtUnencrypted, K_C_AS_KEY)

    const messageUnencrypted: string = [tgt, K_C_TGS].join(MESSAGE_DELIMETER)
    const message: string = encryptWithDES(messageUnencrypted, BASE_KEY_C)

    const responseTicket: string = message

    response.end(responseTicket)
})

server.listen(PORT)


