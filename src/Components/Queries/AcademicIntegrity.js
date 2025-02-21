import React from "react";
import axios from "axios";
import UserContext from "../../Hooks/UserContext";
import { TableHeader } from "../Table";
import Loading from "../Layouts/Loading";
import ErrorStrip from "../ErrorStrip";
const MockAdapter = require("axios-mock-adapter");
const mock = new MockAdapter(axios);

// Sample data
const sampleFacilities = [
  {
    _id: "1",
    name: "Tennis Court",
    location: "Sports Complex",
    status: "Available",
    bookedBy: null,
  },
  {
    _id: "2",
    name: "Auditorium",
    location: "Main Building",
    status: "Booked",
    bookedBy: "user123",
  },
  {
    _id: "3",
    name: "Conference Room",
    location: "Block A",
    status: "Pending Approval",
    bookedBy: "sampleUserId",
  },
];

// Mocking the endpoints
mock.onGet("/facility").reply(200, sampleFacilities);
mock.onPost("/facility/book").reply((config) => {
  const { facilityId, userId } = JSON.parse(config.data);
  const facility = sampleFacilities.find(f => f._id === facilityId);
  if (facility) {
    facility.status = "Booked";
    facility.bookedBy = userId;
    return [200, facility];
  }
  return [400, { message: "Facility not found" }];
});
mock.onPost("/facility/approve").reply((config) => {
  const { facilityId } = JSON.parse(config.data);
  const facility = sampleFacilities.find(f => f._id === facilityId);
  if (facility) {
    facility.status = "Approved";
    return [200, facility];
  }
  return [400, { message: "Facility not found" }];
});
mock.onPost("/facility/reject").reply((config) => {
  const { facilityId } = JSON.parse(config.data);
  const facility = sampleFacilities.find(f => f._id === facilityId);
  if (facility) {
    facility.status = "Available";
    facility.bookedBy = null;
    return [200, facility];
  }
  return [400, { message: "Facility not found" }];
});

const CampusFacilityBooking = () => {
  const { user } = React.useContext(UserContext);
  const [facilities, setFacilities] = React.useState([]);
  const [error, setError] = React.useState("");
  const [bookingError, setBookingError] = React.useState("");
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const response = await axios.get("/facility");
        console.log("Response Data:", response.data); // Log response data
        setFacilities(response.data);
      } catch (err) {
        setError(err.message || "Error fetching facilities");
      } finally {
        setLoading(false);
      }
    };
    fetchFacilities();
  }, [user._id]);

  // Handler for booking a facility
  const handleBooking = async (facilityId) => {
    try {
      await axios.post("/facility/book", { facilityId, userId: user._id });
      const updated = await axios.get("/facility");
      setFacilities(updated.data);
    } catch (err) {
      setBookingError(err.message || "Error booking facility");
    }
  };

  // Handler for approving a booking
  const handleApprove = async (facilityId) => {
    try {
      await axios.post("/facility/approve", { facilityId });
      const updated = await axios.get("/facility");
      setFacilities(updated.data);
    } catch (err) {
      setBookingError(err.message || "Error approving facility");
    }
  };

  // Handler for rejecting a booking
  const handleReject = async (facilityId) => {
    try {
      await axios.post("/facility/reject", { facilityId });
      const updated = await axios.get("/facility");
      setFacilities(updated.data);
    } catch (err) {
      setBookingError(err.message || "Error rejecting facility");
    }
  };

  return (
    <main className="facility-booking">
      <h2 className="mb-2 mt-3 whitespace-break-spaces text-4xl font-bold text-violet-950 underline decoration-inherit decoration-2 underline-offset-4 dark:mt-0 dark:text-slate-400 md:text-6xl">
        Campus Facility Booking System
      </h2>
      <div>{error ? <ErrorStrip error={error} /> : ""}</div>
      <div>{bookingError ? <ErrorStrip error={bookingError} /> : ""}</div>
      {loading ? (
        <Loading />
      ) : facilities.length ? (
        <section className="my-4 w-full overflow-auto rounded-md border-2 border-slate-900 dark:border-slate-500 dark:p-[1px]">
          <table className="w-full">
            <TableHeader
              AdditionalHeaderClasses={"first:text-left"}
              Headers={["Facility", "Location", "Status", "Action"]}
            />
            <tbody className="text-left">
              {facilities.map((facility, index) => (
                <tr key={facility._id || index} className="border-t-[1px] border-violet-500">
                  <td className="p-2 text-left">{facility.name}</td>
                  <td className="p-2 text-center">{facility.location || "N/A"}</td>
                  <td className="p-2 text-center">{facility.status}</td>
                  <td className="p-2 text-center">
                    {facility.status === "Available" ? (
                      <button
                        onClick={() => handleBooking(facility._id)}
                        className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                      >
                        Book
                      </button>
                    ) : facility.status === "Pending Approval" ? (
                      user.role === "admin" ? (
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleApprove(facility._id)}
                            className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(facility._id)}
                            className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                          >
                            Reject
                          </button>
                        </div>
                      ) : facility.bookedBy === user._id ? (
                        <span className="text-yellow-600">Pending Your Approval</span>
                      ) : (
                        <span className="text-yellow-600">Pending Approval</span>
                      )
                    ) : (
                      <span className="text-red-600">
                        {facility.bookedBy === user._id ? "Booked by You" : "Booked"}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ) : (
        <div className="p-4 text-center">No facilities available at the moment.</div>
      )}
    </main>
  );
};