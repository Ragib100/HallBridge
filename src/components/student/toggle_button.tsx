import Switch from '@mui/material/Switch';

export default function Toggle({value, onChange, mealtype }: { onChange?: (value: boolean) => void; value: boolean; mealtype?: string }) {
    return (
        <div className="flex items-center justify-between mb-4 ml-8 mt-4">
            <div>{mealtype}</div>
            <Switch 
                checked={value}
                onChange={(e) => {
                    if (onChange) {
                        onChange(e.target.checked);
                    }
                }}
                sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                        color: 'green',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: 'green',
                    },
                }}
            />
        </div>
    );
}
