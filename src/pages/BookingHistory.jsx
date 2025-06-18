import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { format } from "date-fns"

const BookingHistory = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get("/api/bookings/user")
        setBookings(res.data)
        setLoading(false)
      } catch (error) {
        setError("Failed to fetch bookings")
        setLoading(false)
      }
    }

    fetchBookings()
  }, [])

  const handleCancelBooking = async (bookingId) => {
    try {
      await axios.delete(`/api/bookings/${bookingId}`)

      // Update the booking status in the UI
      setBookings(bookings.map((booking) => (booking._id === bookingId ? { ...booking, status: "Canceled" } : booking)))
    } catch (error) {
      setError("Failed to cancel booking")
    }
  }

  const getStatusClass = (status) => {
    switch (status) {
      case "Booked":
        return "bg-blue-100 text-blue-800"
      case "Completed":
        return "bg-green-100 text-green-800"
      case "Canceled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">My Bookings</h1>

      {bookings.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600">You haven't booked any events yet.</p>
          <Link to="/" className="text-blue-500 hover:text-blue-700 mt-4 inline-block">
            Browse Events
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Event
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bookings.map((booking) => (
                <tr key={booking._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      <Link to={`/events/${booking.event._id}`} className="hover:text-blue-500">
                        {booking.event.title}
                      </Link>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{format(new Date(booking.event.date), "MMM dd, yyyy")}</div>
                    <div className="text-sm text-gray-500">{format(new Date(booking.event.date), "h:mm a")}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(booking.status)}`}
                    >
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {booking.status === "Booked" && (
                      <button
                        onClick={() => handleCancelBooking(booking._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default BookingHistory