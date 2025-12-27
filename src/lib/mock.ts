
export const MOCK_TEAMS = [
    { _id: '1', name: 'Mechanics', members: ['Mike Ross', 'Harvey Specter', 'Robert Zane'] },
    { _id: '2', name: 'Electrical', members: ['Louis Litt', 'Donna Paulsen', 'Katrina Bennett'] },
    { _id: '3', name: 'IT Support', members: ['Rachel Zane', 'Harold Gunderson'] },
    { _id: '4', name: 'Facilities', members: ['Jessica Pearson', 'Daniel Hardman'] },
    { _id: '5', name: 'Safety Crew', members: ['Sheila Sazs', 'Oliver Grady'] }
];

export const MOCK_EQUIPMENT = [
    // Mechanics
    { _id: '101', name: 'CNC Milling Machine', serialNumber: 'CNC-2024-001', department: 'Production', location: 'Factory Floor 1', status: 'Active', category: 'Heavy Machinery', purchaseDate: '2023-01-15', maintenanceTeam: { name: 'Mechanics', _id: '1' } },
    { _id: '103', name: 'Hydraulic Press', serialNumber: 'HYD-5544', department: 'Production', location: 'Factory Floor 2', status: 'Maintenance', category: 'Heavy Machinery', purchaseDate: '2022-11-20', maintenanceTeam: { name: 'Mechanics', _id: '1' } },
    { _id: '105', name: 'Industrial Lathe', serialNumber: 'LAT-3030', department: 'Production', location: 'Workshop A', status: 'Active', category: 'Machinery', purchaseDate: '2021-06-10', maintenanceTeam: { name: 'Mechanics', _id: '1' } },
    { _id: '106', name: 'Conveyor Belt System', serialNumber: 'CBS-1122', department: 'Logistics', location: 'Warehouse 1', status: 'Active', category: 'Logistics', purchaseDate: '2020-09-05', maintenanceTeam: { name: 'Mechanics', _id: '1' } },

    // Electrical
    { _id: '104', name: 'Main Switchboard', serialNumber: 'ELEC-MAIN-01', department: 'Facilities', location: 'Basement', status: 'Active', category: 'Electrical', purchaseDate: '2020-03-15', maintenanceTeam: { name: 'Electrical', _id: '2' } },
    { _id: '107', name: 'Backup Generator', serialNumber: 'GEN-5000', department: 'Facilities', location: 'Power Room', status: 'Active', category: 'Electrical', purchaseDate: '2019-12-12', maintenanceTeam: { name: 'Electrical', _id: '2' } },
    { _id: '108', name: 'HVAC Control Unit', serialNumber: 'HVAC-2233', department: 'Facilities', location: 'Roof', status: 'Maintenance', category: 'HVAC', purchaseDate: '2021-08-20', maintenanceTeam: { name: 'Electrical', _id: '2' } },

    // IT
    { _id: '102', name: 'Office Printer X1', serialNumber: 'PRT-9988', department: 'Admin', location: 'Office 202', status: 'Active', category: 'Office Electronics', purchaseDate: '2024-05-10', maintenanceTeam: { name: 'IT Support', _id: '3' } },
    { _id: '109', name: 'Server Rack A', serialNumber: 'SRV-001', department: 'IT', location: 'Server Room', status: 'Active', category: 'Computing', purchaseDate: '2022-02-28', maintenanceTeam: { name: 'IT Support', _id: '3' } },
    { _id: '110', name: 'Conference Projector', serialNumber: 'PROJ-4K', department: 'Admin', location: 'Conf Room B', status: 'Scrap', category: 'AV Equipment', purchaseDate: '2018-07-15', maintenanceTeam: { name: 'IT Support', _id: '3' } },

    // Facilities
    { _id: '111', name: 'Forklift Model Z', serialNumber: 'FL-9900', department: 'Logistics', location: 'Warehouse 2', status: 'Active', category: 'Vehicle', purchaseDate: '2023-11-01', maintenanceTeam: { name: 'Facilities', _id: '4' } },
    { _id: '112', name: 'Water Pump System', serialNumber: 'WPS-2211', department: 'Facilities', location: 'Pump Room', status: 'Active', category: 'Plumbing', purchaseDate: '2021-04-18', maintenanceTeam: { name: 'Facilities', _id: '4' } },

    // Safety
    { _id: '113', name: 'Fire Alarm System', serialNumber: 'FAS-777', department: 'Security', location: 'Building Wide', status: 'Active', category: 'Safety', purchaseDate: '2020-01-01', maintenanceTeam: { name: 'Safety Crew', _id: '5' } },
    { _id: '114', name: 'Automated Defibrillator', serialNumber: 'AED-005', department: 'HR', location: 'Lobby', status: 'Active', category: 'Medical', purchaseDate: '2023-06-30', maintenanceTeam: { name: 'Safety Crew', _id: '5' } },
    { _id: '115', name: 'Security Camera Hub', serialNumber: 'CAM-hub-01', department: 'Security', location: 'Security Room', status: 'Active', category: 'Security', purchaseDate: '2022-05-15', maintenanceTeam: { name: 'Safety Crew', _id: '5' } }
];

export const MOCK_REQUESTS = [
    { _id: '201', subject: 'Hydraulic Leak Fix', equipment: { name: 'Hydraulic Press', _id: '103' }, type: 'Corrective', status: 'In Progress', priority: 'High', maintenanceTeam: { name: 'Mechanics', _id: '1' }, createdAt: new Date().toISOString() },
    { _id: '202', subject: 'Routine Oil Change', equipment: { name: 'CNC Milling Machine', _id: '101' }, type: 'Preventive', status: 'New', priority: 'Medium', maintenanceTeam: { name: 'Mechanics', _id: '1' }, scheduledDate: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString(), createdAt: new Date().toISOString() },
    { _id: '203', subject: 'Toner Replacement', equipment: { name: 'Office Printer X1', _id: '102' }, type: 'Corrective', status: 'New', priority: 'Low', maintenanceTeam: { name: 'IT Support', _id: '3' }, createdAt: new Date().toISOString() },
    { _id: '204', subject: 'Filter Cleaning', equipment: { name: 'HVAC Control Unit', _id: '108' }, type: 'Preventive', status: 'New', priority: 'Medium', maintenanceTeam: { name: 'Electrical', _id: '2' }, scheduledDate: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(), createdAt: new Date().toISOString() },
    { _id: '205', subject: 'Firmware Upgrade', equipment: { name: 'Server Rack A', _id: '109' }, type: 'Preventive', status: 'Repaired', priority: 'High', maintenanceTeam: { name: 'IT Support', _id: '3' }, scheduledDate: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString(), createdAt: new Date().toISOString() },
    { _id: '206', subject: 'Brake Inspection', equipment: { name: 'Forklift Model Z', _id: '111' }, type: 'Preventive', status: 'In Progress', priority: 'Critical', maintenanceTeam: { name: 'Facilities', _id: '4' }, scheduledDate: new Date().toISOString(), createdAt: new Date().toISOString() },
    { _id: '207', subject: 'Sensor Calibration', equipment: { name: 'Fire Alarm System', _id: '113' }, type: 'Preventive', status: 'New', priority: 'Critical', maintenanceTeam: { name: 'Safety Crew', _id: '5' }, scheduledDate: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(), createdAt: new Date().toISOString() },
    { _id: '208', subject: 'Projector Bulb Dead', equipment: { name: 'Conference Projector', _id: '110' }, type: 'Corrective', status: 'Scrap', priority: 'Low', maintenanceTeam: { name: 'IT Support', _id: '3' }, createdAt: new Date().toISOString() },
    { _id: '209', subject: 'Generator Test Run', equipment: { name: 'Backup Generator', _id: '107' }, type: 'Preventive', status: 'New', priority: 'High', maintenanceTeam: { name: 'Electrical', _id: '2' }, scheduledDate: new Date(new Date().setDate(new Date().getDate() + 14)).toISOString(), createdAt: new Date().toISOString() }
];
