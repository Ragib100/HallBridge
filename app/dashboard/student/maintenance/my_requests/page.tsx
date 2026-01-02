import '@/app/dashboard/staff/staff.css'
import { Button } from '@/components/ui/button';

export default function MyRequestsPage() {
    return (
        <div className="section">
            <div className="section-header">
                <span className="section-title">📋 My Maintenance Requests</span>
            </div>

            <div className="menu-day">
                <h3 className="menu-day-title">In Progress</h3>
                <div className="forecast-item" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        <div>
                            <div style={{ fontWeight: 'bold' }}>Request #MT-2024-089</div>
                            <div style={{ fontSize: '14px', color: '#666' }}>Category: Electrical</div>
                        </div>
                        <span style={{ backgroundColor: '#007aff', color: 'white', padding: '4px 12px', borderRadius: '12px', fontSize: '14px' }}>
                            In Progress
                        </span>
                    </div>
                    <div style={{ fontSize: '14px', color: '#666', marginTop: '8px' }}>
                        Issue: Light fixture not working in Room 305
                    </div>
                    <div style={{ fontSize: '14px', color: '#666' }}>
                        Assigned to: John (Electrician) | ETA: Dec 24, 2025
                    </div>
                </div>

                <div className="forecast-item" style={{ flexDirection: 'column', alignItems: 'flex-start', marginTop: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        <div>
                            <div style={{ fontWeight: 'bold' }}>Request #MT-2024-091</div>
                            <div style={{ fontSize: '14px', color: '#666' }}>Category: Plumbing</div>
                        </div>
                        <span style={{ backgroundColor: '#007aff', color: 'white', padding: '4px 12px', borderRadius: '12px', fontSize: '14px' }}>
                            In Progress
                        </span>
                    </div>
                    <div style={{ fontSize: '14px', color: '#666', marginTop: '8px' }}>
                        Issue: Leaking tap in bathroom
                    </div>
                    <div style={{ fontSize: '14px', color: '#666' }}>
                        Assigned to: Mike (Plumber) | ETA: Dec 25, 2025
                    </div>
                </div>
            </div>

            <div className="menu-day">
                <h3 className="menu-day-title">Pending Assignment</h3>
                <div className="forecast-item" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        <div>
                            <div style={{ fontWeight: 'bold' }}>Request #MT-2024-095</div>
                            <div style={{ fontSize: '14px', color: '#666' }}>Category: Internet/Wi-Fi</div>
                        </div>
                        <span style={{ backgroundColor: '#ffa500', color: 'white', padding: '4px 12px', borderRadius: '12px', fontSize: '14px' }}>
                            Pending
                        </span>
                    </div>
                    <div style={{ fontSize: '14px', color: '#666', marginTop: '8px' }}>
                        Issue: Weak Wi-Fi signal in room
                    </div>
                    <div style={{ fontSize: '14px', color: '#666' }}>
                        Submitted: Dec 24, 2025 at 10:30 AM
                    </div>
                </div>
            </div>

            <div className="menu-day">
                <h3 className="menu-day-title">Completed</h3>
                <div className="forecast-item" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        <div>
                            <div style={{ fontWeight: 'bold' }}>Request #MT-2024-078</div>
                            <div style={{ fontSize: '14px', color: '#666' }}>Category: Furniture</div>
                        </div>
                        <span style={{ backgroundColor: '#4caf50', color: 'white', padding: '4px 12px', borderRadius: '12px', fontSize: '14px' }}>
                            Completed
                        </span>
                    </div>
                    <div style={{ fontSize: '14px', color: '#666', marginTop: '8px' }}>
                        Issue: Broken chair in study room
                    </div>
                    <div style={{ fontSize: '14px', color: '#666' }}>
                        Completed on: Dec 20, 2025
                    </div>
                    <Button className="w-full mt-3 bg-blue-500 hover:bg-blue-600 border border-blue-700 cursor-pointer">
                        ⭐ Rate Service
                    </Button>
                </div>
            </div>
        </div>
    );
}