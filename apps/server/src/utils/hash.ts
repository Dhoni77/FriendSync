import * as bcyrpt from 'bcrypt';

export async function encrypt(password: string): Promise<string> {
    return bcyrpt.hash(password, 10);
}

export async function isPasswordValid(plaintextpassword: string, encryptedpassword: string) {
    return bcyrpt.compare(plaintextpassword, encryptedpassword);
}