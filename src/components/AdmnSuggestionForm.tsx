import { useState } from "react";
import { supabase } from "../lib/supabase";

type Props = {
  onClose: () => void;
};

export const AdminSuggestionForm = ({ onClose }: Props) => {
  const [characterName, setCharacterName] = useState("");
  const [franchise, setFranchise] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleteFranchise, setDeleteFranchise] = useState("");
  const [deleting, setDeleting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    await supabase.from("suggested_characters").insert([
      {
        character_name: characterName.trim(),
        franchise: franchise.trim().toLowerCase(),
      },
    ]);

    setCharacterName("");
    setFranchise("");
    setLoading(false);
    setCharacterName("");
    setFranchise("");
  };

  const handleDeleteFranchise = async () => {
    if (!deleteFranchise.trim()) return;

    const confirmDelete = confirm(
      `Delete ALL suggestions from "${deleteFranchise}" ?`,
    );

    if (!confirmDelete) return;

    setDeleting(true);

    const { error } = await supabase
      .from("suggested_characters")
      .delete()
      .ilike("franchise", deleteFranchise.trim().toLowerCase());

    if (error) {
      alert("Error deleting franchise");
    } else {
      alert("Franchise deleted ✅");
      setDeleteFranchise("");
    }

    setDeleting(false);
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#1a1a1a] border border-red-500 rounded-3xl p-8 w-full max-w-md shadow-2xl"
      >
        <h3 className="text-xl font-bold text-red-400 mb-6 text-center">
          🔒 Admin - Add Suggestion
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            value={characterName}
            onChange={(e) => setCharacterName(e.target.value)}
            placeholder="Character name"
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-red-500"
          />

          <input
            value={franchise}
            onChange={(e) => setFranchise(e.target.value)}
            placeholder="Franchise"
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-red-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 rounded-xl py-3 font-bold hover:bg-red-700 transition"
          >
            {loading ? "Adding..." : "Add"}
          </button>
          <hr className="border-white/10 my-6" />

          <h4 className="text-red-400 font-bold text-sm">
            ⚠ Delete entire franchise
          </h4>

          <input
            value={deleteFranchise}
            onChange={(e) => setDeleteFranchise(e.target.value)}
            placeholder="Franchise name"
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-red-500"
          />

          <button
            type="button"
            onClick={handleDeleteFranchise}
            disabled={deleting}
            className="w-full bg-red-800 rounded-xl py-3 font-bold hover:bg-red-900 transition"
          >
            {deleting ? "Deleting..." : "Delete franchise"}
          </button>
        </form>
      </div>
    </div>
  );
};
