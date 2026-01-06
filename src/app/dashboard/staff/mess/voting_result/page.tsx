import '@/app/dashboard/staff/staff.css'

export default function VotingResultPage() {

    return (
        <div className="tab-content">
            <div className="voting-header">
                <div className="voting-title">
                    <span>📊</span>
                    <span>Meal Voting Results</span>
                </div>
                <div className="votes-badge">78 votes this week</div>
            </div>

            <h3 className="voting-subtitle">Top Requested Items</h3>

            <div className="voting-item">
                <div className="voting-item-row">
                    <span className="voting-item-name">
                        <span>🍗</span>
                        <span>Chicken</span>
                    </span>
                    <span className="voting-count">45 Votes</span>
                </div>
                <div className="voting-bar-bg">
                    <div className="voting-bar green" style={{ width: '100%' }}></div>
                </div>
            </div>

            <div className="voting-item">
                <div className="voting-item-row">
                    <span className="voting-item-name">
                        <span>🥚</span>
                        <span>Egg with Potato fry</span>
                    </span>
                    <span className="voting-count">32 Votes</span>
                </div>
                <div className="voting-bar-bg">
                    <div className="voting-bar blue" style={{ width: '71%' }}></div>
                </div>
            </div>

            <div className="voting-item">
                <div className="voting-item-row">
                    <span className="voting-item-name">
                        <span>🫓</span>
                        <span>Paratha With Halua</span>
                    </span>
                    <span className="voting-count">28 Votes</span>
                </div>
                <div className="voting-bar-bg">
                    <div className="voting-bar yellow" style={{ width: '62%' }}></div>
                </div>
            </div>
        </div>
    );
}