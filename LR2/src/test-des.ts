import { DesService } from './DES/DesService';


const testDESAlgorithm = (): void => {
    const testMessage = 'Here\'s a message with spaces and LARGE TEXT 123';
    const testKey = 'some-advanced-key-2023';

    const encrypted: string = DesService.encrypt(testMessage, testKey);
    const decrypted = DesService.decrypt(encrypted, testKey);
    console.log('INITIAL MESSAGE: {', testMessage, '} INITIAL KEY: {', testKey, '}');
    console.log('ENCRYPTED: {', encrypted, '}');
    console.log('ENCRYPTED BYTES: ', [...encrypted].map(symbol => symbol.charCodeAt(0)));
    console.log('DECRYPTED: {', decrypted, '}');
};


testDESAlgorithm();
