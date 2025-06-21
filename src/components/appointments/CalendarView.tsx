import { useEffect, useState, useRef } from "react"
import FullCalendar from "@fullcalendar/react"
import type { EventInput } from "@fullcalendar/core/index.js"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import esLocale from "@fullcalendar/core/locales/es"
import { useOrganization } from "@/hooks/organizationContex"
import { fetchAppointmentsByOrg } from "@/services/appointments.services"
import { useTheme } from "next-themes"
import { useMediaQuery } from "@/hooks/useMediaQuery"
import dayjs from "dayjs"
import Modal from "@/components/ui/BaseModal" // Usa tu modal personalizado si tenés uno

type CalendarViewProps = {
  patients: { id: string; name: string; aPaternal?: string; aMaternal?: string }[]
}

export default function CalendarView({ patients }: CalendarViewProps) {
  const { organization } = useOrganization()
  const { theme } = useTheme()
  const calendarRef = useRef<FullCalendar>(null)
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [events, setEvents] = useState<EventInput[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPatient, setSelectedPatient] = useState("")
  const [selectedEvent, setSelectedEvent] = useState<any>(null)
  const [showModal, setShowModal] = useState(false)

  const COLORS = [
    { bg: "#60a5fa", border: "#3b82f6" },
    { bg: "#34d399", border: "#10b981" },
    { bg: "#f472b6", border: "#ec4899" },
    { bg: "#facc15", border: "#eab308" },
    { bg: "#f87171", border: "#ef4444" }
  ]

  useEffect(() => {
    const loadEvents = async () => {
      if (!organization?.id) return
      setLoading(true)

      try {
        const data = await fetchAppointmentsByOrg(organization.id)

        const filtered = selectedPatient
          ? data.filter((a: any) => a.patient?.id === selectedPatient)
          : data

        const formatted = filtered.map((appt: any, index: number): EventInput => {
          const patient = appt.patient ?? {}
          const fullName = `${patient.name ?? ""} ${patient.aPaternal ?? ""} ${patient.aMaternal ?? ""}`.trim()
          const color = COLORS[index % COLORS.length]

          return {
            id: appt.id,
            title: isMobile
              ? `${dayjs(appt.startTime).format("HH:mm")} ${fullName.split(" ")[0]}`
              : `${dayjs(appt.startTime).format("HH:mm")} - ${dayjs(appt.endTime).format("HH:mm")} ${fullName}`,
            start: appt.startTime,
            end: appt.endTime,
            backgroundColor: color.bg,
            borderColor: color.border,
            textColor: "#fff",
            extendedProps: {
              ...appt,
              fullTitle: `${dayjs(appt.startTime).format("HH:mm")} - ${dayjs(appt.endTime).format("HH:mm")} ${fullName}`,
              patientFullName: fullName
            }
          }
        })

        setEvents(formatted)
      } catch (error) {
        console.error("Error al cargar eventos:", error)
      } finally {
        setLoading(false)
      }
    }

    loadEvents()
  }, [organization?.id, theme, selectedPatient, isMobile])

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold mb-4">Calendario de Citas</h2>

      {/* Filtro por paciente */}
      <select
        className="mb-4 p-2 border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        value={selectedPatient}
        onChange={(e) => setSelectedPatient(e.target.value)}
      >
        <option value="">Todos los pacientes</option>
        {patients?.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name} {p.aPaternal ?? ""} {p.aMaternal ?? ""}
          </option>
        ))}
      </select>

      {loading ? (
        <div className="h-64 flex justify-center items-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
        </div>
      ) : (
        <div className="overflow-x-auto w-full">
          <div className="w-full min-w-[360px] sm:min-w-[600px] lg:min-w-[900px]">
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView={isMobile ? "dayGridMonth" : "dayGridMonth"}
              headerToolbar={{
                left: isMobile ? "prev,next" : "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay"
              }}
              buttonText={{
                today: "Hoy", month: "Mes", week: "Semana", day: "Día"
              }}
              locales={[esLocale]}
              locale="es"
              events={events}
              height="auto"
              nowIndicator
              slotMinTime="08:00:00"
              slotMaxTime="20:00:00"
              allDaySlot={false}
              firstDay={1}
              dayMaxEvents={isMobile ? 2 : 4}
              eventTimeFormat={{
                hour: "2-digit",
                minute: "2-digit",
                hour12: false
              }}
              eventContent={(arg) => {
                const isTimeGrid = arg.view.type.includes("timeGrid")
                const bg = arg.event.backgroundColor
                return {
                  html: `
                    <div style="
                      padding: 2px 4px;
                      font-size: ${isTimeGrid ? "0.68rem" : "0.75rem"};
                      font-weight: 500;
                      background-color: ${bg};
                      color: white;
                      border-radius: 4px;
                      overflow: hidden;
                      white-space: ${isTimeGrid ? "normal" : "nowrap"};
                      text-overflow: ellipsis;
                      height: 100%;
                      display: flex;
                      align-items: center;
                      max-width: 100%;
                    ">
                      ${arg.event.title}
                    </div>
                  `
                }
              }}
              eventClick={(info) => {
                setSelectedEvent(info.event.extendedProps)
                setShowModal(true)
              }}
              eventDidMount={(info) => {
                info.el.setAttribute(
                  "title",
                  info.event.extendedProps.fullTitle || info.event.title
                )
              }}
            />
          </div>
        </div>
      )}

      {/* Modal de detalle */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Detalle de la Cita"
        size="lg"
      >
        {selectedEvent && (
          <div className="grid gap-4 text-sm">
            <p><strong>Paciente:</strong> {selectedEvent.patientFullName}</p>
            <p><strong>CI:</strong> {selectedEvent.patient?.ci ?? "—"}</p>
            <p><strong>Teléfono:</strong> {selectedEvent.patient?.phone ?? "—"}</p>
            <p><strong>Correo:</strong> {selectedEvent.patient?.email ?? "—"}</p>
            <p><strong>Fecha:</strong> {selectedEvent.date}</p>
            <p><strong>Hora:</strong> {dayjs(selectedEvent.startTime).format("HH:mm")} - {dayjs(selectedEvent.endTime).format("HH:mm")}</p>
          </div>
        )}
      </Modal>
    </div>
  )
}
