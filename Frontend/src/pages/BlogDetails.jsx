import React, { useEffect, useState } from "react";
import Loader from "../components/Loader";
import { useParams } from "react-router";
import useAxiosSecure from "../hooks/useAxiosSecure";
import PageTitle from "../components/PageTitle";

export default function BlogDetails() {
  const axiosSecure = useAxiosSecure();
  const { ID } = useParams();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosSecure.get(`/blog-details/${ID}`).then((res) => {
      setDetails(res.data);
      setLoading(false);
    });
  }, [ID]);

  if (loading || !details)
    return <Loader label="Loading blog..." full={true} />;

  const { title, thumbnail, content, status, createdAt } = details;

  const formattedDate = new Date(createdAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageTitle title={"Blog Details"} />
      <div className="max-w-4xl mx-auto">
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-64 sm:h-96 object-cover rounded-2xl shadow-lg mb-6"
        />
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-rose-600 to-red-600 bg-clip-text text-transparent">
          {title}
        </h1>
        <div className="text-sm text-slate-600 mb-6 flex justify-between items-center border-b border-slate-200 pb-4">
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-semibold capitalize">
            {status}
          </span>
          <span>{formattedDate}</span>
        </div>
        <div
          className="prose prose-lg max-w-full prose-headings:text-slate-800 prose-p:text-slate-700 prose-a:text-rose-600"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </div>
  );
}
