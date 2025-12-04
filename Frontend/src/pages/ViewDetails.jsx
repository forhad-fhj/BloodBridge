import React, { useContext, useEffect, useState } from "react";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { AuthContext } from "../providers/AuthProvider";
import { useParams } from "react-router";
import Swal from "sweetalert2";
import useAxiosPublic from "../hooks/axiosPublic";
import PageTitle from "../components/PageTitle";
import Loader from "../components/Loader";
import QRCode from "react-qr-code";

export default function ViewDetails() {
  const { ID } = useParams();
  const axiosSecure = useAxiosSecure();
  const axiosPublic = useAxiosPublic();
  const { user } = useContext(AuthContext);
  const [details, setDetails] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    axiosSecure.get(`/details/${ID}`).then((res) => {
      setDetails(res.data);
    });
  }, [ID]);

  if (!details)
    return <Loader label="Loading donation details..." full={true} />;

  const {
    requesterName,
    requesterEmail,
    recipientName,
    recipientDistrict,
    recipientUpazila,
    hospitalName,
    fullAddress,
    bloodGroup,
    donationDate,
    donationTime,
    requestMessage,
    donationStatus,
    urgencyLevel,
    unitsNeeded,
    needsAmbulance,
    patientCondition,
    hospitalPhone,
    aiRecommendations,
  } = details;

  const handleConfirmDonation = async () => {
    try {
      // Step 1: Update donation status
      const res = await axiosSecure.patch("/donation-status", {
        id: details._id,
        donationStatus: "inprogress",
      });

      if (res.data.modifiedCount > 0) {
        // Step 2: Save donor info
        const donorInfo = {
          donorName: user?.displayName,
          donorEmail: user?.email,
          donationId: details._id,
          createdAt: new Date(),
        };

        const donorRes = await axiosPublic.post("/add-donor", donorInfo);

        if (donorRes.data.insertedId) {
          Swal.fire({
            icon: "success",
            title: "Donation In Progress!",
            text: `Thank you ${user?.displayName} for your generosity.`,
          });
        } else {
          Swal.fire({
            icon: "warning",
            title: "Donor Not Saved",
            text: "Donation status updated, but donor info wasn't saved.",
          });
        }

        setDetails({ ...details, donationStatus: "inprogress" });
        setShowModal(false);
      } else {
        Swal.fire({
          icon: "warning",
          title: "No changes made",
          text: "Donation status was not updated. It may already be in progress.",
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Something went wrong while confirming the donation.",
      });
    }
  };

  const handleDownloadQR = () => {
    const svg = document.getElementById("request-qr");
    if (!svg) return;
    const serializer = new XMLSerializer();
    const svgData = serializer.serializeToString(svg);
    const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const DOMURL = window.URL || window.webkitURL || window;
    const url = DOMURL.createObjectURL(blob);
    const img = new Image();
    img.onload = function handleImg() {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      DOMURL.revokeObjectURL(url);
      const png = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = png;
      link.download = "bloodbridge-request-qr.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
    img.src = url;
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 min-h-screen py-6 sm:py-8">
      <PageTitle title={"Details"} />

      {/* Header */}
      <div className="text-center mb-6 sm:mb-8 space-y-3">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-rose-600 to-red-600 bg-clip-text text-transparent">
          Blood Donation Request
        </h2>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <span
            className={`px-4 py-2 rounded-full text-sm font-semibold capitalize ${
              urgencyLevel === "critical"
                ? "bg-red-100 text-red-700"
                : urgencyLevel === "urgent"
                ? "bg-orange-100 text-orange-700"
                : "bg-emerald-100 text-emerald-700"
            }`}
          >
            {urgencyLevel || "urgent"}
          </span>
          <span className="px-4 py-2 rounded-full text-sm font-semibold bg-slate-100 text-slate-700">
            Units needed: {unitsNeeded || 1}
          </span>
        </div>
        <div
          className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
            donationStatus === "pending"
              ? "bg-yellow-100 text-yellow-800"
              : donationStatus === "inprogress"
              ? "bg-blue-100 text-blue-800"
              : donationStatus === "done"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          Status: {donationStatus.toUpperCase()}
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-cardBg border-border border rounded-lg p-4 sm:p-6 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Requester Information */}
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-highlighted mb-2 sm:mb-3">
                Requester Information
              </h3>
              <div className="space-y-2 text-text">
                <p>
                  <strong>Name:</strong> {requesterName}
                </p>
                <p>
                  <strong>Email:</strong> {requesterEmail}
                </p>
              </div>
            </div>

            {/* Recipient Information */}
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-highlighted mb-2 sm:mb-3">
                Recipient Information
              </h3>
              <div className="space-y-2 text-text">
                <p>
                  <strong>Name:</strong> {recipientName}
                </p>
                <p>
                  <strong>Location:</strong> {recipientUpazila},{" "}
                  {recipientDistrict}
                </p>
                <p>
                  <strong>Hospital:</strong> {hospitalName}
                </p>
                {hospitalPhone && (
                  <p>
                    <strong>Hospital Phone:</strong>{" "}
                    <a href={`tel:${hospitalPhone}`} className="text-rose-600">
                      {hospitalPhone}
                    </a>
                  </p>
                )}
                <p>
                  <strong>Address:</strong> {fullAddress}
                </p>
                {patientCondition && (
                  <p>
                    <strong>Condition:</strong> {patientCondition}
                  </p>
                )}
                <p>
                  <strong>Ambulance:</strong>{" "}
                  {needsAmbulance ? "Required / linked" : "Not requested"}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Donation Details */}
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-highlighted mb-2 sm:mb-3">
                Donation Details
              </h3>
              <div className="space-y-2 text-text">
                <p>
                  <strong>Blood Group:</strong>{" "}
                  <span className="text-highlighted font-bold">
                    {bloodGroup}
                  </span>
                </p>
                <p>
                  <strong>Date:</strong> {donationDate}
                </p>
                <p>
                  <strong>Time:</strong> {donationTime}
                </p>
              </div>
            </div>

            {/* Message */}
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-highlighted mb-2 sm:mb-3">
                Message
              </h3>
              <div className="bg-gradient-to-br from-rose-50 to-red-50 p-4 rounded-lg border-2 border-rose-200 shadow-sm">
                <p className="text-gray-800 text-base leading-relaxed">
                  {requestMessage}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Recommendations & QR */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {Array.isArray(aiRecommendations) && aiRecommendations.length > 0 && (
          <div className="border border-rose-100 rounded-2xl p-4">
            <h3 className="text-lg font-semibold text-slate-800 mb-3">
              Auto-matched donors
            </h3>
            <ul className="space-y-2 text-sm text-slate-700">
              {aiRecommendations.map((rec) => (
                <li key={rec.email} className="p-3 rounded-xl bg-rose-50 flex justify-between">
                  <div>
                    <p className="font-semibold">{rec.name}</p>
                    <p className="text-xs text-slate-500">
                      {rec.upazila}, {rec.district}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-rose-600">
                    Score {rec.score}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="border border-dashed border-rose-200 rounded-2xl p-4 text-center">
          <p className="font-semibold text-slate-700 mb-3">Scan to verify request</p>
          <div className="inline-block bg-white p-4 rounded-2xl shadow-inner">
            <QRCode id="request-qr" value={`bloodbridge:request:${details._id}`} size={140} />
          </div>
          <button
            onClick={handleDownloadQR}
            className="mt-4 px-4 py-2 rounded-lg bg-gradient-to-r from-rose-600 to-red-600 text-white text-sm font-semibold"
          >
            Download QR
          </button>
        </div>
      </div>

      {/* Action Button */}
      <div className="text-center mt-6 sm:mt-8">
        <button
          onClick={() => {
            if (
              donationStatus !== "inprogress" &&
              donationStatus !== "done" &&
              donationStatus !== "canceled"
            ) {
              setShowModal(true);
            }
          }}
          disabled={
            donationStatus === "inprogress" ||
            donationStatus === "done" ||
            donationStatus === "canceled"
          }
          className={`px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg text-base sm:text-lg font-semibold transition-all duration-300 cursor-pointer ${
            donationStatus === "inprogress" ||
            donationStatus === "done" ||
            donationStatus === "canceled"
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-cta text-btn-text hover:shadow-lg transform hover:-translate-y-0.5"
          }`}
        >
          {donationStatus === "inprogress"
            ? "Donation in Progress"
            : donationStatus === "done"
            ? "Donation Completed"
            : donationStatus === "canceled"
            ? "Request Canceled"
            : "Confirm Donation"}
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-fadeIn">
          <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-md relative border border-border transform transition-all duration-300 scale-100">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl transition-colors"
            >
              ×
            </button>

            <h3 className="text-2xl font-semibold text-highlighted mb-6 text-center">
              Confirm Donation
            </h3>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-text">
                  Donor Name
                </label>
                <input
                  type="text"
                  value={user?.displayName || ""}
                  readOnly
                  className="w-full border-border border rounded-lg px-4 py-3 bg-gray-50 text-text"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-text">
                  Donor Email
                </label>
                <input
                  type="email"
                  value={user?.email || ""}
                  readOnly
                  className="w-full border-border border rounded-lg px-4 py-3 bg-gray-50 text-text"
                />
              </div>
            </div>

            <div className="bg-rose-50 border border-border rounded-lg p-4 mb-6">
              <p className="text-sm text-highlighted font-semibold">
                ⚠️ By confirming, you agree to donate blood and will be
                contacted for further details.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-3 border border-border rounded-lg hover:bg-gray-100 text-text transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDonation}
                className="px-6 py-3 bg-cta text-btn-text rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
              >
                Confirm Donation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
