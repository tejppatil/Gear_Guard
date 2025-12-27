import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import MaintenanceRequest from '@/models/MaintenanceRequest';
import Equipment from '@/models/Equipment';
import MaintenanceTeam from '@/models/MaintenanceTeam'; // Ensure model is registered



export async function GET(request: Request) {
    try {
        await connectToDatabase();
        // Populate equipment and team details for rich display
        const requests = await MaintenanceRequest.find({})
            .populate('equipment')
            .populate('maintenanceTeam')
            .sort({ createdAt: -1 });
        return NextResponse.json(requests);
    } catch (error) {
        console.warn('Database offline, serving requests from file');
        const { getRequests } = await import('@/lib/storage');
        return NextResponse.json(getRequests());
    }
}

export async function POST(request: Request) {
    try {
        await connectToDatabase();
        const body = await request.json();
        const { equipment: equipmentId } = body;

        // Auto-Fill Logic: Fetch Equipment to get the Maintenance Team
        const equipment = await Equipment.findById(equipmentId);
        if (!equipment) {
            return NextResponse.json({ error: 'Equipment not found' }, { status: 404 });
        }

        // Assign team from equipment
        const requestData = {
            ...body,
            maintenanceTeam: equipment.maintenanceTeam,
        };

        const newRequest = await MaintenanceRequest.create(requestData);
        return NextResponse.json(newRequest, { status: 201 });
    } catch (error) {
        console.warn('Database offline, using file storage');
        const body = await request.json();
        const { getEquipment, addRequest } = await import('@/lib/storage');

        // Mock Auto-Fill Logic using stored equipment
        const allEquipment = getEquipment();
        const equipment = allEquipment.find((e: any) => e._id === body.equipment);

        const requestData = {
            ...body,
            maintenanceTeam: equipment ? equipment.maintenanceTeam : { name: 'Unassigned', _id: '0' },
            equipment: equipment ? { name: equipment.name, _id: equipment._id } : { name: 'Unknown', _id: '0' }
        };

        const newReq = addRequest(requestData);
        return NextResponse.json(newReq, { status: 201 });
    }
}
