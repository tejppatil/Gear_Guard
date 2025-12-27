import mongoose, { Schema, Document, Model } from 'mongoose';

export enum EquipmentStatus {
    Active = 'Active',
    Maintenance = 'Maintenance',
    Scrap = 'Scrap',
}

export interface IEquipment extends Document {
    name: string;
    serialNumber: string;
    department: string;
    assignedTo?: string; // Employee Name
    purchaseDate: Date;
    warrantyEnd?: Date;
    location: string;
    status: EquipmentStatus;
    maintenanceTeam: mongoose.Types.ObjectId; // Reference to MaintenanceTeam
    category: string; // e.g., "Printer", "CNC Machine"
    createdAt: Date;
    updatedAt: Date;
    imageUrl?: string;
}

const EquipmentSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        serialNumber: { type: String, required: true, unique: true },
        department: { type: String, required: true },
        assignedTo: { type: String },
        purchaseDate: { type: Date, required: true },
        warrantyEnd: { type: Date },
        location: { type: String, required: true },
        status: {
            type: String,
            enum: Object.values(EquipmentStatus),
            default: EquipmentStatus.Active,
        },
        maintenanceTeam: {
            type: Schema.Types.ObjectId,
            ref: 'MaintenanceTeam',
            required: true,
        },
        category: { type: String, required: true },
        imageUrl: { type: String },
    },
    { timestamps: true }
);

// Prevent model recompilation error in Next.js hot reload
const Equipment: Model<IEquipment> =
    mongoose.models.Equipment || mongoose.model<IEquipment>('Equipment', EquipmentSchema);

export default Equipment;
