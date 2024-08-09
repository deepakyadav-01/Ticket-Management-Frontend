export interface TicketInterfaceTs {
    id: string;
    title: string;
    description: string;
    priority: 'Low' | 'High';
    dueDate: Date;
    status: 'Open' | 'In Progress' | 'Closed';
}
