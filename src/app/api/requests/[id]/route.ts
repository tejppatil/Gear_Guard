import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import MaintenanceRequest, { RequestStatus } from '@/models/MaintenanceRequest';
import Equipment, { EquipmentStatus } from '@/models/Equipment';

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectToDatabase();
        const { id } = await params;
        const body = await request.json();

        const updatedRequest = await MaintenanceRequest.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        });

        if (!updatedRequest) {
            return NextResponse.json({ error: 'Request not found' }, { status: 404 });
        }

        // Scrap Logic: If request moved to Scrap, update Equipment status
        if (body.status === RequestStatus.Scrap) {
            await Equipment.findByIdAndUpdate(updatedRequest.equipment, {
                status: EquipmentStatus.Scrap,
            });
        }

        // Logic: If request moved to Repaired, maybe set Equipment logic?
        // For now, only Scrap is explicitly requested to change equipment state.

        return NextResponse.json(updatedRequest);
    } catch (error) {
        console.warn('Database offline, using file storage');
        const { id } = await params;
        const body = await request.json();
        const { updateRequest } = await import('@/lib/storage');

        const updated = updateRequest(id, body);
        if (updated) {
            return NextResponse.json(updated);
        }
        return NextResponse.json({ error: 'Request not found (Storage)' }, { status: 404 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectToDatabase();
        const { id } = await params;
        await MaintenanceRequest.findByIdAndDelete(id);
        return NextResponse.json({ message: 'Request deleted' });
    } catch (error) {
        console.warn('Database offline, using file storage');
        const { id } = await params;
        const { deleteRequest } = await import('@/lib/storage');
        deleteRequest(id);
        return NextResponse.json({ message: 'Request deleted (Storage)' });
    }
}
