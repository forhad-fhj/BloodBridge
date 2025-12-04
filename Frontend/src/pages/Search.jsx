import { useEffect, useState } from "react";
import axios from "axios";
import useAxiosPublic from "../hooks/axiosPublic";
import PageTitle from "../components/PageTitle";

const Search = () => {
  const axiosPublic = useAxiosPublic();
  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);
  const [filteredUpazilas, setFilteredUpazilas] = useState([]);
  const [donors, setDonors] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [donorHistory, setDonorHistory] = useState({});

  const [formData, setFormData] = useState({
    bloodGroup: "",
    district: "",
    districtId: "",
    upazila: "",
    availability: "",
  });

  // Load districts and upazilas
  useEffect(() => {
    const fetchData = async () => {
      const [districtRes, upazilaRes] = await Promise.all([
        axios.get("/districts.json"),
        axios.get("/upazilas.json"),
      ]);
      setDistricts(districtRes.data);
      setUpazilas(upazilaRes.data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    axiosPublic
      .get("/donor-history")
      .then(({ data }) => {
        const mapping = {};
        data.forEach((item) => {
          mapping[item._id] = item;
        });
        setDonorHistory(mapping);
      })
      .catch(() => {
        setDonorHistory({});
      });
  }, [axiosPublic]);

  // Update filtered upazilas based on district selection
  useEffect(() => {
    if (formData.districtId) {
      const filtered = upazilas.filter(
        (u) => u.district_id === formData.districtId
      );
      setFilteredUpazilas(filtered);
    } else {
      setFilteredUpazilas([]);
    }
  }, [formData.districtId, upazilas]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // When district changes, update both name & id
    if (name === "district") {
      const selectedDistrict = districts.find((d) => d.name === value);
      setFormData((prev) => ({
        ...prev,
        district: value,
        districtId: selectedDistrict ? selectedDistrict.id : "",
        upazila: "",
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    try {
      const res = await axiosPublic.get("/get-donors");
      const allDonors = res.data;
      setDonors(allDonors);

      // Filter based on formData
      const filtered = allDonors.filter((donor) => {
        return (
          donor.role === "donor" &&
          donor.status === "active" &&
          (formData.bloodGroup
            ? donor.bloodGroup === formData.bloodGroup
            : true) &&
          (formData.district ? donor.district === formData.district : true) &&
          (formData.upazila ? donor.upazila === formData.upazila : true) &&
          (formData.availability
            ? donor.availabilityStatus === formData.availability
            : true)
        );
      });

      setSearchResult(filtered);
    } catch (error) {
      console.error("Search failed:", error);
    }
  };

  const badgeForDonations = (count = 0) => {
    if (count >= 5) return { label: "Gold", color: "bg-yellow-100 text-yellow-700" };
    if (count >= 3) return { label: "Silver", color: "bg-gray-100 text-gray-700" };
    if (count >= 1) return { label: "Bronze", color: "bg-amber-100 text-amber-700" };
    return null;
  };

  return (
    <div className="min-h-screen container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <PageTitle title={"Search"} />

      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black bg-gradient-to-r from-rose-600 to-red-600 bg-clip-text text-transparent mb-3">
          Find a Blood Donor
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Search for available blood donors in your area
        </p>
      </div>

      <form
        onSubmit={handleSearch}
        className="glass border-2 border-rose-200 rounded-2xl shadow-xl p-6 sm:p-8 mb-10 sm:mb-12"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          {/* Inputs will go here */}
          {/* Blood Group */}
          <select
            name="bloodGroup"
            value={formData.bloodGroup}
            onChange={handleChange}
            className="border-border border rounded-lg px-3 py-2.5 bg-white text-text text-sm sm:text-base focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all"
          >
            <option value="">Select Blood Group</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>

          {/* District */}
          <select
            name="district"
            value={formData.district}
            onChange={handleChange}
            className="border-border border rounded-lg px-3 py-2.5 bg-white text-text text-sm sm:text-base focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all"
          >
            <option value="">Select District</option>
            {districts.map((district) => (
              <option key={district.id} value={district.name}>
                {district.name}
              </option>
            ))}
          </select>

          {/* Upazila */}
          <select
            name="upazila"
            value={formData.upazila}
            onChange={handleChange}
            className="border-border border rounded-lg px-3 py-2.5 bg-white text-text text-sm sm:text-base focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!filteredUpazilas.length}
          >
            <option value="">Select Upazila</option>
            {filteredUpazilas.map((u) => (
              <option key={u.id} value={u.name}>
                {u.name}
              </option>
            ))}
          </select>

          {/* Availability */}
          <select
            name="availability"
            value={formData.availability}
            onChange={handleChange}
            className="border-border border rounded-lg px-3 py-2.5 bg-white text-text text-sm sm:text-base focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all"
          >
            <option value="">Availability</option>
            <option value="available">Available Now</option>
            <option value="resting">Resting</option>
            <option value="medical-review">Medical Review</option>
          </select>
        </div>

        {/* Search Button */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white rounded-xl px-6 py-4 text-base font-bold shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          Search Donors
        </button>
      </form>

      {/* Search Result */}
      {searchResult.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {searchResult.map((donor) => {
            const history = donorHistory[donor.email] || {};
            const badge = badgeForDonations(history.totalDonations);
            const verified = history.totalDonations > 0;
            return (
            <div
              key={donor._id}
              className="group relative glass border-2 border-rose-200 rounded-2xl shadow-lg hover:shadow-2xl p-6 text-center transition-all duration-300 hover:-translate-y-2 card-hover overflow-hidden"
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-rose-600/10 to-red-600/10 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300"></div>

              <div className="relative z-10">
                <div className="relative inline-block mb-4">
                  <img
                    src={donor.image}
                    alt={donor.name}
                    className="w-24 h-24 mx-auto rounded-full object-cover border-4 border-white shadow-xl group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-rose-600 to-red-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                    {donor.bloodGroup}
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 mb-2">
                  <h3 className="font-bold text-lg text-text line-clamp-1 group-hover:text-rose-600 transition-colors">
                    {donor.name}
                  </h3>
                  {verified && (
                    <span className="text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 font-semibold">
                      Verified
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-center gap-1 text-sm text-gray-600 mb-3">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span className="line-clamp-1">
                    {donor.upazila}, {donor.district}
                  </span>
                </div>

                <div className="flex items-center justify-center gap-2 text-xs text-slate-500 mb-3">
                  <span className="px-2 py-1 rounded-full bg-slate-100 capitalize">
                    {donor.availabilityStatus || "available"}
                  </span>
                  {badge && (
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${badge.color}`}>
                      {badge.label} • {history.totalDonations} donations
                    </span>
                  )}
                </div>

                {history.lastDonationDate && (
                  <p className="text-xs text-slate-500 mb-2">
                    Last donation: {new Date(history.lastDonationDate).toLocaleDateString()}
                  </p>
                )}

                <div className="flex items-center justify-center gap-1 text-xs text-blue-600 break-all">
                  <svg
                    className="w-4 h-4 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="line-clamp-1">{donor.email}</span>
                </div>
              </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-text">
          {donors.length > 0
            ? "No donor found!"
            : "Please search to find donors."}
        </p>
      )}
    </div>
  );
};

export default Search;
