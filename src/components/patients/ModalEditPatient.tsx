import { useState } from "react";
import { toast } from "sonner";
import { useOrganization } from "@/hooks/organizationContex";
import { Button } from "@/components/ui/button";
import BaseModal from "@/components/ui/BaseModal";
import {
  fetchPatientsByOrg,
  fetchUpdatePatient,
  type GetPatient,
  type UpdatePatientPayload
} from "@/services/patients.services";
import SelectMultipleModal from "@/components/ui/SelectMultipleModal";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  patient: GetPatient;
  setPatients: (p: GetPatient[]) => void;
  setFilteredPatients: (p: GetPatient[]) => void;
}

const ENFERMEDADES_CRONICAS = [
  "Diabetes",
  "Hipertensión",
  "Asma",
  "Epilepsia",
  "Cardiopatía",
  "Artritis",
  "EPOC (Enfermedad pulmonar obstructiva crónica)",
  "Insuficiencia renal crónica",
  "Cáncer",
  "Esclerosis múltiple",
  "Hepatitis crónica",
  "Fibrosis quística",
  "Parkinson",
  "Lupus",
  "Enfermedad de Crohn",
  "Colitis ulcerosa",
  "Hipotiroidismo",
  "Hipertiroidismo",
  "Obesidad mórbida",
  "Enfermedad celíaca",
];


const ALERGIAS = [
  "Penicilina",
  "Polen",
  "Lácteos",
  "Mariscos",
  "Nueces",
  "Huevo",
  "Trigo",
  "Soja",
  "Picaduras de abeja",
  "Ácaros del polvo",
  "Caspa de animales",
  "Medicamentos antiinflamatorios (AINEs)",
  "Moho",
  "Frutas con cáscara (melocotón, manzana cruda)",
  "Sésamo",
  "Cacahuetes (maní)",
  "Sulfitos (en alimentos procesados)",
];

export default function ModalEditPatient({
  isOpen,
  onClose,
  patient,
  setPatients,
  setFilteredPatients,
}: Props) {
  const { organization } = useOrganization();
  const [loading, setLoading] = useState(false);
  const [showChronicModal, setShowChronicModal] = useState(false);
  const [showAllergyModal, setShowAllergyModal] = useState(false);
  const [chronicDiseases, setChronicDiseases] = useState<string[]>(Array.isArray((patient as any).chronicDiseases) ? (patient as any).chronicDiseases : typeof (patient as any).chronicDiseases === 'string' && (patient as any).chronicDiseases ? (patient as any).chronicDiseases.split(',').map((s: string) => s.trim()) : []);
  const [allergies, setAllergies] = useState<string[]>(Array.isArray((patient as any).allergies) ? (patient as any).allergies : typeof (patient as any).allergies === 'string' && (patient as any).allergies ? (patient as any).allergies.split(',').map((s: string) => s.trim()) : []);

  const [form, setForm] = useState({
    id: patient.id,
    name: patient.name,
    aPaternal: patient.aPaternal,
    aMaternal: patient.aMaternal,
    sexo: patient.sexo,
    birthDate: new Date(patient.birthDate).toISOString().split("T")[0],
    phone: patient.phone.toString(),
    email: patient.email,
    ci: patient.ci.toString(),
    bloodType: (patient as any).bloodType || "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    if (!organization) {
      toast.error("Organización no encontrada");
      return;
    }

    if (!form.id || form.id.length < 8) {
      toast.error("ID de paciente inválido");
      return;
    }

    setLoading(true);
    try {
      const updatedData: UpdatePatientPayload = {
        id: form.id,
        name: form.name,
        aPaternal: form.aPaternal,
        aMaternal: form.aMaternal,
        sexo: form.sexo,
        birthDate: new Date(form.birthDate),
        phone: Number(form.phone),
        email: form.email,
        ci: Number(form.ci),
        organizationId: organization.id,
        chronicDiseases,
        allergies,
        bloodType: form.bloodType || null,
      } as any;

      console.log("Intentando actualizar paciente con ID:", updatedData.id);
      await fetchUpdatePatient(updatedData);

      const updated = await fetchPatientsByOrg(organization.id);
      setPatients(updated);
      setFilteredPatients(updated);
      toast.success("Paciente actualizado correctamente");
      onClose();
    } catch (err) {
      console.error("Error actualizando paciente:", err);
      toast.error("Error al actualizar paciente");
    } finally {
      setLoading(false);
    }
  };

  const modalFooter = (
    <div className="flex justify-end gap-3">
      <Button variant="outline" onClick={onClose}>
        Cancelar
      </Button>
      <Button disabled={loading} onClick={handleUpdate}>
        Guardar Cambios
      </Button>
    </div>
  );

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Editar paciente"
      footer={modalFooter}
      size="lg"
    >
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="font-semibold">Nombre</label>
            <input
              id="name"
              name="name"
              className="w-full px-2 py-1 border rounded-md"
              value={form.name}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="aPaternal" className="font-semibold">Apellido Paterno</label>
            <input
              id="aPaternal"
              name="aPaternal"
              className="w-full px-2 py-1 border rounded-md"
              value={form.aPaternal}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="aMaternal" className="font-semibold">Apellido Materno</label>
            <input
              id="aMaternal"
              name="aMaternal"
              className="w-full px-2 py-1 border rounded-md"
              value={form.aMaternal}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="ci" className="font-semibold">CI</label>
            <input
              id="ci"
              name="ci"
              type="number"
              className="w-full px-2 py-1 border rounded-md"
              value={form.ci}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="phone" className="font-semibold">Teléfono</label>
            <input
              id="phone"
              name="phone"
              className="w-full px-2 py-1 border rounded-md"
              value={form.phone}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="email" className="font-semibold">Correo</label>
            <input
              id="email"
              name="email"
              type="email"
              className="w-full px-2 py-1 border rounded-md"
              value={form.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="birthDate" className="font-semibold">Fecha de Nacimiento</label>
            <input
              id="birthDate"
              name="birthDate"
              type="date"
              className="w-full px-2 py-1 border rounded-md"
              value={form.birthDate}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="sexo" className="font-semibold">Sexo</label>
            <select
              id="sexo"
              name="sexo"
              className="w-full px-2 py-1 border rounded-md"
              value={form.sexo}
              onChange={handleChange}
            >
              <option value="F">Femenino</option>
              <option value="M">Masculino</option>
            </select>
          </div>
          <div>
            <label htmlFor="bloodType" className="font-semibold">Tipo de Sangre</label>
            <select
              id="bloodType"
              name="bloodType"
              className="w-full px-2 py-1 border rounded-md"
              value={form.bloodType}
              onChange={handleChange}
            >
              <option value="">Selecciona...</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <div>
            <label className="font-semibold">Enfermedades Crónicas</label>
            <Button type="button" variant="outline" className="w-full mt-1" onClick={() => setShowChronicModal(true)}>
              Seleccionar enfermedades crónicas
            </Button>
            <div className="flex flex-wrap gap-2 mt-2">
              {chronicDiseases.length === 0 ? (
                <span className="text-muted-foreground text-sm">Ninguna seleccionada</span>
              ) : (
                chronicDiseases.map((enf, idx) => (
                  <span key={idx} className="bg-primary/10 text-primary px-2 py-1 rounded text-xs">
                    {enf}
                  </span>
                ))
              )}
            </div>
            <SelectMultipleModal
              isOpen={showChronicModal}
              onClose={() => setShowChronicModal(false)}
              options={ENFERMEDADES_CRONICAS}
              selected={chronicDiseases}
              onChange={vals => setChronicDiseases(vals)}
              title="Seleccionar Enfermedades Crónicas"
            />
          </div>
          <div>
            <label className="font-semibold">Alergias</label>
            <Button type="button" variant="outline" className="mt-1 w-full flex justify-start" onClick={() => setShowAllergyModal(true)}>
              Seleccionar alergias
            </Button>
            <div className="flex flex-wrap gap-2 mt-2">
              {allergies.length === 0 ? (
                <span className="text-muted-foreground text-sm">Ninguna seleccionada</span>
              ) : (
                allergies.map((alg, idx) => (
                  <span key={idx} className="bg-primary/10 text-primary px-2 py-1 rounded text-xs">
                    {alg}
                  </span>
                ))
              )}
            </div>
            <SelectMultipleModal
              isOpen={showAllergyModal}
              onClose={() => setShowAllergyModal(false)}
              options={ALERGIAS}
              selected={allergies}
              onChange={vals => setAllergies(vals)}
              title="Seleccionar Alergias"
            />
          </div>
        </div>
      </div>
    </BaseModal>
  );
}