import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const AdminPage = () => {
  const { user, makeAdmin } = useAuth()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleMakeAdmin = async () => {
    setLoading(true)
    setError("")
    setMessage("")

    const result = await makeAdmin()

    if (result.success) {
      setMessage(result.message)
    } else {
      setError(result.message)
    }

    setLoading(false)
  }

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Admin Settings</h1>

      {message && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">{message}</div>
      )}
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">User Information</h2>
        <p>
          <span className="font-medium">Name:</span> {user?.name}
        </p>
        <p>
          <span className="font-medium">Email:</span> {user?.email}
        </p>
        <p>
          <span className="font-medium">Admin Status:</span> {user?.isAdmin ? "Admin" : "Regular User"}
        </p>
      </div>

      {!user?.isAdmin && (
        <button
          onClick={handleMakeAdmin}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full mb-4"
        >
          {loading ? "Processing..." : "Make Admin"}
        </button>
      )}

      <button
        onClick={() => navigate("/")}
        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
      >
        Back to Home
      </button>
    </div>
  )
}

export default AdminPage