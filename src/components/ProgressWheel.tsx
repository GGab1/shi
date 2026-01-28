type Props = {
  done: number;
  toDo: number;
};

export const ProgressWheel = ({ done, toDo }: Props) => {
  const total = done + toDo;
  const percentage = total === 0 ? 0 : Math.round((done / total) * 100);

  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-[140px] h-[140px]">
      {/* SVG */}
      <svg width="140" height="140">
        {/* Background circle */}
        <circle
          cx="70"
          cy="70"
          r={radius}
          stroke="rgb(39,39,42)"
          strokeWidth="10"
          fill="transparent"
        />

        {/* Progress circle */}
        <circle
          cx="70"
          cy="70"
          r={radius}
          stroke="rgb(34,211,238)"
          strokeWidth="10"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 70 70)"
        />
      </svg>

      {/* Centered text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="text-3xl font-extrabold text-cyan-300">{percentage}%</p>
        <p className="text-[10px] uppercase tracking-widest text-zinc-400">
          completed
        </p>
      </div>
    </div>
  );
};
