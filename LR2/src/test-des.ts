import { DES } from './DES/DES';


const testDESAlgorithm = (): void => {
    const testMessage = 'Here\'s a message with spaces and LARGE TEXT';
    const testKey = 'some-advanced-key-2023';

    const encrypted: string = DES.encrypt(testMessage, testKey);
    const decrypted = DES.decrypt(encrypted, testKey);
    console.log('INITIAL MESSAGE: {', testMessage, '} INITIAL KEY: {', testKey, '}');
    console.log('ENCRYPTED: {', encrypted, '}');
    //console.log('ENCRYPTED BYTES: ', [...encrypted].map(symbol => symbol.charCodeAt(0)));
    console.log('DECRYPTED: {', decrypted, '}');
};


testDESAlgorithm();
