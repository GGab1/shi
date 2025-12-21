import { useState } from "react"
import emailjs from "@emailjs/browser"

export const Suggestion = () => {
  const [message, setMessage] = useState("")
  const [status, setStatus] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message) {
      setStatus("Your suggestion.")
      return
    }

    const templateParams = { message }

    emailjs
      .send("service_l3kl2yx", "template_zm4xyze", templateParams, "qARIVX4aNmUvVz7h9")
      .then(
        () => {
          setStatus("Thanks for your suggestion !")
          setMessage("")
        },
        (err) => {
          console.error(err)
          setStatus("Error while sending, please try again.")
        }
      )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold mb-4 text-yellow-400">Send a suggestion</h2>

      <textarea
        placeholder="Write your suggestion here..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="px-4 py-2 rounded bg-zinc-800 text-white resize-none h-32"
      />

      <button
        type="submit"
        className="bg-yellow-400 text-black px-4 py-2 rounded font-bold hover:bg-yellow-500 transition"
      >
        Send
      </button>

      {status && <p className="text-sm mt-2 text-white">{status}</p>}
    </form>
  )
}
