import { createContext, useState, useContext, useEffect } from "react"
import axios from "axios"

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in on initial load
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem("token")

        if (token) {
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
          const res = await axios.get("/api/users/me")
          setUser(res.data)
          setIsAuthenticated(true)
        }
      } catch (error) {
        localStorage.removeItem("token")
        delete axios.defaults.headers.common["Authorization"]
      }

      setLoading(false)
    }

    checkLoggedIn()
  }, [])

  const login = async (email, password) => {
    try {
      const res = await axios.post("/api/users/login", { email, password })
      localStorage.setItem("token", res.data.token)
      axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`
      setUser(res.data.user)
      setIsAuthenticated(true)
      return { success: true }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      }
    }
  }

  const register = async (name, email, password) => {
    try {
      const res = await axios.post("/api/users/register", { name, email, password })
      localStorage.setItem("token", res.data.token)
      axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`
      setUser(res.data.user)
      setIsAuthenticated(true)
      return { success: true }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed",
      }
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    delete axios.defaults.headers.common["Authorization"]
    setUser(null)
    setIsAuthenticated(false)
  }

  const makeAdmin = async () => {
    try {
      const res = await axios.post("/api/users/make-admin")
      setUser(res.data.user)
      return { success: true, message: res.data.message }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to make admin",
      }
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
        makeAdmin,
        isAdmin: user?.isAdmin || false,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
