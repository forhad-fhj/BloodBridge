import React, { useEffect, useState } from "react";
import Loader from "../components/Loader";
import { Link } from "react-router";
import useAxiosPublic from "../hooks/axiosPublic";
import PageTitle from "../components/PageTitle";
import HealthInsights from "../components/HealthInsights";

export default function Blog() {
  const axiosPublic = useAxiosPublic();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosPublic
      .get("/get-blogs-public")
      .then((res) => {
        setBlogs(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch blogs:", err);
        setLoading(false);
      });
  }, []);

  const staticBlogs = [
    {
      _id: "static-en-1",
      title: "Why Regular Blood Donation Matters",
      thumbnail:
        "https://images.pexels.com/photos/6823563/pexels-photo-6823563.jpeg",
      content:
        "<p>Donating blood every 3–4 months helps keep national blood banks prepared for emergencies, surgeries, and cancer treatments.</p><p>Healthy donors with stable hemoglobin and normal blood pressure can safely donate and save up to three lives with a single unit.</p>",
    },
    {
      _id: "static-bn-1",
      title: "রক্তদান কেন গুরুত্বপূর্ণ?",
      thumbnail:
        "https://images.pexels.com/photos/6285073/pexels-photo-6285073.jpeg",
      content:
        "<p>প্রতি ৩–৪ মাস অন্তর স্বেচ্ছায় রক্তদান করলে দুর্ঘটনা, অস্ত্রোপচার ও ক্যান্সার রোগীদের জন্য রক্তের সংকট অনেক কমে যায়।</p><p>এক ব্যাগ রক্ত তিনজন পর্যন্ত রোগীর জীবন বাঁচাতে পারে—তাই নিয়মিত সুস্থ রক্তদাতা হওয়া একটি বড় সাদকাহ কাজ।</p>",
    },
    {
      _id: "static-en-2",
      title: "Preparing Your Body Before Donating Blood",
      thumbnail:
        "https://images.pexels.com/photos/3957987/pexels-photo-3957987.jpeg",
      content:
        "<p>Stay hydrated, sleep at least 6–8 hours, and eat an iron-rich meal (like leafy greens, lentils, or meat) before donation.</p><p>Avoid heavy oily foods and come with your previous donation history so doctors can guide you safely.</p>",
    },
    {
      _id: "static-bn-2",
      title: "রক্তদানের আগে কীভাবে প্রস্তুতি নেবেন?",
      thumbnail:
        "https://images.pexels.com/photos/8460341/pexels-photo-8460341.jpeg",
      content:
        "<p>রক্তদানের অন্তত একদিন আগে থেকে প্রচুর পানি পান করুন, ভালো ঘুমান এবং আয়রনসমৃদ্ধ খাবার (শাকসবজি, ডাল, মাছ বা মাংস) খান।</p><p>খালি পেটে বা অতিরিক্ত তেলযুক্ত খাবার খেয়ে রক্ত দিতে যাবেন না—এতে দুর্বলতা বা বমি ভাব হতে পারে।</p>",
    },
    {
      _id: "static-en-3",
      title: "Everyday Habits for a Heart-Healthy Life",
      thumbnail:
        "https://images.pexels.com/photos/6941881/pexels-photo-6941881.jpeg",
      content:
        "<p>Move your body for at least 30 minutes a day—fast walking, cycling, or light jogging all help keep your heart and blood vessels flexible.</p><p>Limit ultra-processed foods, avoid smoking, drink enough water, and get regular sleep; these simple habits keep your blood pressure, cholesterol, and blood sugar in a healthy range.</p>",
    },
    {
      _id: "static-bn-3",
      title: "সুস্থ রক্ত ও সুস্থ শরীরের জন্য দৈনন্দিন অভ্যাস",
      thumbnail:
        "https://images.pexels.com/photos/4662438/pexels-photo-4662438.jpeg",
      content:
        "<p>প্রতিদিন অন্তত ৩০ মিনিট দ্রুত হাঁটা, সাইক্লিং বা হালকা ব্যায়াম করলে হৃদ্‌যন্ত্র ও রক্তনালীর কর্মক্ষমতা অনেক বেড়ে যায় এবং রক্তসঞ্চালন ভালো থাকে।</p><p>চিনি ও অতিরিক্ত লবণ কমানো, ধূমপান থেকে দূরে থাকা, পর্যাপ্ত পানি পান ও নিয়মিত ঘুম—এসব অভ্যাস রক্তচাপ, কোলেস্টেরল ও রক্তে শর্করা নিয়ন্ত্রণে রাখতে সাহায্য করে।</p>",
    },
  ];

  const displayBlogs = blogs.length > 0 ? blogs : staticBlogs;

  if (loading) return <Loader label="Loading blogs..." full={true} />;

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 ">
      <PageTitle title={"Blog"} />

      <div className="text-center mb-8">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black bg-gradient-to-r from-rose-600 to-red-600 bg-clip-text text-transparent px-4 mb-4">
          Blood Donation Blog
        </h2>
        <p className="text-base sm:text-lg max-w-2xl mx-auto text-slate-600 px-4">
          Latest news, tips, and information about blood donation
        </p>
      </div>

      {displayBlogs.length === 0 ? (
        <div className="text-center py-12 bg-cardBg border-border border rounded-lg mx-4">
          <p className="text-base sm:text-lg text-text">
            No published blogs found.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {displayBlogs.map((blog) => (
              <div
                key={blog._id}
                className="rounded-xl shadow-lg border-border border hover:shadow-xl transition-all duration-300 bg-cardBg overflow-hidden group hover:transform hover:-translate-y-1 flex flex-col"
              >
                <img
                  src={blog.thumbnail}
                  alt={blog.title}
                  className="w-full h-40 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="p-4 sm:p-5 space-y-2 sm:space-y-3 flex-1 flex flex-col">
                  <h3 className="text-base sm:text-lg font-semibold text-highlighted group-hover:text-highlighted/90 line-clamp-2">
                    {blog.title}
                  </h3>
                  <div
                    className="text-xs sm:text-sm line-clamp-3 text-text flex-1"
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                  />
                  <Link
                    to={`/blog-details/${blog._id}`}
                    className="inline-block mt-auto text-highlighted hover:underline font-medium text-xs sm:text-sm flex items-center gap-1"
                  >
                    Read More
                    <span className="group-hover:translate-x-1 transition-transform duration-200">
                      →
                    </span>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16">
            <HealthInsights />
          </div>
        </>
      )}
    </section>
  );
}
