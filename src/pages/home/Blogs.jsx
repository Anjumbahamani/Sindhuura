// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import BottomNav from "../../components/BottomNav";
// import { getBlogs } from "../../services/blog.service";
// import { FiClock, FiEye } from "react-icons/fi";

// const Blogs = () => {
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
//         const list =
//           res?.response?.results ||
//           res?.response?.response?.results ||
//           res?.results ||
//           [];
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
//     <div className="min-h-screen bg-[#FFFFFF] pb-14">
//       {/* ---------- HEADER ---------- */}
//       <div className="bg-gradient-to-b from-[#FFF7E9] via-[#FFF9F1] to-[#FFFFFF] shadow-sm">
//         <div className="px-5 pt-6 pb-4">
//           <h1 className="text-lg font-bold text-navy tracking-wide">Blogs</h1>
//           <p className="text-[12px] text-gray-600 leading-snug">
//             Discover stories & insights from the Sindhuurra team
//           </p>
//         </div>
//       </div>

//       {/* ---------- CONTENT ---------- */}
//       <div className="px-4">
//         {loading && (
//           <p className="text-center text-sm text-gray-500 mt-8">
//             Loading blogs...
//           </p>
//         )}
//         {error && (
//           <p className="text-center text-sm text-red-500 mt-8">{error}</p>
//         )}

//         <div className="mt-3 grid grid-cols-1 gap-4">
//           {blogs.map((b) => (
//             <BlogCard key={b.id} blog={b} onClick={() => navigate(`/blogs/${b.id}`)} />
//           ))}
//         </div>

//         {!loading && blogs.length === 0 && !error && (
//           <p className="text-center text-sm text-gray-500 mt-8">
//             No blogs available yet.
//           </p>
//         )}
//       </div>

//       <BottomNav />
//     </div>
//   );
// };

// /* ---------- Individual blog card ---------- */
// const BlogCard = ({ blog, onClick }) => {
//   return (
//     <div
//       onClick={onClick}
//       className="cursor-pointer rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all transform hover:-translate-y-0.5 active:scale-[0.99]"
//     >
//       {/* Banner */}
//       <div className="relative h-44 w-full overflow-hidden bg-gray-100">
//         {blog.cover_media_url ? (
//           <img
//             src={blog.cover_media_url}
//             alt={blog.title}
//             className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
//           />
//         ) : (
//           <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-100" />
//         )}
//         {blog.is_featured && (
//           <span className="absolute top-2 left-2 bg-primary text-white text-[10px] px-2 py-0.5 rounded-full shadow">
//             Featured
//           </span>
//         )}
//       </div>

//       {/* Text */}
//       <div className="px-4 py-3">
//         <h3 className="text-sm font-semibold text-navy mb-1 line-clamp-2">
//           {blog.title}
//         </h3>
//         <p className="text-[12px] text-gray-600 line-clamp-2">
//           {blog.short_description}
//         </p>

//         <div className="flex justify-between items-center text-[11px] text-gray-500 mt-2">
//           <div className="flex items-center gap-1">
//             <FiClock className="w-3 h-3" />
//             <span>{blog.created_at_ist}</span>
//           </div>
//           <div className="flex items-center gap-1">
//             <FiEye className="w-3 h-3" />
//             <span>{blog.views_count}</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Blogs;

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FiBookOpen, FiClock, FiEye, FiSearch } from "react-icons/fi";
import BottomNav from "../../components/BottomNav";
import { getBlogs, searchBlogs } from "../../services/blog.service";

const Blogs = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");
  const searchTimer = useRef(null);
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await getBlogs(token);
        const list =
          res?.response?.results ||
          res?.response?.response?.results ||
          res?.results ||
          [];
        setBlogs(list);
        setFeatured(list.filter((b) => b.is_featured));
      } catch (err) {
        console.error(err);
        setError("Unable to load blogs right now.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token]);

  // const filtered = blogs.filter((b) =>
  //   b.title.toLowerCase().includes(query.toLowerCase())
  // );

  return (
    <div className="min-h-screen bg-white pb-14">
      {/* ---------- Top Gradient ---------- */}
      <div className="bg-gradient-to-b from-[#FFF7E9] via-[#FFF9F1] to-[#FFFFFF] pb-4 shadow-sm">
        <div className="px-5 pt-6">
          <h1 className="text-lg font-bold text-navy">Blogs</h1>
          <p className="text-[12px] text-gray-600">
            Explore stories, ideas & tips from Sindhuurra
          </p>
        </div>

        {/* Search bar */}
        <div className="mt-4 px-5">
          <div className="flex items-center bg-white rounded-full shadow-sm border border-gray-100 px-3 py-2">
            <FiSearch className="w-4 h-4 text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search blogs..."
              value={query}
              onChange={(e) => {
                const value = e.target.value;
                setQuery(value);

                if (searchTimer.current) {
                  clearTimeout(searchTimer.current);
                }

                searchTimer.current = setTimeout(async () => {
                  try {
                    setLoading(true);
                    const res = await searchBlogs(value, token);
                    const list =
                      res?.response?.results ||
                      res?.response?.response?.results ||
                      res?.results ||
                      [];
                    setBlogs(list);
                    setFeatured(list.filter((b) => b.is_featured));
                  } catch (err) {
                    console.error("Search failed", err);
                  } finally {
                    setLoading(false);
                  }
                }, 500);
              }}
              className="flex-1 border-none outline-none text-[13px] bg-transparent"
            />
          </div>
        </div>

        {/* Category dropdown placeholder */}
        {/* <div className="px-5 mt-2">
          <select
            className="w-full text-[12px] border border-gray-200 rounded-full py-1.5 px-3 bg-white shadow-sm text-gray-600 "
            defaultValue=""
          >
            <option value="">All Categories</option>
            <option value="featured">Featured</option>
            <option value="latest">Latest</option>
          </select>
        </div> */}
      </div>

      {/* ---------- Content ---------- */}
      <div className="px-5 mt-4 space-y-6">
        {/* ----------  EMPTY or ERROR FALLBACK ---------- */}
        {!loading && (blogs.length === 0 || error) && (
          <div className="flex flex-col items-center justify-center mt-10 text-center text-gray-500 px-5">
            <div className="w-14 h-14 rounded-full bg-[#FFF7E9] flex items-center justify-center mb-3 shadow-sm">
              <FiBookOpen className="w-7 h-7 text-[#B36A1E]" />
            </div>

            <p className="text-sm font-medium text-navy">
              {error
                ? "Unable to load blogs right now"
                : "No blogs available yet"}
            </p>

            <p className="text-[12px] text-gray-500 mt-1 leading-snug max-w-xs">
              {error
                ? "Looks like our servers are taking a short break. Please check back soon."
                : "Check back later for new stories from the Sindhuurra team."}
            </p>
          </div>
        )}
        {/* {error && <p className="text-center text-sm text-red-500">{error}</p>} */}

        {/* Featured Section */}
        {featured.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-navy mb-3">
              Featured Stories
            </h2>

            <div className="space-y-4">
              {blogs.map((b) => (
                <FeaturedCard
                  key={b.id}
                  blog={b}
                  onClick={() => navigate(`/blogs/${b.id}`)}
                />
              ))}
            </div>
          </section>
        )}

        {/* All Articles */}
        <section>
          <h2 className="text-sm font-semibold text-navy mb-3">All Articles</h2>

          <div className="space-y-3">
            {blogs.map((b) => (
              <ArticleCard
                key={b.id}
                blog={b}
                onClick={() => navigate(`/blogs/${b.id}`)}
              />
            ))}
          </div>

          {/* {!loading && blogs.length === 0 && !error && (
            <div className="flex flex-col items-center justify-center mt-10 text-center text-gray-500">
              <div className="w-14 h-14 rounded-full bg-[#FFF7E9] flex items-center justify-center mb-3 shadow-sm">
                <FiBookOpen className="w-7 h-7 text-[#B36A1E]" />
              </div>
              <p className="text-sm font-medium text-navy">
                No blogs available yet
              </p>
              <p className="text-[12px] text-gray-500 mt-1">
                Check back soon for new stories from the Sindhuurra team.
              </p>
            </div>
          )} */}
        </section>
      </div>

      <BottomNav />
    </div>
  );
};

/* ---------- Card Components ---------- */

const FeaturedCard = ({ blog, onClick }) => (
  <div
    onClick={onClick}
    className="cursor-pointer  rounded-3xl bg-white border border-[#FFE7C2]/40 shadow hover:shadow-md transition overflow-hidden"
  >
    <div className="flex flex-col">
      {blog.cover_media_url && (
        <img
          src={blog.cover_media_url}
          alt={blog.title}
          className="w-full h-40 object-cover"
        />
      )}

      <div className="p-4">
        <p className="text-[10px] uppercase text-primary tracking-wide mb-1">
          Featured
        </p>
        <h3 className="text-sm font-semibold text-navy mb-1 line-clamp-2">
          {blog.title}
        </h3>
        <p className="text-[12px] text-gray-600 line-clamp-2 mb-3">
          {blog.short_description}
        </p>

        <div className="flex items-center justify-between text-[11px] text-gray-500 mb-3">
          <span className="flex items-center gap-1">
            <FiClock className="w-3 h-3" /> {blog.created_at_ist}
          </span>
          <span className="flex items-center gap-1">
            <FiEye className="w-3 h-3" /> {blog.views_count}
          </span>
        </div>
        <button className="w-40 bg-primary text-white text-[11px] font-semibold py-2.5 rounded-full shadow hover:bg-primary/90 transition mb-3">
          Read More
        </button>
      </div>
    </div>
  </div>
);

const ArticleCard = ({ blog, onClick }) => (
  <div
    onClick={onClick}
    className="cursor-pointer rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition px-4 py-3"
  >
    <p className="text-[10px] uppercase text-primary tracking-wide">
      {blog.is_featured ? "Featured" : "Story"}
    </p>
    <h3 className="text-sm font-semibold text-navy line-clamp-2 mt-1">
      {blog.title}
    </h3>
    <p className="text-[12px] text-gray-600 line-clamp-2 mt-0.5">
      {blog.short_description}
    </p>

    <div className="flex items-center justify-between text-[11px] text-gray-500 mt-2">
      <div className="flex items-center gap-1">
        <FiClock className="w-3 h-3" /> {blog.created_at_ist}
      </div>
      <div className="flex items-center gap-1">
        <FiEye className="w-3 h-3" /> {blog.views_count}
      </div>
    </div>
  </div>
);

export default Blogs;
