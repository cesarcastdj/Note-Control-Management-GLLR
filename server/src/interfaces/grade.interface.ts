import { Document } from 'mongoose';

export interface IGrade extends Document {
    studentId: string;
    subject: string;
    academicPeriod: string;
    grades: {
        term: string;
        value: number;
        date: Date;
    }[];
    finalGrade: number;
    comments: string;
    createdAt: Date;
    updatedAt: Date;
} 