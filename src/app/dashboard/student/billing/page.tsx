import { redirect } from 'next/navigation';

export default function StudentBilling() {
    redirect('/dashboard/student/billing/current_dues');
}