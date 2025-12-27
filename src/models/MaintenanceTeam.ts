import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMaintenanceTeam extends Document {
    name: string; // e.g., "Mechanics", "IT Support"
    members: string[]; // List of Technician Names
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}

const MaintenanceTeamSchema: Schema = new Schema(
    {
        name: { type: String, required: true, unique: true },
        members: [{ type: String, required: true }], // Treating members as simple strings for MVP, could be User refs
        description: { type: String },
    },
    { timestamps: true }
);

const MaintenanceTeam: Model<IMaintenanceTeam> =
    mongoose.models.MaintenanceTeam ||
    mongoose.model<IMaintenanceTeam>('MaintenanceTeam', MaintenanceTeamSchema);

export default MaintenanceTeam;
