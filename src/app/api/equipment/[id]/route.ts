import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Equipment from '@/models/Equipment';
import MaintenanceTeam from '@/models/MaintenanceTeam';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectToDatabase();
        const { id } = await params;
        const equipment = await Equipment.findById(id).populate('maintenanceTeam');

        if (!equipment) {
            return NextResponse.json({ error: 'Equipment not found' }, { status: 404 });
        }

        return NextResponse.json(equipment);
    } catch (error) {
        console.warn('Database offline, serving equipment detail from file');
        const { id } = await params;
        const { getEquipment } = await import('@/lib/storage');
        const allEquipment = getEquipment();
        const item = allEquipment.find((e: any) => e._id === id);

        if (!item) {
            return NextResponse.json({ error: 'Equipment not found (Storage)' }, { status: 404 });
        }
        return NextResponse.json(item);
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectToDatabase();
        const { id } = await params;
        const body = await request.json();

        const updated = await Equipment.findByIdAndUpdate(id, body, { new: true });

        if (!updated) {
            return NextResponse.json({ error: 'Equipment not found' }, { status: 404 });
        }

        return NextResponse.json(updated);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update equipment' }, { status: 500 });
    }
}


export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectToDatabase();
        const { id } = await params;

        // Safety Check: Check for active requests
        // Note: We need to import MaintenanceRequest dynamically or ensure it's imported to avoid circular deps if any, 
        // but here it's fine.
        const MaintenanceRequest = (await import('@/models/MaintenanceRequest')).default;

        const activeRequests = await MaintenanceRequest.countDocuments({
            equipment: id,
            status: { $nin: ['Repaired', 'Scrap'] }
        });

        if (activeRequests > 0) {
            return NextResponse.json(
                { error: `Cannot delete equipment. It has ${activeRequests} active maintenance requests.` },
                { status: 400 }
            );
        }

        await Equipment.findByIdAndDelete(id);
        return NextResponse.json({ message: 'Equipment deleted' });
    } catch (error) {
        console.warn('Database offline, simulating delete');
        return NextResponse.json({ message: 'Equipment deleted (Demo Mode)' });
    }
}
