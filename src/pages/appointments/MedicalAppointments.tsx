import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Pencil } from "lucide-react";
import { toast } from "sonner";
import { useOrganization } from "@/hooks/organizationContex";
import {
  fetchAppointmentsByOrg,
  fetchDeleteAppointment,
  fetchCreateAppointment,
  fetchUpdateAppointment,
  type CreateAppointmentDto,
} from "@/services/appointments.services";
import { fetchPatientsByOrg } from "@/services/patients.services";

export default function MedicalAppointments() {
  const { organization } = useOrganization();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [patients, setPatients] = useState<{id: string; name: string; aPaternal?: string; aMaternal?: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    date: "",
    startTime: "",
    endTime: "",
    patientId: "",
  });

  useEffect(() => {
    if (!organization?.id) return;

    const loadData = async () => {
      setIsLoading(true);
      try {
        const [appointmentsData, patientsData] = await Promise.all([
          fetchAppointmentsByOrg(organization.id),
          fetchPatientsByOrg(organization.id),
        ]);
        setAppointments(appointmentsData);
        setPatients(patientsData);
      } catch {
        toast.error("Error al cargar datos");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [organization]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({
      date: "",
      startTime: "",
      endTime: "",
      patientId: "",
    });
    setEditingId(null);
  };

  const isFormValid = () => {
    return (
      formData.date &&
      formData.startTime &&
      formData.endTime &&
      formData.patientId
    );
  };

  const validateLogic = () => {
    const start = new Date(`${formData.date}T${formData.startTime}:00`);
    const end = new Date(`${formData.date}T${formData.endTime}:00`);

    const [year, month, day] = formData.date.split("-").map(Number);
    const dateOnly = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    dateOnly.setHours(0, 0, 0, 0);

    if (start >= end) {
      toast.error("La hora de inicio debe ser menor a la de fin");
      return false;
    }

    if (dateOnly < today) {
      toast.error("No se puede agendar citas en fechas pasadas");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!organization?.id) return;
    if (!isFormValid()) {
      toast.error("Complete todos los campos");
      return;
    }
    if (!validateLogic()) return;

    const payload: CreateAppointmentDto = {
      date: formData.date,
      startTime: new Date(`${formData.date}T${formData.startTime}:00`),
      endTime: new Date(`${formData.date}T${formData.endTime}:00`),
      patientId: formData.patientId,
      organizationId: organization.id,
    };

    try {
      if (editingId) {
        await fetchUpdateAppointment(editingId, payload);
        toast.success("Cita actualizada");
      } else {
        await fetchCreateAppointment(payload);
        toast.success("Cita registrada");
      }

      const updated = await fetchAppointmentsByOrg(organization.id);
      setAppointments(updated);
      resetForm();
    } catch (error: any) {
      toast.error(error.message || "Error al procesar la cita");
    }
  };

  const handleDelete = async (id: string) => {
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div>
            <Label>Fecha</Label>
            <Input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>Hora Inicio</Label>
            <Input
              type="time"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>Hora Fin</Label>
            <Input
              type="time"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
            />
          </div>
          <div className="sm:col-span-2">
            <Label>Paciente</Label>
            <select
              name="patientId"
              value={formData.patientId}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 bg-background text-foreground"
            >
              <option value="">Seleccione un paciente</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} {p.aPaternal ?? ""} {p.aMaternal ?? ""}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end gap-2">
            <Button onClick={handleSubmit} disabled={!isFormValid()}>
              {editingId ? "Actualizar Cita" : "Registrar Cita"}
            </Button>
            {editingId && (
              <Button variant="secondary" onClick={resetForm}>
                Cancelar
              </Button>
            )}
          </div>
        </div>
      </section>

      <div className="w-full overflow-x-auto border rounded-md">
        <table className="min-w-full table-auto border-collapse">
          <thead className="bg-secondary border-b text-left text-sm">
            <tr>
              <th className="px-4 py-2 border-r">Paciente</th>
              <th className="px-4 py-2 border-r">Fecha</th>
              <th className="px-4 py-2 border-r">Hora</th>
              <th className="px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={4} className="text-center py-6">
                  Cargando citas...
                </td>
              </tr>
            ) : appointments.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-6">
                  No hay citas registradas
                </td>
              </tr>
            ) : (
              appointments.map((appt) => (
                <tr
                  key={appt.id}
                  className="group text-[14px] border-t hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                  >
                  <td className="px-4 py-2 border">
                    {appt.patient?.name || "No asignado"}
                  </td>
                  <td className="px-4 py-2 border">{appt.date}</td>
                  <td className="px-4 py-2 border">
                    {new Date(appt.startTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    -{" "}
                    {new Date(appt.endTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-4 py-2 border flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setFormData({
                          date: appt.date,
                          startTime: new Date(appt.startTime)
                            .toTimeString()
                            .slice(0, 5),
                          endTime: new Date(appt.endTime)
                            .toTimeString()
                            .slice(0, 5),
                          patientId: appt.patient?.id ?? "",
                        });
                        setEditingId(appt.id);
                      }}
                    >
                      <Pencil size={14} /> Editar
                    </Button>
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
