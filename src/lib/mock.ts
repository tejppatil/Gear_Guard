export const MOCK_TEAMS = [
    { _id: 'team_electrical', name: 'Electrical Team', members: ['John Smith', 'Sarah Johnson', 'Mike Davis'] },
    { _id: 'team_mechanical', name: 'Mechanical Team', members: ['Tom Brown', 'Emily White', 'Chris Lee'] },
    { _id: 'team_it', name: 'IT Team', members: ['Alex Kim', 'Rachel Green'] },
    { _id: 'team_production', name: 'Production Team', members: ['David Wilson', 'Lisa Anderson'] },
    { _id: 'team_logistics', name: 'Logistics Team', members: ['James Taylor', 'Maria Garcia', 'Robert Martinez'] },
];

export const MOCK_EQUIPMENT = [
    // Mechanical Team
    { _id: '101', name: 'CNC Milling Machine', serialNumber: 'CNC-2024-001', department: 'Production', location: 'Factory Floor 1', status: 'Active', category: 'Machinery', purchaseDate: '2023-01-15', maintenanceTeam: { name: 'Mechanical Team', _id: 'team_mechanical' } },
    { _id: '103', name: 'Hydraulic Press', serialNumber: 'HYD-5544', department: 'Production', location: 'Factory Floor 2', status: 'Maintenance', category: 'Machinery', purchaseDate: '2022-11-20', maintenanceTeam: { name: 'Mechanical Team', _id: 'team_mechanical' } },
    { _id: '105', name: 'Industrial Lathe', serialNumber: 'LAT-3030', department: 'Production', location: 'Workshop A', status: 'Active', category: 'Machinery', purchaseDate: '2021-06-10', maintenanceTeam: { name: 'Mechanical Team', _id: 'team_mechanical' } },
    { _id: '106', name: 'Conveyor Belt System', serialNumber: 'CBS-1122', department: 'Logistics', location: 'Warehouse 1', status: 'Active', category: 'Machinery', purchaseDate: '2020-09-05', maintenanceTeam: { name: 'Logistics Team', _id: 'team_logistics' } },

    // Electrical Team
    { _id: '104', name: 'Main Switchboard', serialNumber: 'ELEC-MAIN-01', department: 'Facilities', location: 'Basement', status: 'Active', category: 'Electronics', purchaseDate: '2020-03-15', maintenanceTeam: { name: 'Electrical Team', _id: 'team_electrical' } },
    { _id: '107', name: 'Backup Generator', serialNumber: 'GEN-5000', department: 'Facilities', location: 'Power Room', status: 'Active', category: 'Electronics', purchaseDate: '2019-12-12', maintenanceTeam: { name: 'Electrical Team', _id: 'team_electrical' } },
    { _id: '108', name: 'HVAC Control Unit', serialNumber: 'HVAC-2233', department: 'Facilities', location: 'Roof', status: 'Maintenance', category: 'Electronics', purchaseDate: '2021-08-20', maintenanceTeam: { name: 'Electrical Team', _id: 'team_electrical' } },

    // IT Team
    { _id: '102', name: 'Office Printer X1', serialNumber: 'PRT-9988', department: 'IT', location: 'Office 202', status: 'Active', category: 'Electronics', purchaseDate: '2024-05-10', maintenanceTeam: { name: 'IT Team', _id: 'team_it' } },
    { _id: '109', name: 'Server Rack A', serialNumber: 'SRV-001', department: 'IT', location: 'Server Room', status: 'Active', category: 'Electronics', purchaseDate: '2022-02-28', maintenanceTeam: { name: 'IT Team', _id: 'team_it' } },
    { _id: '110', name: 'Conference Projector', serialNumber: 'PROJ-4K', department: 'IT', location: 'Conf Room B', status: 'Scrap', category: 'Electronics', purchaseDate: '2018-07-15', maintenanceTeam: { name: 'IT Team', _id: 'team_it' } },

    // Production Team
    { _id: '111', name: 'Assembly Robot Arm', serialNumber: 'RBT-9900', department: 'Production', location: 'Assembly Line', status: 'Active', category: 'Machinery', purchaseDate: '2023-11-01', maintenanceTeam: { name: 'Production Team', _id: 'team_production' } },
    { _id: '112', name: 'Quality Control Scanner', serialNumber: 'QCS-2211', department: 'Production', location: 'QC Station', status: 'Active', category: 'Electronics', purchaseDate: '2021-04-18', maintenanceTeam: { name: 'Production Team', _id: 'team_production' } },

    // Logistics Team
    { _id: '113', name: 'Forklift Model Z', serialNumber: 'FL-777', department: 'Logistics', location: 'Warehouse 2', status: 'Active', category: 'Vehicle', purchaseDate: '2020-01-01', maintenanceTeam: { name: 'Logistics Team', _id: 'team_logistics' } },
    { _id: '114', name: 'Pallet Jack Electric', serialNumber: 'PJ-005', department: 'Logistics', location: 'Warehouse 1', status: 'Active', category: 'Vehicle', purchaseDate: '2023-06-30', maintenanceTeam: { name: 'Logistics Team', _id: 'team_logistics' } },
    { _id: '115', name: 'Inventory Scanner', serialNumber: 'INV-hub-01', department: 'Logistics', location: 'Warehouse Office', status: 'Active', category: 'Electronics', purchaseDate: '2022-05-15', maintenanceTeam: { name: 'Logistics Team', _id: 'team_logistics' } }
];

export const MOCK_REQUESTS = [
    { _id: '201', subject: 'Hydraulic Leak Fix', equipment: { name: 'Hydraulic Press', _id: '103' }, type: 'Corrective', status: 'In Progress', priority: 'High', maintenanceTeam: { name: 'Mechanical Team', _id: 'team_mechanical' }, createdAt: new Date().toISOString() },
    { _id: '202', subject: 'Routine Oil Change', equipment: { name: 'CNC Milling Machine', _id: '101' }, type: 'Preventive', status: 'New', priority: 'Medium', maintenanceTeam: { name: 'Mechanical Team', _id: 'team_mechanical' }, scheduledDate: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString(), createdAt: new Date().toISOString() },
    { _id: '203', subject: 'Toner Replacement', equipment: { name: 'Office Printer X1', _id: '102' }, type: 'Corrective', status: 'New', priority: 'Low', maintenanceTeam: { name: 'IT Team', _id: 'team_it' }, createdAt: new Date().toISOString() },
    { _id: '204', subject: 'Filter Cleaning', equipment: { name: 'HVAC Control Unit', _id: '108' }, type: 'Preventive', status: 'New', priority: 'Medium', maintenanceTeam: { name: 'Electrical Team', _id: 'team_electrical' }, scheduledDate: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(), createdAt: new Date().toISOString() },
    { _id: '205', subject: 'Firmware Upgrade', equipment: { name: 'Server Rack A', _id: '109' }, type: 'Preventive', status: 'Repaired', priority: 'High', maintenanceTeam: { name: 'IT Team', _id: 'team_it' }, scheduledDate: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString(), createdAt: new Date().toISOString() },
    { _id: '206', subject: 'Robot Calibration', equipment: { name: 'Assembly Robot Arm', _id: '111' }, type: 'Preventive', status: 'In Progress', priority: 'Critical', maintenanceTeam: { name: 'Production Team', _id: 'team_production' }, scheduledDate: new Date().toISOString(), createdAt: new Date().toISOString() },
    { _id: '207', subject: 'Forklift Inspection', equipment: { name: 'Forklift Model Z', _id: '113' }, type: 'Preventive', status: 'New', priority: 'Critical', maintenanceTeam: { name: 'Logistics Team', _id: 'team_logistics' }, scheduledDate: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(), createdAt: new Date().toISOString() },
    { _id: '208', subject: 'Projector Bulb Dead', equipment: { name: 'Conference Projector', _id: '110' }, type: 'Corrective', status: 'Scrap', priority: 'Low', maintenanceTeam: { name: 'IT Team', _id: 'team_it' }, createdAt: new Date().toISOString() },
    { _id: '209', subject: 'Generator Test Run', equipment: { name: 'Backup Generator', _id: '107' }, type: 'Preventive', status: 'New', priority: 'High', maintenanceTeam: { name: 'Electrical Team', _id: 'team_electrical' }, scheduledDate: new Date(new Date().setDate(new Date().getDate() + 14)).toISOString(), createdAt: new Date().toISOString() }
];
