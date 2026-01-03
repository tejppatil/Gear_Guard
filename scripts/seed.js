
const mongoose = require('mongoose');

// Use IPv4 loopback to avoid IPv6 connection delay
const MONGODB_URI = 'mongodb://127.0.0.1:27017/gearguard';

// --- Simplified Schemas for Seeding ---
const TeamSchema = new mongoose.Schema({ name: String, members: [String] });

const EquipSchema = new mongoose.Schema({
    name: String,
    serialNumber: String,
    department: String,
    location: String,
    status: String,
    category: String,
    purchaseDate: Date,
    maintenanceTeam: { type: mongoose.Schema.Types.ObjectId, ref: 'MaintenanceTeam' }
});

const ReqSchema = new mongoose.Schema({
    subject: String,
    equipment: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipment' },
    type: String,
    status: String,
    priority: String,
    maintenanceTeam: { type: mongoose.Schema.Types.ObjectId, ref: 'MaintenanceTeam' },
    scheduledDate: Date,
    description: String,
    requestedBy: String,
    createdAt: { type: Date, default: Date.now }
});

const MaintenanceTeam = mongoose.models.MaintenanceTeam || mongoose.model('MaintenanceTeam', TeamSchema);
const Equipment = mongoose.models.Equipment || mongoose.model('Equipment', EquipSchema);
const MaintenanceRequest = mongoose.models.MaintenanceRequest || mongoose.model('MaintenanceRequest', ReqSchema);

async function seed() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected!');

        console.log('Clearing existing data...');
        await MaintenanceTeam.deleteMany({});
        await Equipment.deleteMany({});
        await MaintenanceRequest.deleteMany({});

        // 1. Create Teams
        console.log('Seeding Teams...');
        const teams = await MaintenanceTeam.insertMany([
            { name: 'Mechanics', members: ['Mike Ross', 'Harvey Specter', 'Robert Zane'] },
            { name: 'Electrical', members: ['Louis Litt', 'Donna Paulsen', 'Katrina Bennett'] },
            { name: 'IT Support', members: ['Rachel Zane', 'Harold Gunderson'] },
            { name: 'Facilities', members: ['Jessica Pearson', 'Daniel Hardman'] },
            { name: 'Safety Crew', members: ['Sheila Sazs', 'Oliver Grady'] }
        ]);

        const [mech, elec, it, fac, safe] = teams;

        // 2. Create Equipment
        console.log('Seeding Equipment...');
        const equipment = await Equipment.insertMany([
            // Mechanics
            { name: 'CNC Milling Machine', serialNumber: 'CNC-2024-001', department: 'Production', location: 'Factory Floor 1', status: 'Active', category: 'Heavy Machinery', purchaseDate: '2023-01-15', maintenanceTeam: mech._id },
            { name: 'Hydraulic Press', serialNumber: 'HYD-5544', department: 'Production', location: 'Factory Floor 2', status: 'Maintenance', category: 'Heavy Machinery', purchaseDate: '2022-11-20', maintenanceTeam: mech._id },
            { name: 'Industrial Lathe', serialNumber: 'LAT-3030', department: 'Production', location: 'Workshop A', status: 'Active', category: 'Machinery', purchaseDate: '2021-06-10', maintenanceTeam: mech._id },
            { name: 'Conveyor Belt System', serialNumber: 'CBS-1122', department: 'Logistics', location: 'Warehouse 1', status: 'Active', category: 'Logistics', purchaseDate: '2020-09-05', maintenanceTeam: mech._id },

            // Electrical
            { name: 'Main Switchboard', serialNumber: 'ELEC-MAIN-01', department: 'Facilities', location: 'Basement', status: 'Active', category: 'Electrical', purchaseDate: '2020-03-15', maintenanceTeam: elec._id },
            { name: 'Backup Generator', serialNumber: 'GEN-5000', department: 'Facilities', location: 'Power Room', status: 'Active', category: 'Electrical', purchaseDate: '2019-12-12', maintenanceTeam: elec._id },
            { name: 'HVAC Control Unit', serialNumber: 'HVAC-2233', department: 'Facilities', location: 'Roof', status: 'Maintenance', category: 'HVAC', purchaseDate: '2021-08-20', maintenanceTeam: elec._id },

            // IT
            { name: 'Office Printer X1', serialNumber: 'PRT-9988', department: 'Admin', location: 'Office 202', status: 'Active', category: 'Office Electronics', purchaseDate: '2024-05-10', maintenanceTeam: it._id },
            { name: 'Server Rack A', serialNumber: 'SRV-001', department: 'IT', location: 'Server Room', status: 'Active', category: 'Computing', purchaseDate: '2022-02-28', maintenanceTeam: it._id },
            { name: 'Conference Projector', serialNumber: 'PROJ-4K', department: 'Admin', location: 'Conf Room B', status: 'Scrap', category: 'AV Equipment', purchaseDate: '2018-07-15', maintenanceTeam: it._id },

            // Facilities
            { name: 'Forklift Model Z', serialNumber: 'FL-9900', department: 'Logistics', location: 'Warehouse 2', status: 'Active', category: 'Vehicle', purchaseDate: '2023-11-01', maintenanceTeam: fac._id },
            { name: 'Water Pump System', serialNumber: 'WPS-2211', department: 'Facilities', location: 'Pump Room', status: 'Active', category: 'Plumbing', purchaseDate: '2021-04-18', maintenanceTeam: fac._id },

            // Safety
            { name: 'Fire Alarm System', serialNumber: 'FAS-777', department: 'Security', location: 'Building Wide', status: 'Active', category: 'Safety', purchaseDate: '2020-01-01', maintenanceTeam: safe._id },
            { name: 'Automated Defibrillator', serialNumber: 'AED-005', department: 'HR', location: 'Lobby', status: 'Active', category: 'Medical', purchaseDate: '2023-06-30', maintenanceTeam: safe._id },
            { name: 'Security Camera Hub', serialNumber: 'CAM-hub-01', department: 'Security', location: 'Security Room', status: 'Active', category: 'Security', purchaseDate: '2022-05-15', maintenanceTeam: safe._id }
        ]);

        // 3. Create Requests
        console.log('Seeding Requests...');
        await MaintenanceRequest.insertMany([
            { subject: 'Hydraulic Leak Fix', equipment: equipment[1]._id, type: 'Corrective', status: 'In Progress', priority: 'High', maintenanceTeam: mech._id, description: 'Oil leaking from main cylinder seal', requestedBy: 'John Doe' },
            { subject: 'Routine Oil Change', equipment: equipment[0]._id, type: 'Preventive', status: 'New', priority: 'Medium', maintenanceTeam: mech._id, scheduledDate: new Date(Date.now() + 5 * 86400000), description: 'Standard 500h maintenance', requestedBy: 'System' },
            { subject: 'Toner Replacement', equipment: equipment[7]._id, type: 'Corrective', status: 'New', priority: 'Low', maintenanceTeam: it._id, description: 'Black toner low', requestedBy: 'Admin Assistant' },
            { subject: 'Filter Cleaning', equipment: equipment[6]._id, type: 'Preventive', status: 'New', priority: 'Medium', maintenanceTeam: elec._id, scheduledDate: new Date(Date.now() + 2 * 86400000), description: 'Clean intake filters', requestedBy: 'System' },
            { subject: 'Firmware Upgrade', equipment: equipment[8]._id, type: 'Preventive', status: 'Repaired', priority: 'High', maintenanceTeam: it._id, scheduledDate: new Date(Date.now() - 10 * 86400000), description: 'Security patch v2.1', requestedBy: 'IT Manager' },
            { subject: 'Brake Inspection', equipment: equipment[10]._id, type: 'Preventive', status: 'In Progress', priority: 'Critical', maintenanceTeam: fac._id, scheduledDate: new Date(), description: 'Annual safety check', requestedBy: 'Safety Officer' },
            { subject: 'Sensor Calibration', equipment: equipment[12]._id, type: 'Preventive', status: 'New', priority: 'Critical', maintenanceTeam: safe._id, scheduledDate: new Date(Date.now() + 1 * 86400000), description: 'Drift detected in zone 4', requestedBy: 'System' },
            { subject: 'Projector Bulb Dead', equipment: equipment[9]._id, type: 'Corrective', status: 'Scrap', priority: 'Low', maintenanceTeam: it._id, description: 'Bulb exploded, unit old', requestedBy: 'Meeting Org' },
            { subject: 'Generator Test Run', equipment: equipment[5]._id, type: 'Preventive', status: 'New', priority: 'High', maintenanceTeam: elec._id, scheduledDate: new Date(Date.now() + 14 * 86400000), description: 'Monthly load test', requestedBy: 'Facilities Mgr' }
        ]);

        console.log('Database seeded successfully with RICH data!');
        console.log('Teams:', teams.length);
        console.log('Equipment:', equipment.length);
        console.log('Requests:', 9);
        process.exit(0);
    } catch (error) {
        console.error('Seeding error:', error);
        process.exit(1);
    }
}

seed();
