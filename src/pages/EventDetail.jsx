import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { format } from "date-fns"

const EventDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isBooked, setIsBooked] = useState(false)
  const [bookingLoading, setBookingLoading] = useState(false)
  const [bookingError, setBookingError] = useState("")
  const [bookingSuccess, setBookingSuccess] = useState(false)

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const [eventRes, bookingsRes] = await Promise.all([
          axios.get(`/api/events/${id}`),
          axios.get("/api/bookings/user"),
        ])

        setEvent(eventRes.data)

        // Check if user has already booked this event
        const bookedEventIds = bookingsRes.data.map((booking) => booking.event._id)
        setIsBooked(bookedEventIds.includes(id))

        setLoading(false)
      } catch (error) {
        setError("Failed to fetch event details")
        setLoading(false)
      }
    }

    fetchEventDetails()
  }, [id])

  const handleBookEvent = async () => {
    setBookingLoading(true)
    setBookingError("")
    setBookingSuccess(false)

    try {
      await axios.post("/api/bookings", { eventId: id })
      setIsBooked(true)
      setBookingSuccess(true)
      setTimeout(() => {
        setBookingSuccess(false)
      }, 3000)
    } catch (error) {
      setBookingError(error.response?.data?.message || "Failed to book event")
    }

    setBookingLoading(false)
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
    <div className="bg-white rounded-lg shadow-md overflow-hidden max-w-3xl mx-auto">
      <div className="p-8">
        <button onClick={() => navigate("/")} className="text-blue-500 hover:text-blue-700 mb-6 flex items-center">
          ← Back to Events
        </button>

        <h1 className="text-3xl font-bold mb-4">{event.title}</h1>

        <div className="mb-6">
          <p className="text-gray-600 mb-2">
            <span className="font-semibold">Date:</span> {format(new Date(event.date), "MMMM dd, yyyy")}
          </p>
          <p className="text-gray-600 mb-2">
            <span className="font-semibold">Time:</span> {format(new Date(event.date), "h:mm a")}
          </p>
          {event.price && <p className="text-xl font-bold text-blue-600 mb-2">${event.price.toFixed(2)}</p>}
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Description</h2>
          <p className="text-gray-700 whitespace-pre-line">{event.description}</p>
        </div>

        {bookingSuccess && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            Event booked successfully!
          </div>
        )}

        {bookingError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{bookingError}</div>
        )}

        <div className="flex justify-end">
          {isBooked ? (
            <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full">You've booked this event</div>
          ) : (
            <button
              onClick={handleBookEvent}
              disabled={bookingLoading}
              className="bg-blue-500 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50"
            >
              {bookingLoading ? "Booking..." : "Book Now"}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default EventDetails
