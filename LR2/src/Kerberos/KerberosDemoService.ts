import { DesService } from '../DES/DesService';
import { exitWithMessage, sleep } from './utils';

export abstract class KerberosDemoService {
    private static readonly stringSeparator: string = '/';
    private static readonly maximumClientAndServerTimeDifferenceInSeconds: number = 5;
    private static readonly usersDataBase: Map<string, string> = new Map<string, string>([
        ['user-of-kerberos', 'password'],
        ['user_of_kerberos', 'password'],
        ['user_of_discord', 'password']
    ]);

    private static clientSessionKey: string = 'clientsessionkey';
    private static sessionKey: string = 'sessionkey';
    private static masterKey: string = 'masterkey';
    private static serverMasterKey: string = 'servermasterkey';
    private static keyForInteractionWithSS: string = 'keykcss';

    public static async runKerberosSimuation(userName: string, userPassword: string): Promise<void> {
        const clientTimeNow: Date = new Date();

        // STEP 1 { C ---> AS }
        await KerberosDemoService.firstStep(userName, userPassword, clientTimeNow);

        // STEP 2 { AS ---> C }
        const seversResponse: string = await KerberosDemoService.secondStep(userName, clientTimeNow.toString(), userPassword);

        const decryptedServersResponse: string = DesService.decrypt(seversResponse, userPassword);
        const tgtTimeStampAndSessionKey: string[] = decryptedServersResponse.split(KerberosDemoService.stringSeparator);
        //  console.log(tgtTimeStampAndSessionKey);

        KerberosDemoService.clientSessionKey = tgtTimeStampAndSessionKey[2];
        //  console.log(KerberosDemoService.clientSessionKey);

        // STEP 3 { C ----> TGS }
        const messageSentToTgsServer: string = await KerberosDemoService.thirdStep(tgtTimeStampAndSessionKey);

        // STEP 4 { TGS ---> C }
        const ticket: string = await KerberosDemoService.fourthStep(messageSentToTgsServer, userName);
        const decryptedTicket: string = DesService.decrypt(ticket, KerberosDemoService.sessionKey);

        console.info('Received ticket from TGS server: ', decryptedTicket);

        const clientKCs: string = decryptedTicket.split('/')[1];
        console.info(`user K_cs: ${clientKCs}`);

        // STEP 5 { C ---> SS }
        const dataToSendToServer: string = await KerberosDemoService.fifthStep(clientKCs, decryptedTicket);

        // STEP 6 { SS ---> C }
    }

    // checks user on server by sending encrypted message there
    // server checks username and checks encrypted message as well (to validate password and time difference, if there is)
    private static async firstStep(username: string, userPassword: string, clientTimeNow: Date): Promise<void> {
        const message: string = [
            username,
            DesService.encrypt(clientTimeNow.toString(), userPassword)
        ].join(KerberosDemoService.stringSeparator);


        console.info('[STEP 1] Looking for client in database');
        await sleep(1500);

        const [userName, encryptedDateByPassword] = message.split('/');

        if (KerberosDemoService.usersDataBase.has(userName)) {
            console.info('[STEP 1] Found client in database');

            const savedPassword: string = KerberosDemoService.usersDataBase.get(userName);
            const decryptedDateString: string = DesService.decrypt(encryptedDateByPassword, savedPassword);
            const tryDate: Date = new Date(decryptedDateString);

            if (!Number.isNaN(tryDate.getTime())) {
                const ClientAndServerTimeDifferenceInSeconds = new Date(new Date().getTime() - tryDate.getTime()).getTime() / 1000;

                if (ClientAndServerTimeDifferenceInSeconds > KerberosDemoService.maximumClientAndServerTimeDifferenceInSeconds)
                    exitWithMessage('[STEP 1] Client and server time differ too much');

            } else {
                exitWithMessage('[STEP 1] Sent date (message) or password (key) is wrong...');
            }
        } else {
            exitWithMessage(`[STEP 1] User ${userName} does not exist in database`);
        }
    }

    private static async secondStep(userName: string, timestamp: string, password: string): Promise<string> {
        console.info('[STEP 2] Generating TGT...');

        const tgtRaw: string = [
            KerberosDemoService.sessionKey,
            userName,
            new Date(Date.now() + 1000000).toString(),
            new Date().toString()
        ].join(KerberosDemoService.stringSeparator);

        const encryptedTgt = DesService.encrypt(tgtRaw, KerberosDemoService.masterKey);
        console.info(`[STEP 2] Raw TGT: ${tgtRaw}`);
        console.info(`[STEP 2] Encrypted TGT: ${encryptedTgt}`);

        await sleep(1000);
        console.info('[STEP 2] Combining server\s response to user');

        const toUser: string = [encryptedTgt, timestamp, KerberosDemoService.sessionKey].join(KerberosDemoService.stringSeparator);
        const encryptedResponse: string = DesService.encrypt(toUser, password);

        return encryptedResponse;
    }

    // request to Ticket-Granting-Server ( <=> TGS ) (generating message for it)
    private static async thirdStep(tgtTimeStampAndSessionKey: string[]): Promise<string> {
        console.info('[STEP 3] Request to TGS server');
        await sleep(1000);

        const toTgsServer: string = [
            tgtTimeStampAndSessionKey[0],
            DesService.encrypt(new Date().toString(), KerberosDemoService.clientSessionKey)
        ].join(KerberosDemoService.stringSeparator); // 174

        return toTgsServer;
    }

    private static async fourthStep(message: string, userName: string): Promise<string> {
        // 187
        console.info('[STEP 4] Received message from client, decrypting it');
        await sleep(1000);

        const toTGSData = message.split(KerberosDemoService.stringSeparator);
        const decryptedTGT: string = DesService.decrypt(toTGSData[0], KerberosDemoService.masterKey);
        const tgtData = decryptedTGT.split(KerberosDemoService.stringSeparator);

        console.info('[STEP 4] I am TGS server and I\'ve received: ');
        console.info('[STEP 4] ', decryptedTGT);


        console.info('[STEP 4] Preparing ticket data');
        await sleep(1000);


        const now: Date = new Date();
        const tgsBlock: string = [
            userName,
            'Read&write access',
            'ServerName',
            now.toString(),
            new Date(now.getTime() + 1000000),
            KerberosDemoService.keyForInteractionWithSS // keyForInteractionWithSS <==> K[c_ss]
        ].join(KerberosDemoService.stringSeparator);

        const ticketToServer: string = DesService.encrypt(tgsBlock, KerberosDemoService.serverMasterKey); // Ktgs_ss
        const ticketToClient: string = [
            ticketToServer,
            KerberosDemoService.keyForInteractionWithSS
        ].join(KerberosDemoService.stringSeparator);

        console.info('[STEP 4] Ticket for client: ' + ticketToClient);

        /*
         * 3)
         * Вся эта структура зашифровывается с помощью сессионного ключа,
         * который стал доступен пользователю при аутентификации.
         * После чего эта информация отправляется клиенту.
         */

        // TGS -> Client
        console.info('[STEP 4] Encrypting ticket and sending to client');
        await sleep(1000);

        const encryptedResponseTicket: string = DesService.encrypt(ticketToClient, KerberosDemoService.sessionKey);
        return encryptedResponseTicket;
    }

    private static async fifthStep(clientK_cs: string, dataFromTgs: string): Promise<string> {
        const response: string = [
            DesService.encrypt(new Date().toString(), clientK_cs),
            dataFromTgs.split(KerberosDemoService.stringSeparator)[0]
        ].join(KerberosDemoService.stringSeparator);

        return response;
    }
}
