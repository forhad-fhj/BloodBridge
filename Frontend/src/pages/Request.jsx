import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { AuthContext } from "../providers/AuthProvider";
import useAxiosPublic from "../hooks/axiosPublic";
import PageTitle from "../components/PageTitle";
import Loader from "../components/Loader";
import UrgencyMatrix from "../components/UrgencyMatrix";
import AmbulanceDirectory from "../components/AmbulanceDirectory";
import ClinicHighlights from "../components/ClinicHighlights";

export default function Request() {
  const { user } = useContext(AuthContext);
  const axiosPublic = useAxiosPublic();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [urgencyFilter, setUrgencyFilter] = useState("all");

  useEffect(() => {
    axiosPublic
      .get("/all-donation-requests-public")
      .then((res) => setDonations(res.data))
      .catch((err) => {
        console.error("Error fetching donation requests:", err);
      })
      .finally(() => setLoading(false));
  }, [user]);

  const filteredRequests = useMemo(() => {
    if (urgencyFilter === "all") return donations;
    return donations.filter(
      (item) => (item.urgencyLevel || "urgent") === urgencyFilter
    );
  }, [donations, urgencyFilter]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <PageTitle title={"Request"} />

      <div className="text-center mb-8 sm:mb-12">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black bg-gradient-to-r from-rose-600 to-red-600 bg-clip-text text-transparent mb-3">
          Blood Donation Requests
        </h2>
        <p className="text-gray-600 text-sm sm:text-base">
          Find urgent blood requests and be someone's hero
        </p>
      </div>

      <div className="flex justify-end mb-4">
        <select
          value={urgencyFilter}
          onChange={(e) => setUrgencyFilter(e.target.value)}
          className="border border-rose-200 rounded-xl px-4 py-2 text-sm font-semibold"
        >
          <option value="all">All Urgencies</option>
          <option value="critical">Critical (3h)</option>
          <option value="urgent">Urgent (24h)</option>
          <option value="flexible">Flexible (2-3 days)</option>
        </select>
      </div>

      {loading ? (
        <Loader label="Loading pending requests..." />
      ) : filteredRequests.length === 0 ? (
        <div className="glass p-12 rounded-2xl text-center">
          <div className="text-6xl mb-4">🩸</div>
          <p className="text-text text-lg">
            No pending donation requests found.
          </p>
        </div>
      ) : (
        <div className="glass rounded-2xl overflow-hidden shadow-2xl border border-rose-200">
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm min-w-[640px]">
              <thead className="bg-gradient-to-r from-rose-50 to-red-50">
                <tr>
                  <th className="px-3 sm:px-4 py-3 sm:py-4 text-left font-bold text-gray-700">
                    Recipient
                  </th>
                  <th className="px-3 sm:px-4 py-3 sm:py-4 text-left font-bold text-gray-700">
                    Location
                  </th>
                  <th className="px-3 sm:px-4 py-3 sm:py-4 text-left font-bold text-gray-700">
                    Urgency
                  </th>
                  <th className="px-3 sm:px-4 py-3 sm:py-4 text-left font-bold text-gray-700">
                    Date & Time
                  </th>
                  <th className="px-3 sm:px-4 py-3 sm:py-4 text-center font-bold text-gray-700">
                    Blood Group
                  </th>
                  <th className="px-3 sm:px-4 py-3 sm:py-4 text-center font-bold text-gray-700">
                    Ambulance
                  </th>
                  <th className="px-3 sm:px-4 py-3 sm:py-4 text-center font-bold text-gray-700">
                    Status
                  </th>
                  <th className="px-3 sm:px-4 py-3 sm:py-4 text-center font-bold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="text-text">
                {filteredRequests.map((donation) => (
                  <tr
                    key={donation._id}
                    className="border-b border-rose-100 hover:bg-rose-50 transition-colors"
                  >
                    <td className="px-2 sm:px-3 py-2 sm:py-3 font-medium text-left">
                      {donation.recipientName}
                    </td>
                    <td className="px-2 sm:px-3 py-2 sm:py-3 text-left">
                      {donation.recipientDistrict}, {donation.recipientUpazila}
                    </td>
                    <td className="px-2 sm:px-3 py-2 sm:py-3 text-left">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          donation.urgencyLevel === "critical"
                            ? "bg-red-100 text-red-600"
                            : donation.urgencyLevel === "urgent"
                            ? "bg-orange-100 text-orange-600"
                            : "bg-emerald-100 text-emerald-600"
                        }`}
                      >
                        {donation.urgencyLevel || "urgent"}
                      </span>
                    </td>
                    <td className="px-2 sm:px-3 py-2 sm:py-3 text-left">
                      {donation.donationDate}
                      <br />
                      <span className="text-xs opacity-75">
                        {donation.donationTime}
                      </span>
                    </td>
                    <td className="px-2 sm:px-3 py-2 sm:py-3 font-semibold text-highlighted text-center">
                      {donation.bloodGroup}
                    </td>
                    <td className="px-2 sm:px-3 py-2 sm:py-3 text-center text-xs">
                      {donation.needsAmbulance ? (
                        <span className="px-2 py-1 rounded-full bg-rose-100 text-rose-600 font-semibold">
                          SOS linked
                        </span>
                      ) : (
                        <span className="text-slate-500">Not requested</span>
                      )}
                    </td>
                    <td className="px-2 sm:px-3 py-2 sm:py-3 capitalize text-center">
                      {donation.donationStatus}
                    </td>

                    <td className="px-3 sm:px-4 py-3 sm:py-4 text-center">
                      <Link
                        to={`/details/${donation._id}`}
                        className="inline-block px-4 py-2 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Resource Hub */}
      <section className="mt-16 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h3 className="text-3xl sm:text-4xl font-black text-slate-900">
            Lifesaver Support Hub
          </h3>
          <p className="text-slate-600">
            Triage urgent donor needs, dispatch ambulances, and find verified hematology
            clinics—all without leaving the Request center.
          </p>
        </div>
        <UrgencyMatrix />
        <AmbulanceDirectory />
        <ClinicHighlights />
      </section>
    </div>
  );
}
