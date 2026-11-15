import { Schema, model, Document } from 'mongoose';

// 1. Define the Interface representing a document in MongoDB
export interface IEmployee extends Document {
    name: string;
    department: string;
    salary?: number;
    skills: string[];
    joiningDate: Date;
}

// 2. Define the Schema corresponding to the interface
const EmployeeSchema = new Schema<IEmployee>({
        name: {type: String, required: true},
        department: {type: String, default: 'General'},
        salary: {type: Number},
        skills: {type: [String], default: []},
        joiningDate: {type: Date, default: Date.now}
    },
    {
        // Direct association to your existing collection
        collection: 'employeeCollection',
        versionKey: false // Disables the '__v' tracking attribute
    });
// 3. Export the compiled model
export const Employee = model<IEmployee>('Employee',EmployeeSchema);