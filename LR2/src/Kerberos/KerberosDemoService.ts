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

    private static sessionKey: string = 'sessionkey';


    public static async runDemonstration(userName: string, userPassword: string): Promise<void> {
        const clientTimeNow: Date = new Date();

        // STEP 1 { C ---> AS }
        await KerberosDemoService.firstStep(userName, userPassword, clientTimeNow);

        // STEP 2 { AS ---> C }
        const seversResponse: string = await KerberosDemoService.secondStep(userName, clientTimeNow.toString(), userPassword);
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
            exitWithMessage(`User ${userName} does not exist in database`);
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

        const encryptedTgt = DesService.encrypt(tgtRaw, KerberosDemoService.sessionKey);
        console.info(`[STEP 2] Raw TGT: ${tgtRaw}`);
        console.info(`[STEP 2] Encrypted TGT: ${encryptedTgt}`);

        await sleep(1000);
        console.log('[STEP 2] Combining server\s response to user')

        const toUser: string = [encryptedTgt, timestamp, KerberosDemoService.sessionKey].join(KerberosDemoService.stringSeparator);
        const encryptedResponse: string = DesService.encrypt(toUser, password);

        return encryptedResponse;
    }


}
