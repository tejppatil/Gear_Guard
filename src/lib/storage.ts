
import fs from 'fs';
import path from 'path';
import { MOCK_EQUIPMENT, MOCK_REQUESTS, MOCK_TEAMS } from './mock';

const DATA_FILE = path.join(process.cwd(), 'gearguard-data.json');

interface DataStore {
    teams: typeof MOCK_TEAMS;
    equipment: typeof MOCK_EQUIPMENT;
    requests: typeof MOCK_REQUESTS;
    users: any[];
}

// Initial Users
const INITIAL_USERS = [
    { _id: 'admin', username: 'admin', password: 'admin123', role: 'admin', name: 'Administrator' },
    // Teams will be generated dynamically or can be added here
];

// Initialize with mock data values if file doesn't exist
const INITIAL_DATA: DataStore = {
    teams: MOCK_TEAMS,
    equipment: MOCK_EQUIPMENT,
    requests: MOCK_REQUESTS,
    users: INITIAL_USERS,
};

function readData(): DataStore {
    if (!fs.existsSync(DATA_FILE)) {
        // If file doesn't exist, create it with initial mock data
        fs.writeFileSync(DATA_FILE, JSON.stringify(INITIAL_DATA, null, 2));
        return INITIAL_DATA;
    }

    try {
        const fileContent = fs.readFileSync(DATA_FILE, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
        console.error('Error reading data file, resetting to defaults:', error);
        return INITIAL_DATA;
    }
}

function writeData(data: DataStore) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// --- Helpers for API Routes ---

export const getTeams = () => readData().teams;
export const getEquipment = () => readData().equipment;
export const getRequests = () => readData().requests;

// TEAMS
export const addTeam = (team: any) => {
    const data = readData();
    const newTeam = { ...team, _id: Math.random().toString(36).substr(2, 9) };
    data.teams.push(newTeam);
    writeData(data);
    return newTeam;
};

export const deleteTeam = (id: string) => {
    const data = readData();
    data.teams = data.teams.filter(t => t._id !== id);
    writeData(data);
};

export const updateTeam = (id: string, updates: any) => {
    const data = readData();
    const index = data.teams.findIndex(t => t._id === id);
    if (index !== -1) {
        data.teams[index] = { ...data.teams[index], ...updates };
        writeData(data);
        return data.teams[index];
    }
    return null;
};

// EQUIPMENT
export const addEquipment = (item: any) => {
    const data = readData();
    const newItem = { ...item, _id: Math.random().toString(36).substr(2, 9) };
    data.equipment.unshift(newItem); // Add to top
    writeData(data);
    return newItem;
};

export const updateEquipment = (id: string, updates: any) => {
    const data = readData();
    const index = data.equipment.findIndex(e => e._id === id);
    if (index !== -1) {
        data.equipment[index] = { ...data.equipment[index], ...updates };
        writeData(data);
        return data.equipment[index];
    }
    return null;
};

export const deleteEquipment = (id: string) => {
    const data = readData();
    data.equipment = data.equipment.filter(e => e._id !== id);
    writeData(data);
};

// REQUESTS
export const addRequest = (req: any) => {
    const data = readData();
    const newReq = { ...req, _id: Math.random().toString(36).substr(2, 9), createdAt: new Date().toISOString() };
    data.requests.unshift(newReq);
    writeData(data);
    return newReq;
};

export const updateRequest = (id: string, updates: any) => {
    const data = readData();
    const index = data.requests.findIndex(r => r._id === id);
    if (index !== -1) {
        data.requests[index] = { ...data.requests[index], ...updates };
        writeData(data);
        return data.requests[index];
    }
    return null;
};

export const deleteRequest = (id: string) => {
    const data = readData();
    data.requests = data.requests.filter(r => r._id !== id);
    writeData(data);
};

// USERS & AUTH
export const getUsers = () => {
    const data = readData();
    // Ensure admin exists
    if (!data.users || data.users.length === 0) {
        data.users = INITIAL_USERS;
        writeData(data);
    }
    // Sync Teams as Users
    const teamUsers = data.teams.map(t => ({
        _id: t._id,
        username: t.name.toLowerCase().replace(/\s+/g, ''),
        password: 'pass', // Default password for teams
        role: 'team',
        teamId: t._id,
        name: t.name
    }));

    // Combine Admin + Team Users (deduplicate by checking username)
    const existingUsernames = new Set(data.users.map(u => u.username));
    const newTeamUsers = teamUsers.filter(u => !existingUsernames.has(u.username));

    if (newTeamUsers.length > 0) {
        data.users = [...data.users, ...newTeamUsers];
        writeData(data);
    }

    return data.users;
};

export const authenticateUser = (username: string, pass: string) => {
    const users = getUsers();
    const user = users.find(u => u.username === username && u.password === pass);
    if (user) {
        const { password, ...safeUser } = user;
        return safeUser;
    }
    return null;
};

export const getUser = (id: string) => {
    const users = getUsers();
    const user = users.find(u => u._id === id);
    if (user) {
        const { password, ...safeUser } = user;
        return safeUser;
    }
    return null;
};
