import Switch from '@mui/material/Switch';

export default function Toggle({value, onChange, mealtype }: { onChange?: (value: boolean) => void; value: boolean; mealtype?: string }) {
    const mealIcons: Record<string, string> = {
        'Breakfast': '🍳',
        'Lunch': '🍛',
        'Dinner': '🍽️'
    };

    return (
        <div className={`flex items-center justify-between p-4 rounded-xl border-2 transition-colors ${
            value ? 'border-[#2D6A4F] bg-[#2D6A4F]/5' : 'border-gray-200 bg-gray-50'
        }`}>
            <div className="flex items-center gap-3">
                <span className="text-2xl">{mealIcons[mealtype || ''] || '🍴'}</span>
                <span className="font-medium text-gray-800">{mealtype}</span>
            </div>
            <Switch 
                checked={value}
                onChange={(e) => {
                    if (onChange) {
                        onChange(e.target.checked);
                    }
                }}
                sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#2D6A4F',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#2D6A4F',
                    },
                }}
            />
        </div>
    );
}
