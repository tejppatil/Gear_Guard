import mongoose, { Schema, Document, Model } from 'mongoose';

export enum RequestType {
    Corrective = 'Corrective', // Breakdown
    Preventive = 'Preventive', // Routine
}

export enum RequestStatus {
    New = 'New',
    InProgress = 'In Progress',
    Repaired = 'Repaired',
    Scrap = 'Scrap',
}

export enum RequestPriority {
    Low = 'Low',
    Medium = 'Medium',
    High = 'High',
    Critical = 'Critical',
}

export interface IMaintenanceRequest extends Document {
    subject: string;
    equipment: mongoose.Types.ObjectId;
    type: RequestType;
    status: RequestStatus;
    priority: RequestPriority;
    description?: string;
    requestedBy: string; // Name of requestor
    assignedTo?: string; // Technician Name
    scheduledDate?: Date; // For Preventive
    completionDate?: Date;
    durationHours?: number;
    maintenanceTeam: mongoose.Types.ObjectId; // Captured from Equipment at creation
    createdAt: Date;
    updatedAt: Date;
}

const MaintenanceRequestSchema: Schema = new Schema(
    {
        subject: { type: String, required: true },
        equipment: { type: Schema.Types.ObjectId, ref: 'Equipment', required: true },
        type: {
            type: String,
            enum: Object.values(RequestType),
            required: true,
        },
        status: {
            type: String,
            enum: Object.values(RequestStatus),
            default: RequestStatus.New,
        },
        priority: {
            type: String,
            enum: Object.values(RequestPriority),
            default: RequestPriority.Medium,
        },
        description: { type: String },
        requestedBy: { type: String, required: true, default: 'System Admin' }, // Default for MVP
        assignedTo: { type: String },
        scheduledDate: { type: Date },
        completionDate: { type: Date },
        durationHours: { type: Number },
        maintenanceTeam: {
            type: Schema.Types.ObjectId,
            ref: 'MaintenanceTeam',
            required: true,
        },
    },
    { timestamps: true }
);

const MaintenanceRequest: Model<IMaintenanceRequest> =
    mongoose.models.MaintenanceRequest ||
    mongoose.model<IMaintenanceRequest>('MaintenanceRequest', MaintenanceRequestSchema);

export default MaintenanceRequest;
