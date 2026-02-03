type Props = {
  done: number;
  toDo: number;
};

export const ProgressWheel = ({ done, toDo }: Props) => {
  const total = done + toDo;
  const percentage = total === 0 ? 0 : Math.round((done / total) * 100);

  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-[180px] h-[180px] shrink-0">
      {/* Outer glow ring */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-600/20 to-pink-600/20 blur-xl"></div>

      {/* SVG */}
      <svg width="180" height="180" className="relative z-10">
        {/* Background circle */}
        <circle
          cx="90"
          cy="90"
          r={radius}
          stroke="rgb(39,39,42)"
          strokeWidth="12"
          fill="transparent"
        />

        {/* Progress circle */}
        <circle
          cx="90"
          cy="90"
          r={radius}
          stroke="url(#gradient)"
          strokeWidth="12"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 90 90)"
          className="transition-all duration-1000 ease-out"
        />

        {/* Gradient definition */}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgb(147, 51, 234)" />
            <stop offset="100%" stopColor="rgb(236, 72, 153)" />
          </linearGradient>
        </defs>
      </svg>

      {/* Centered text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="text-5xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          {percentage}%
        </p>
        <p className="text-xs uppercase tracking-widest text-gray-400 mt-1 font-bold">
          Completed
        </p>
      </div>
    </div>
  );
};
