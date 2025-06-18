import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { format } from "date-fns"
import { useAuth } from "../context/AuthContext"

const Home = () => {
  const { isAdmin } = useAuth()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [userBookings, setUserBookings] = useState([])

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const [eventsRes, bookingsRes] = await Promise.all([axios.get("/api/events"), axios.get("/api/bookings/user")])

        setEvents(eventsRes.data)

        const bookedEventIds = bookingsRes.data.map((booking) => booking.event._id)
        setUserBookings(bookedEventIds)

        setLoading(false)
      } catch (error) {
        setError("Failed to fetch events")
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  const isEventBooked = (eventId) => {
    return userBookings.includes(eventId)
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Available Events</h1>

        {isAdmin && (
          <Link to="/add-event" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            + Add New Event
          </Link>
        )}
      </div>

      {events.length === 0 ? (
        <p className="text-gray-600">No events available at the moment.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div key={event._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
                <p className="text-gray-600 mb-4">
                  {format(new Date(event.date), "MMMM dd, yyyy")} at {format(new Date(event.date), "h:mm a")}
                </p>

                {event.price && <p className="text-lg font-bold text-blue-600 mb-4">${event.price.toFixed(2)}</p>}

                <p className="text-gray-700 mb-4 line-clamp-3">{event.description}</p>

                <div className="flex justify-between items-center">
                  <Link to={`/events/${event._id}`} className="text-blue-500 hover:text-blue-700">
                    View Details
                  </Link>

                  {isEventBooked(event._id) ? (
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">Booked</span>
                  ) : (
                    <Link
                      to={`/events/${event._id}`}
                      className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded"
                    >
                      Book Now
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Home