import '@/app/dashboard/staff/staff.css'

export default function FAQPage() {
    return (
        <div className="section">
            <div className="section-header">
                <span className="section-title">❓ Frequently Asked Questions</span>
            </div>

            <div className="voting-section">
                <div style={{ marginBottom: '24px' }}>
                    <h3 className="voting-subtitle">Q: How long does it take to resolve a maintenance request?</h3>
                    <div style={{ fontSize: '14px', lineHeight: '1.6', color: '#666', marginTop: '8px' }}>
                        A: Resolution time depends on the priority and complexity:
                        <ul style={{ marginLeft: '20px', marginTop: '8px' }}>
                            <li>Urgent issues: Within 24 hours</li>
                            <li>High priority: 2-3 days</li>
                            <li>Normal priority: Within a week</li>
                            <li>Low priority: Based on staff availability</li>
                        </ul>
                    </div>
                </div>

                <div style={{ marginBottom: '24px' }}>
                    <h3 className="voting-subtitle">Q: Can I track the status of my request?</h3>
                    <div style={{ fontSize: '14px', lineHeight: '1.6', color: '#666', marginTop: '8px' }}>
                        A: Yes! You can track all your requests in the "My Requests" tab. You'll receive notifications when your request is assigned to a technician and when work is completed.
                    </div>
                </div>

                <div style={{ marginBottom: '24px' }}>
                    <h3 className="voting-subtitle">Q: What should I do in case of an emergency?</h3>
                    <div style={{ fontSize: '14px', lineHeight: '1.6', color: '#666', marginTop: '8px' }}>
                        A: For emergencies (electrical hazards, major leaks, etc.), contact the maintenance office directly at +880-1234-567890. Also submit a request marked as "Urgent" for documentation.
                    </div>
                </div>

                <div style={{ marginBottom: '24px' }}>
                    <h3 className="voting-subtitle">Q: Can I request specific maintenance time slots?</h3>
                    <div style={{ fontSize: '14px', lineHeight: '1.6', color: '#666', marginTop: '8px' }}>
                        A: Yes, you can mention your preferred time in the request form. While we'll try to accommodate your preference, urgent issues may need immediate attention.
                    </div>
                </div>

                <div style={{ marginBottom: '24px' }}>
                    <h3 className="voting-subtitle">Q: What if I'm not satisfied with the service?</h3>
                    <div style={{ fontSize: '14px', lineHeight: '1.6', color: '#666', marginTop: '8px' }}>
                        A: After completion, you can rate the service and provide feedback. If the issue persists, you can submit a follow-up request referencing the original ticket number.
                    </div>
                </div>
            </div>

            <div className="info-section" style={{ marginTop: '20px' }}>
                <div className="info-item">
                    <div className="info-label">Emergency Contact</div>
                    <div className="info-value">+880-1234-567890</div>
                </div>
                <div className="info-item right">
                    <div className="info-label">Office Hours</div>
                    <div className="info-value">24/7 Emergency Service</div>
                </div>
            </div>
        </div>
    );
}