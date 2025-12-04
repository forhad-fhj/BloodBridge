import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import { useParams, useNavigate } from "react-router";
import useAxiosSecure from "../hooks/useAxiosSecure";
import Swal from "sweetalert2";

export default function UpdateDonationRequest() {
  const { ID } = useParams();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const [details, setDetails] = useState(null);

  useEffect(() => {
    axiosSecure.get(`/get-donation-request/${ID}`).then((res) => {
      setDetails(res.data);
    });
  }, [ID]);

  if (!details) return <Loader label="Loading request..." full={true} />;

  const handleUpdate = async (e) => {
    e.preventDefault();
    const form = e.target;

    const updatedRequest = {
      requesterName: form.requesterName.value,
      requesterEmail: details.requesterEmail, // keep email from original data
      recipientName: form.recipientName.value,
      recipientDistrict: form.recipientDistrict.value,
      recipientUpazila: form.recipientUpazila.value,
      hospitalName: form.hospitalName.value,
      fullAddress: form.fullAddress.value,
      bloodGroup: form.bloodGroup.value,
      donationDate: form.donationDate.value,
      donationTime: form.donationTime.value,
      requestMessage: form.requestMessage.value,
      donationStatus: details.donationStatus, // preserve status
    };

    try {
      const res = await axiosSecure.put(
        `/update-donation-request/${ID}`,
        updatedRequest
      );

      if (res.data.modifiedCount > 0) {
        Swal.fire("Success!", "Request updated successfully.", "success");
        navigate("/dashboard/my-donation-requests");
      } else {
        Swal.fire("Info", "No changes made.", "info");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Failed to update request.", "error");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h2 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-rose-600 to-red-600 bg-clip-text text-transparent">
        Update Donation Request
      </h2>
      <form onSubmit={handleUpdate} className="glass p-8 rounded-2xl space-y-6">
        <div>
          <label className="block font-medium mb-2 text-slate-700">
            Requester Name
          </label>
          <input
            type="text"
            name="requesterName"
            defaultValue={details.requesterName}
            className="w-full border-2 border-rose-200 p-3 rounded-lg focus:ring-2 focus:ring-rose-400 transition-all"
          />
        </div>

        <div>
          <label className="block font-medium mb-2 text-slate-700">
            Requester Email
          </label>
          <input
            type="email"
            name="requesterEmail"
            defaultValue={details.requesterEmail}
            className="w-full border-2 border-rose-200 p-3 rounded-lg bg-slate-50"
            readOnly
          />
        </div>

        <div>
          <label className="block font-medium mb-2 text-slate-700">
            Recipient Name
          </label>
          <input
            type="text"
            name="recipientName"
            defaultValue={details.recipientName}
            className="w-full border-2 border-rose-200 p-3 rounded-lg focus:ring-2 focus:ring-rose-400 transition-all"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-2 text-slate-700">
              District
            </label>
            <input
              type="text"
              name="recipientDistrict"
              defaultValue={details.recipientDistrict}
              className="w-full border-2 border-rose-200 p-3 rounded-lg focus:ring-2 focus:ring-rose-400 transition-all"
            />
          </div>
          <div>
            <label className="block font-medium mb-2 text-slate-700">
              Upazila
            </label>
            <input
              type="text"
              name="recipientUpazila"
              defaultValue={details.recipientUpazila}
              className="w-full border-2 border-rose-200 p-3 rounded-lg focus:ring-2 focus:ring-rose-400 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block font-medium mb-2 text-slate-700">
            Hospital Name
          </label>
          <input
            type="text"
            name="hospitalName"
            defaultValue={details.hospitalName}
            className="w-full border-2 border-rose-200 p-3 rounded-lg focus:ring-2 focus:ring-rose-400 transition-all"
          />
        </div>

        <div>
          <label className="block font-medium mb-2 text-slate-700">
            Full Address
          </label>
          <textarea
            name="fullAddress"
            defaultValue={details.fullAddress}
            className="w-full border-2 border-rose-200 p-3 rounded-lg focus:ring-2 focus:ring-rose-400 transition-all"
          ></textarea>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-2 text-slate-700">
              Blood Group
            </label>
            <input
              type="text"
              name="bloodGroup"
              defaultValue={details.bloodGroup}
              className="w-full border-2 border-rose-200 p-3 rounded-lg focus:ring-2 focus:ring-rose-400 transition-all"
            />
          </div>
          <div>
            <label className="block font-medium mb-2 text-slate-700">
              Status
            </label>
            <input
              type="text"
              name="donationStatus"
              defaultValue={details.donationStatus}
              className="w-full border-2 border-rose-200 p-3 rounded-lg bg-slate-50 capitalize"
              readOnly
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-2 text-slate-700">
              Date
            </label>
            <input
              type="date"
              name="donationDate"
              defaultValue={details.donationDate}
              className="w-full border-2 border-rose-200 p-3 rounded-lg focus:ring-2 focus:ring-rose-400 transition-all"
            />
          </div>
          <div>
            <label className="block font-medium mb-2 text-slate-700">
              Time
            </label>
            <input
              type="time"
              name="donationTime"
              defaultValue={details.donationTime}
              className="w-full border-2 border-rose-200 p-3 rounded-lg focus:ring-2 focus:ring-rose-400 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block font-medium mb-2 text-slate-700">
            Request Message
          </label>
          <textarea
            name="requestMessage"
            defaultValue={details.requestMessage}
            className="w-full border-2 border-rose-200 p-3 rounded-lg focus:ring-2 focus:ring-rose-400 transition-all"
            rows="4"
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
        >
          Update Request
        </button>
      </form>
    </div>
  );
}
