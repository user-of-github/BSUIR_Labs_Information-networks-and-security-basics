import { KerberosDemoService } from './Kerberos/KerberosDemoService';

const main = async (): Promise<void> => {
    const testUser: string = 'user_of_kerberos';
    const testPassword: string = 'password';

    await KerberosDemoService.runKerberosSimuation(testUser, testPassword);
};

void main();

