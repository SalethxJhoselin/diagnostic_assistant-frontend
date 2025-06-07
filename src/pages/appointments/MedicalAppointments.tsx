import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Trash2, Pencil } from "lucide-react";
import { toast } from "sonner";
import { useOrganization } from "@/hooks/organizationContex";
import DatePickerCustom from "@/components/appointments/DatePickerCustom";
import TimePickerCustom from "@/components/appointments/TimePickerCustom";
import CalendarView from "@/components/appointments/CalendarView";
import BaseModal from "@/components/ui/BaseModal";

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
  const [patients, setPatients] = useState<
    { id: string; name: string; aPaternal?: string; aMaternal?: string; phone?: string; email?: string; birthDate?: string; sexo?: string; ci?: number }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [viewingPatient, setViewingPatient] = useState<any>(null);

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

  const modalFooter = (
    <div className="flex justify-end">
      <Button onClick={() => setViewingPatient(null)} variant="outline">
        Cerrar
      </Button>
    </div>
  );

  return (
    <div className="w-full flex flex-col sm:px-20 px-4 py-10">
      <section className="mb-8">
        <h1 className="text-2xl mb-4 font-semibold">Citas Médicas</h1>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div>
            <Label>Fecha</Label>
            <DatePickerCustom
              value={formData.date}
              onChange={(val) => setFormData({ ...formData, date: val })}
            />
          </div>
          <div>
            <Label>Hora Inicio</Label>
            <TimePickerCustom
              label=""
              value={formData.startTime}
              onChange={(val) => setFormData({ ...formData, startTime: val })}
            />
          </div>
          <div>
            <Label>Hora Fin</Label>
            <TimePickerCustom
              label=""
              value={formData.endTime}
              onChange={(val) => setFormData({ ...formData, endTime: val })}
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

      <div className="mt-8 w-full">
        <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Calendario de Citas
          </h2>
          <Button
            onClick={() => setShowCalendar(!showCalendar)}
            className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-900 hover:bg-purple-200 dark:hover:bg-purple-900 transition-colors duration-200"
          >
            {showCalendar ? "Ocultar calendario" : "Ver calendario"}
          </Button>

        </div>

        {showCalendar && (
          <div className="w-full border rounded-md p-4 bg-muted">
            <div className="w-full overflow-x-auto">
              <div className="min-w-[360px] sm:min-w-[600px] lg:min-w-[900px] max-w-full">
                <CalendarView patients={patients} />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="w-full overflow-x-auto border rounded-md mt-8">
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
                <td colSpan={4} className="text-center py-6">Cargando citas...</td>
              </tr>
            ) : appointments.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-6">No hay citas registradas</td>
              </tr>
            ) : (
              appointments.map((appt) => (
                <tr key={appt.id} className="group text-[14px] border-t hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
                  <td className="px-4 py-2 border">
                    {appt.patient
                      ? `${appt.patient.name} ${appt.patient.aPaternal ?? ""} ${appt.patient.aMaternal ?? ""}`.trim()
                      : "No asignado"}
                  </td>
                  <td className="px-4 py-2 border">{appt.date}</td>
                  <td className="px-4 py-2 border">
                    {new Date(appt.startTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })} - {new Date(appt.endTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-4 py-2 border flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" onClick={() => {
                      setFormData({
                        date: appt.date,
                        startTime: new Date(appt.startTime).toTimeString().slice(0, 5),
                        endTime: new Date(appt.endTime).toTimeString().slice(0, 5),
                        patientId: appt.patient?.id ?? "",
                      });
                      setEditingId(appt.id);
                    }}>
                      <Pencil size={14} /> Editar
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(appt.id)}>
                      <Trash2 size={14} /> Eliminar
                    </Button>
                    <Button
                    size="sm"
                    variant="secondary"
                    className="border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 bg-purple-100 dark:bg-gray-900 hover:bg-purple-100 dark:hover:bg-purple-900 transition-colors duration-200"
                   onClick={() => setViewingPatient(appt.patient)}>
                      Ver Paciente
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {viewingPatient && (
        <BaseModal
          isOpen={!!viewingPatient}
          onClose={() => setViewingPatient(null)}
          title="Información del Paciente"
          footer={modalFooter}
        >
          <div className="grid grid-cols-1 gap-2 text-sm">
            <p><strong>Nombre:</strong> {viewingPatient.name}</p>
            <p><strong>Apellido Paterno:</strong> {viewingPatient.aPaternal}</p>
            <p><strong>Apellido Materno:</strong> {viewingPatient.aMaternal}</p>
            <p><strong>CI:</strong> {viewingPatient.ci ?? "No disponible"}</p>
            <p><strong>Correo:</strong> {viewingPatient.email ?? "No disponible"}</p>
            <p><strong>Teléfono:</strong> {viewingPatient.phone ?? "No disponible"}</p>
            <p><strong>Fecha de Nacimiento:</strong> {viewingPatient.birthDate?.slice(0, 10) ?? "No disponible"}</p>
            <p><strong>Sexo:</strong> {viewingPatient.sexo === "female" ? "Femenino" : "Masculino"}</p>
          </div>
        </BaseModal>
      )}
    </div>
  );
}
