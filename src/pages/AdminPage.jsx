import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const AdminPage = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  // Fetch logged-in user info
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token")
        if (token) {
          const res = await axios.get(`${API_BASE_URL}/api/users/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          setUser(res.data)
        } else {
          navigate("/login")
        }
      } catch (err) {
        console.error(err)
        navigate("/login")
      }
    }

    fetchUser()
  }, [navigate])

  const handleMakeAdmin = async () => {
    setLoading(true)
    setError("")
    setMessage("")

    try {
      const token = localStorage.getItem("token")
      const res = await axios.post(
        `${API_BASE_URL}/api/users/make-admin`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      setUser(res.data.user)
      setMessage(res.data.message)
    } catch (err) {
      setError(err.response?.data?.message || "Failed to make admin")
    }

    setLoading(false)
  }

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Admin Settings</h1>

      {message && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">{message}</div>
      )}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>
      )}

      {user && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">User Information</h2>
          <p>
            <span className="font-medium">Name:</span> {user.name}
          </p>
          <p>
            <span className="font-medium">Email:</span> {user.email}
          </p>
          <p>
            <span className="font-medium">Admin Status:</span> {user.isAdmin ? "Admin" : "Regular User"}
          </p>
        </div>
      )}

      {user && !user.isAdmin && (
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
