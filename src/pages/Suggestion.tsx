import { useState } from "react";
import emailjs from "@emailjs/browser";

export const Suggestion = () => {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      setStatus("Please write your suggestion");
      return;
    }

    setLoading(true);
    const templateParams = { message };

    emailjs
      .send(
        "service_l3kl2yx",
        "template_zm4xyze",
        templateParams,
        "qARIVX4aNmUvVz7h9",
      )
      .then(
        () => {
          setStatus("Thanks for your suggestion!");
          setMessage("");
          setLoading(false);
        },
        (err) => {
          console.error(err);
          setStatus("Error sending. Please try again.");
          setLoading(false);
        },
      );
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div>
        <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Suggest a Character
        </h2>
      </div>

      <div className="relative">
        <textarea
          placeholder="Which character would you like to see? Include the franchise name..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={loading}
          className="w-full px-6 py-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 text-white placeholder-gray-500 resize-none h-40 focus:border-purple-500/50 focus:bg-white/10 outline-none transition-all duration-300 disabled:opacity-50"
        />
        <div className="absolute bottom-4 right-4 text-xs text-gray-500">
          {message.length} / 500
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || !message.trim()}
        className="relative overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl px-8 py-4 font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Sending...
            </>
          ) : (
            <>💡 Submit Suggestion</>
          )}
        </span>
      </button>

      {status && (
        <div
          className={`
            px-6 py-4 rounded-2xl border text-center font-medium
            ${
              status.includes("Thanks")
                ? "bg-green-500/10 border-green-500/30 text-green-400"
                : status.includes("Error")
                  ? "bg-red-500/10 border-red-500/30 text-red-400"
                  : "bg-yellow-500/10 border-yellow-500/30 text-yellow-400"
            }
          `}
        >
          {status}
        </div>
      )}
    </form>
  );
};
