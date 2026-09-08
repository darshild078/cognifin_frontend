import { Activity } from 'lucide-react';
import './../../styles/landing.css';

const TICKER_ITEMS = [
    { symbol: 'NIFTY 50', change: '+0.42%', isUp: true, metric: '24,852.15' },
    { symbol: 'SENSEX', change: '+0.38%', isUp: true, metric: '81,332.72' },
    { symbol: 'BANK NIFTY', change: '+0.55%', isUp: true, metric: '51,120.40' },
    { symbol: 'TCS', change: '+1.20%', isUp: true, filing: 'FY24 10-K', metric: '₹240,893 Cr (+6.8%)' },
    { symbol: 'INFY', change: '-0.30%', isUp: false, filing: 'FY24 AR', metric: '₹153,670 Cr (+4.7%)' },
    { symbol: 'RELIANCE', change: '+0.85%', isUp: true, filing: 'Annual Report', metric: '₹10,00,122 Cr (+2.6%)' },
    { symbol: 'HDFCBANK', change: '+0.60%', isUp: true, filing: 'SEBI Filing', metric: 'NIM: 3.63% | GNPA: 1.24%' },
    { symbol: 'ICICIBANK', change: '+1.45%', isUp: true, filing: 'FY24 PAT', metric: 'PAT: ₹40,888 Cr (+28.2%)' },
    { symbol: 'LT', change: '+0.90%', isUp: true, filing: 'Order Book', metric: '₹4,75,809 Cr (+19%)' },
    { symbol: 'BHARTIARTL', change: '+1.80%', isUp: true, filing: 'ARPU', metric: 'ARPU: ₹209 (+7.5%)' },
    { symbol: 'TATAMOTORS', change: '+2.10%', isUp: true, filing: 'Free Cash Flow', metric: 'Auto FCF: ₹26,900 Cr' },
    { symbol: 'ITC', change: '+0.40%', isUp: true, filing: 'Gross Rev', metric: 'Gross: ₹70,251 Cr' },
];

export default function MarketTicker() {
    return (
        <div className="sticky-market-footer">
            <div className="market-ticker-label">
                <span className="market-ticker-dot" />
                <Activity size={13} className="market-ticker-icon" />
                <span className="market-ticker-title">LIVE MARKETS</span>
            </div>

            <div className="ticker-track-container">
                <div className="ticker-track">
                    {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, idx) => (
                        <div key={idx} className="ticker-item">
                            <span className="ticker-symbol">{item.symbol}</span>
                            {item.filing && <span className="ticker-badge">{item.filing}</span>}
                            <span className={`ticker-change ${item.isUp ? 'up' : 'down'}`}>
                                {item.change}
                            </span>
                            <span className="ticker-metric">{item.metric}</span>
                            <span className="ticker-separator">•</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="market-ticker-right">
                <span className="market-ticker-status">NIFTY 50 CORPUS</span>
            </div>
        </div>
    );
}
