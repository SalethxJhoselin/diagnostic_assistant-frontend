import { IconAdmin, IconChatBot, IconDate, IconHome, IconHospital, IconIA, IconUsers } from "@/assets/icons";
import { useOrganization } from "@/hooks/organizationContex";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";

export default function Sidebar() {
  const { organization, openMenu, setOpenMenu } = useOrganization();
  const location = useLocation();
  const [selected, setSelected] = useState("");
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({});
  const [isCollapsed, setIsCollapsed] = useState(false);

  const id = organization?.id;

  const labels = [
    {
      name: "Home",
      path: `/dashboard/org/${id}`,
      icon: <IconHome />,
    },
    {
      name: "Team",
      path: `/dashboard/org/${id}/team`,
      icon: <IconUsers />,
    },
    {
      name: "Clinic",
      icon: <IconHospital />,
      children: [
        { name: "Patients", path: `/dashboard/org/${id}/clinic/patients` },
        { name: "Consultations", path: `/dashboard/org/${id}/clinic/consultations` },
        { name: "Diagnoses", path: `/dashboard/org/${id}/clinic/diagnoses` },
        { name: "Treatments", path: `/dashboard/org/${id}/clinic/treatments` },
        { name: "Medical Report", path: `/dashboard/org/${id}/clinic/medicalList` },
      ],
    },
    {
      name: "Appointments",
      icon: <IconDate />,
      children: [
        { name: "Medical Appointments", path: `/dashboard/org/${id}/appointments` },
        { name: "Schedules", path: `/dashboard/org/${id}/attention-hours` },
        { name: "Organization Schedules", path: `/dashboard/org/${id}/organization-schedules` },
      ],
    },
    {
      name: "Chat Bot",
      path: `/dashboard/org/${id}/chat-bot`,
      icon: <IconChatBot />,
    },
    {
      name: "IA Model",
      path: `/dashboard/org/${id}/ia-model`,
      icon: <IconIA />,
    },
    {
      name: "Admin",
      path: `/dashboard/org/${id}/admin`,
      icon: <IconAdmin />,
    },
  ];

  const toggleSection = (sectionName: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionName]: !prev[sectionName],
    }));
  };

  const isActive = (path: string) => location.pathname === path;
  const isMobile = window.innerWidth < 640;

  return (
    <>
      {openMenu && isMobile && (
        <div
          onClick={() => setOpenMenu(false)}
          className="fixed inset-0 bg-background/40"
        />
      )}

      <aside
        className={`
          transition-all duration-300 ease-in-out
          ${isCollapsed ? 'w-[80px]' : 'w-[260px]'}
          ${isMobile
            ? "fixed z-20 bg-background p-4 h-full overflow-y-auto"
            : "sticky top-[3.5rem] h-[calc(100vh-3.5rem)] border-r p-4 overflow-y-auto"}
          ${isMobile && !openMenu ? "-translate-x-full" : "translate-x-0"}
        `}
      >
        <div className="flex justify-end mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hover:bg-secondary"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {labels.map((label) => {
          const isSelected = selected === label.name;

          if (label.children) {
            const isOpen = openSections[label.name] || false;

            return (
              <div key={label.name} className="my-2">
                <button
                  onClick={() => toggleSection(label.name)}
                  className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg transition-colors
                  ${isSelected || isOpen ? "bg-secondary font-bold" : "hover:bg-secondary hover:font-bold font-semibold"}`}
                >
                  {label.icon}
                  {!isCollapsed && (
                    <>
                      <span>{label.name}</span>
                      <span className="ml-auto">{isOpen ? "▾" : "▸"}</span>
                    </>
                  )}
                </button>

                {isOpen && !isCollapsed && (
                  <div className="ml-6 mt-1 space-y-1">
                    {label.children.map((child) => {
                      const active = isActive(child.path);
                      return (
                        <Link
                          key={child.name}
                          to={child.path}
                          onClick={() => setSelected(label.name)}
                          className={`block px-3 py-1.5 rounded-md text-[12px] transition-colors ${active
                            ? "bg-muted font-bold"
                            : "font-semibold hover:bg-secondary hover:font-bold"
                            }`}
                        >
                          {child.name}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          return (
            <Link
              key={label.name}
              to={label.path}
              onClick={() => setSelected(label.name)}
              className={`flex items-center gap-2 py-2 px-3 my-1 rounded-lg transition-colors 
              ${isActive(label.path || "") ? "bg-secondary font-bold" : "font-semibold hover:bg-secondary hover:font-bold"}`}
              title={isCollapsed ? label.name : ""}
            >
              {label.icon}
              {!isCollapsed && <span>{label.name}</span>}
            </Link>
          );
        })}
      </aside>
    </>
  );
}
