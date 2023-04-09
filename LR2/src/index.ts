import { KerberosDemoService } from './Kerberos/KerberosDemoService';

const main = async (): Promise<void> => {
    const testUser: string = 'user_of_kerberos';
    const testPassword: string = 'password';

    const simulationResult: boolean = await KerberosDemoService.runKerberosSimulation(testUser, testPassword);
    console.log('---------------');
    console.log(simulationResult);
};

void main();

