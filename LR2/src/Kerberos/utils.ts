export const sleep = (timeout: number): Promise<void> => {
    return new Promise<void>((resolve, _): void => {
        const timerId: NodeJS.Timeout = setTimeout((): void => {
            clearTimeout(timerId);
            resolve();
        }, timeout);
    });
};

export const exitWithMessage = (message: string): void => {
    console.info(message);
    process.exit(0);
}
