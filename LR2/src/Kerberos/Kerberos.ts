import { DesService } from '../DES/DesService';

export abstract class KerberosDemoService {
    private static readonly usersDataBase: Map<string, string> = new Map<string, string>([
        ['user-of-kerberos', 'password'],
        ['user_of_kerberos', 'password'],
        ['user_of_discord', 'password']
    ]);

    private static timeNow: Date | null = null;

    private static readonly stringSeparator: string = '/';

    public static async runDemonstration(userName: string, userPassword: string): Promise<void> {
        KerberosDemoService.timeNow = new Date();
    }


}
