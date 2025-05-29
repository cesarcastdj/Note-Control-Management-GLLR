import { Schema, model, Document } from 'mongoose';
import { IGrade } from '../interfaces/grade.interface';

const GradeSchema = new Schema<IGrade>({
  studentId: { type: String, required: true },
  subject: { type: String, required: true },
  academicPeriod: { type: String, required: true },
  grades: [
    {
      term: { type: String, required: true },
      value: { type: Number, required: true },
      date: { type: Date, required: true },
    },
  ],
  finalGrade: { type: Number, required: true },
  comments: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default model<IGrade>('Grade', GradeSchema);
