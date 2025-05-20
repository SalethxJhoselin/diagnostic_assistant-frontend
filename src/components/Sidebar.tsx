import { IconHome, IconUsers } from "@/assets/icons";
import { useOrganization } from "@/hooks/organizationContex";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Sidebar() {
    const [select, setSelect] = useState("Home Organization");
    const {organization} = useOrganization()
    const labels = [
        {
            icon: <IconHome />,
            title: "Home Organization",
            to: "",
        },
        {
            icon: <IconUsers />,
            title: "Team",
            to: "team",
        },
    ];

    return (
        <aside className="w-[280px] h-full border-r p-4">
            {labels.map((label) => {
                const isSelected = select === label.title;
                return (
                    <Link
                        key={label.title}
                        to={`/dashboard/org/${organization?.id}/${label.to}`}
                        onClick={() => setSelect(label.title)}
                        className={`flex items-center gap-2 py-2 px-3 my-1 rounded-lg transition-colors
                            ${isSelected ? "bg-secondary  font-bold" : `dark:text-zinc-300 text-zinc-700 hover:bg-secondary
                             dark:hover:text-white hover:text-black hover:font-bold font-semibold`}
                        `}
                    >
                        {label.icon}
                        <span>{label.title}</span>
                    </Link>
                );
            })}
        </aside>
    );
}
