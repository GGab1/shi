import { useEffect, useState } from "react";

export const CommissionBanner = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const closed = localStorage.getItem("commission-banner-closed");
    if (closed === "true") setVisible(false);
  }, []);

  const close = () => {
    localStorage.setItem("commission-banner-closed", "true");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="relative w-full bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 backdrop-blur-xl">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAgMi4yMS0xLjc5IDQtNCA0cy00LTEuNzktNC00IDEuNzktNCA0LTQgNCAxLjc5IDQgNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>

      <div className="relative flex items-center justify-between px-6 py-4 lg:px-12">
        {/* Content */}
        <div className="flex-1 pr-12">
          <p className="text-white font-bold text-lg mb-1">Commissions Open!</p>
          <p className="text-white/90 text-sm leading-relaxed">
            Working solo on this project. Submit each character only once —
            creating icons takes time. Thanks for your patience!
          </p>
        </div>

        {/* Close button */}
        <button
          onClick={close}
          className="shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:scale-110 transition-all duration-300"
          aria-label="Close banner"
        >
          ✕
        </button>
      </div>
    </div>
  );
};
