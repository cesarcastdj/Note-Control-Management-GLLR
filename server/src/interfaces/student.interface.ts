import { Document } from 'mongoose';

export interface IStudent extends Document {
    userId: string;
    studentId: string;
    academicPeriod: string;
    section: string;
    status: 'active' | 'inactive';
    address: string;
    phoneNumber: string;
    emergencyContact: {
        name: string;
        relationship: string;
        phoneNumber: string;
    };
    createdAt: Date;
    updatedAt: Date;
} 