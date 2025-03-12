"use client";

import { Dispatch, SetStateAction } from "react";
import { v4 } from "uuid";

const sidebarLinks = [
  {
    title: "Profile Settings",
  },
  {
    title: "Purchase History",
  },
  {
    title: "Your WishList",
  },
];

type Props = {
  setIndex: Dispatch<SetStateAction<number>>;
  index: number;
};

const Sidebar = ({ setIndex, index }: Props) => {
  return (
    <div className="w-[200px] space-y-10  h-full bordery bg-slate-100 py-5 px-3">
      {/* title */}
      <p className="text-sm font-medium text-slate-400">Navigation Links</p>
      {/* links */}
      <ul className="flex flex-col gap-3">
        {sidebarLinks.map((el, i) => (
          <button
            key={v4()}
            onClick={() => setIndex(i)}
            className={`text-sm text-left text-slate-500 px-2 py-1 font-medium hover:text-slate-800 transition-colors duration-200 rounded-md ${
              index === i ? "bg-slate-300" : "bg-slate-200"
            }`}
          >
            {el.title}
          </button>
        ))}
      </ul>
    </div>
  );
};
export default Sidebar;
