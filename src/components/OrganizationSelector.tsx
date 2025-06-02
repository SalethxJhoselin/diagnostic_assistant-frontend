import { IconChevronDown, IconChevronUp, IconPlus } from "@/assets/icons";
import { useState } from "react";
import { Link } from "react-router-dom";

export function OrganizationSelector() {
  const organizations = ["FGO", "Jalter-ego's Org", "misadev's projects"];
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <div className="">
      <button
        onClick={() => setOpenMenu(!openMenu)}
        className="flex flex-col items-center gap-1 px-2 py-1 rounded-md hover:bg-secondary 
        dark:hover:bg-zinc-700 transition"
      >
        <IconChevronUp />
        <IconChevronDown />
      </button>

      {openMenu && (
        <menu className="absolute rounded-md p-2
          w-64 dark:text-zinc-300 text-zinc-600 dark:bg-secondary border 
          text-[12px] px-1 flex flex-col bg-white">
          <div className="border-b pb-2">
            {organizations.map((org, index) => (
              <span
                key={index}
                className="block py-1 rounded-md cursor-pointer hover:bg-secondary 
                dark:hover:bg-zinc-700 px-2"
              >
                {org}
              </span>
            ))}
          </div>
          <Link
            to={'/dashboard/organizations'}
            className="mt-1 border-b pb-2 hover:bg-secondary 
            dark:hover:bg-zinc-700 px-2 rounded-md">
            <span>All organizatios</span>
          </Link>
          <button className="flex items-center gap-x-1 hover:bg-secondary 
          dark:hover:bg-zinc-700 px-1 rounded-md pt-1">
            <IconPlus d={12} />
            <span className="">
              new Organization
            </span>
          </button>
        </menu>
      )}
    </div>
  );
}
