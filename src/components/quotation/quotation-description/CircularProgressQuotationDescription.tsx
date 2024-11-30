export const CircularProgress: React.FC<{
    percentage: number;
    color: string;
    icon: React.ReactNode;
}> = ({ percentage, color, icon }) => {
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div className="relative inline-flex items-center justify-center">
            <svg className="h-36 w-36">
                <circle
                    className="text-muted-foreground"
                    strokeWidth="8"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="72"
                    cy="72"
                />
                <circle
                    className={`${color} transition-all duration-300 ease-in-out`}
                    strokeWidth="8"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="72"
                    cy="72"
                    transform="rotate(-90 72 72)"
                />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
                {icon}
                <span className="text-base font-light">{percentage}%</span>
            </div>
        </div>
    );
};
