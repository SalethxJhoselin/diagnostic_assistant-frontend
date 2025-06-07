import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useOrganization } from "@/hooks/organizationContex";
import {
  type Appointment,
  fetchAppointmentsByOrg,
  fetchDeleteAppointment,
} from "@/services/appointments.services";

export default function MedicalAppointments() {
  const { organization } = useOrganization();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadAppointments = async () => {
      if (!organization?.id) {
        toast.error("Organización no detectada");
        return;
      }

      setIsLoading(true);
      try {
        const data = await fetchAppointmentsByOrg(organization.id);
        setAppointments(data);
      } catch (error) {
        console.error("Error al cargar citas", error);
        toast.error("No se pudieron cargar las citas");
      } finally {
        setIsLoading(false);
      }
    };

    loadAppointments();
  }, [organization]);

  const handleDelete = async (id: string) => {
    if (!organization?.id) return;

    try {
      await fetchDeleteAppointment(id);
      toast.success("Cita eliminada");
      const updated = await fetchAppointmentsByOrg(organization.id);
      setAppointments(updated);
    } catch {
      toast.error("Error al eliminar cita");
    }
  };

  return (
    <div className="w-full flex flex-col sm:px-20 px-4 py-10">
      <section className="mb-8">
        <h1 className="text-2xl mb-4 font-semibold">Citas Médicas</h1>
      </section>

      <div className="w-full overflow-x-auto border rounded-md">
        <table className="min-w-full table-auto border-collapse">
          <thead className="bg-secondary border-b text-left text-sm">
            <tr>
              <th className="px-4 py-2 border-r">Paciente</th>
              <th className="px-4 py-2 border-r">Fecha y Hora</th>
              <th className="px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={3} className="text-center py-6">
                  Cargando citas...
                </td>
              </tr>
            ) : appointments.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center py-6">
                  No hay citas registradas
                </td>
              </tr>
            ) : (
              appointments.map((appt) => (
                <tr
                  key={appt.id}
                  className="group text-[14px] border-t hover:bg-gray-900 transition-all animate-fade-in-up"
                >
                  <td className="px-4 py-2 border group-hover:border-zinc-400">
                    {appt.patient?.name || "Paciente no asignado"}
                  </td>
                  <td className="px-4 py-2 border group-hover:border-zinc-400">
                    {new Date(appt.appointmentDateTime).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 border group-hover:border-zinc-400">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(appt.id)}
                    >
                      <Trash2 size={14} /> Eliminar
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
