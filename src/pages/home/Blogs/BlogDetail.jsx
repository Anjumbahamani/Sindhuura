// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import BottomNav from "../../../components/BottomNav";
// import { getBlogs } from "../../../services/blog.service";
// import { FiClock } from "react-icons/fi";

// const BlogDetail = () => {
//   const navigate = useNavigate();
//   const [blogs, setBlogs] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     const loadBlogs = async () => {
//       try {
//         setLoading(true);
//         const res = await getBlogs(token);
//         const list = res?.response?.results || [];
//         setBlogs(list);
//       } catch (err) {
//         console.error("Failed to load blogs:", err);
//         setError("Unable to load blogs right now.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadBlogs();
//   }, [token]);

//   return (
//     <div className="min-h-screen bg-white pb-12">
//       {/* Header gradient just like Home */}
//       <div className="bg-gradient-to-b from-[#FFF7E9] via-[#FFF9F1] to-[#FFFFFF] shadow-sm pb-5">
//         <div className="px-4 pt-6">
//           <h1 className="text-lg font-bold text-navy tracking-wide">Blogs</h1>
//           <p className="text-[12px] text-gray-600">
//             Advice, insights, and stories from the Sindhuurra team
//           </p>
//         </div>
//       </div>

//       {/* Main content */}
//       <div className="px-4 mt-4">
//         {loading && (
//           <p className="text-center text-sm text-gray-500">Loading blogs...</p>
//         )}
//         {error && (
//           <p className="text-center text-sm text-red-500">{error}</p>
//         )}

//         <div className="grid grid-cols-1 gap-4 mt-2">
//           {blogs.map((blog) => (
//             <div
//               key={blog.id}
//               onClick={() => navigate(`/blogDetail/${blog.id}`)}
//               className="cursor-pointer rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-md transition"
//             >
//               <div className="h-40 w-full bg-gray-100">
//                 {blog.cover_media_url ? (
//                   <img
//                     src={blog.cover_media_url}
//                     alt={blog.title}
//                     className="w-full h-full object-cover"
//                   />
//                 ) : (
//                   <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-100" />
//                 )}
//               </div>

//               <div className="px-4 py-3">
//                 <h3 className="text-sm font-semibold text-navy mb-1 line-clamp-2">
//                   {blog.title}
//                 </h3>
//                 <p className="text-[12px] text-gray-600 mb-2 line-clamp-2">
//                   {blog.short_description}
//                 </p>

//                 <div className="flex justify-between items-center text-[11px] text-gray-500">
//                   <div className="flex items-center gap-1">
//                     <FiClock className="w-3 h-3" />
//                     <span>{blog.created_at_ist}</span>
//                   </div>
//                   <span>{blog.views_count} views</span>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {!loading && blogs.length === 0 && !error && (
//           <p className="text-center text-sm text-gray-500">
//             No blogs available yet.
//           </p>
//         )}
//       </div>

//       <BottomNav />
//     </div>
//   );
// };

// export default BlogDetail;


import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBlogDetails } from "../../../services/blog.service";
import BottomNav from "../../../components/BottomNav";
import { FiArrowLeft, FiClock, FiEye } from "react-icons/fi";

const BlogDetail = () => {
  const { blogId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getBlogDetails(blogId, token);
        setBlog(res?.response);
      } catch (e) {
        console.error("Failed to fetch blog:", e);
        setError("Unable to load blog.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [blogId, token]);

  if (loading)
    return (
      <p className="text-center mt-20 text-sm text-gray-500">Loading blog...</p>
    );
  if (error)
    return (
      <p className="text-center mt-20 text-sm text-red-500">{error}</p>
    );

  return (
    <div className="min-h-screen bg-white pb-14">
      {/* ---------- HEADER ---------- */}
      <div className="bg-gradient-to-b from-[#FFF7E9] via-[#FFF9F1] to-[#FFFFFF] shadow-sm">
        <div className="flex items-center px-4 pt-6 pb-3">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-full flex items-center justify-center bg-white shadow-sm border border-gray-100 mr-3"
          >
            <FiArrowLeft className="text-navy w-4 h-4" />
          </button>
          <h1 className="text-base font-semibold text-navy truncate max-w-[200px]">
            Blog
          </h1>
        </div>
      </div>

      {/* ---------- BLOG ---------- */}
      <div className="px-4 mt-3">
        <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm mb-4">
          {blog?.cover_media_url && (
            <img
              src={blog.cover_media_url}
              alt={blog.title}
              className="w-full h-48 object-cover"
            />
          )}
        </div>

        <h2 className="text-lg font-bold text-navy mb-1">{blog?.title}</h2>
        <p className="text-[12px] text-gray-600 mb-3">
          {blog?.short_description}
        </p>

        <div className="flex items-center justify-between text-[11px] text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <FiClock className="w-3 h-3" />
            <span>{blog?.created_at_ist}</span>
          </div>
          <div className="flex items-center gap-1">
            <FiEye className="w-3 h-3" />
            <span>{blog?.views_count} views</span>
          </div>
        </div>

        <p className="text-[13px] text-gray-700 whitespace-pre-line leading-relaxed">
          {blog?.content}
        </p>
      </div>

      <BottomNav />
    </div>
  );
};

export default BlogDetail;