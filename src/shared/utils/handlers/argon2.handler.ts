import * as argon2 from 'argon2';

export const hashAKey = async (plainKey: string): Promise<string> => {
    return argon2.hash(plainKey);
}

export const compareKey = async (hashedKey: string, plainKey: string): Promise<boolean> => {
    return await argon2.verify(hashedKey, plainKey);
}