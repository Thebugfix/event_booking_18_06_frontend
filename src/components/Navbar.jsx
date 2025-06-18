import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const Navbar = () => {
  const { isAuthenticated, logout, user, isAdmin } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-xl font-bold">
            Event Booking
          </Link>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <span className="hidden md:inline">Welcome, {user?.name}</span>
                <Link to="/" className="hover:text-blue-200">
                  Events
                </Link>
                <Link to="/bookings" className="hover:text-blue-200">
                  My Bookings
                </Link>
                {/* <Link to="/admin" className="hover:text-blue-200">
                  Admin
                </Link> */}
                {isAdmin && (
                  <Link to="/add-event" className="hover:text-blue-200">
                    Add Event
                  </Link>
                )}
                <button onClick={handleLogout} className="bg-blue-700 hover:bg-blue-800 px-3 py-1 rounded">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-blue-200">
                  Login
                </Link>
                <Link to="/register" className="bg-blue-700 hover:bg-blue-800 px-3 py-1 rounded">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar