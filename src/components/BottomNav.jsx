// src/components/BottomNav.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FiHome,
  FiUsers,
  FiHeart,
  FiMessageCircle,

} from "react-icons/fi";
import { HiOutlineSparkles } from "react-icons/hi2"; // for Upgrade
import { MdWorkspacePremium } from "react-icons/md";


const NAV_ITEMS = [
  { key: "home", label: "Home", path: "/home", Icon: FiHome },
  { key: "matches", label: "Matches", path: "/matches", Icon: FiUsers },
  { key: "interests", label: "Interests", path: "/interests", Icon: FiHeart },
  { key: "messages", label: "Messages", path: "/messages", Icon: FiMessageCircle },
  { key: "blogs", label: "Blogs", path: "/blogs", Icon: HiOutlineSparkles },
//   { key: "upgrade", label: "Upgrade", path: "/upgrade", Icon: MdWorkspacePremium },
];

const BottomNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.04)] z-40">
      <div className="max-w-md mx-auto flex justify-between px-2 py-1.5">
        {NAV_ITEMS.map(({ key, label, path, Icon }) => {
          const isActive = location.pathname === path;

          return (
            <Link
              key={key}
              to={path}
              className="flex-1 flex flex-col items-center gap-0.5 text-[11px]"
            >
              {/* Icon with bg */}
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center
                  ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "bg-transparent text-gray-400"
                  }`}
              >
                <Icon className="w-5 h-5" />
              </div>

              {/* Label */}
              <span
                className={`font-medium ${
                  isActive ? "text-primary" : "text-gray-500"
                }`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;