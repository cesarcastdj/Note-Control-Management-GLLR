import { Document } from 'mongoose';

export interface IUser extends Document {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: 'admin' | 'student';
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
} 