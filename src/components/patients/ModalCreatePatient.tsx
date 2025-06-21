import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import BaseModal from "@/components/ui/BaseModal";
import { useOrganization } from "@/hooks/organizationContex";
import { toast } from "sonner";
import DatePickerCustom from "@/components/appointments/DatePickerCustom";
import SelectMultipleModal from "@/components/ui/SelectMultipleModal";

import {
  type CreatePatient,
  type GetPatient,
  fetchPatientsByOrg,
  fetchCreatePatient
} from "@/services/patients.services";

interface ModalCreatePatientProps {
  isOpen: boolean;
  onClose: () => void;
  setPatients: (p: GetPatient[]) => void;
  setFilteredPatients: (p: GetPatient[]) => void;
}

export default function ModalCreatePatient({
  isOpen,
  onClose,
  setPatients,
  setFilteredPatients
}: ModalCreatePatientProps) {
  const { organization } = useOrganization();
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showChronicModal, setShowChronicModal] = useState(false);
  const [showAllergyModal, setShowAllergyModal] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setShowDatePicker(true), 150);
      return () => clearTimeout(timer);
    } else {
      setShowDatePicker(false);
    }
  }, [isOpen]);

  const [form, setForm] = useState({
    name: "",
    aPaternal: "",
    aMaternal: "",
    sexo: "female",
    birthDate: "",
    phone: "",
    email: "",
    ci: "",
    chronicDiseases: [] as string[],
    allergies: [] as string[],
    bloodType: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!organization) {
      toast.error("Organización no detectada");
      return;
    }

    const { name, aPaternal, aMaternal, sexo, birthDate, phone, email, ci, chronicDiseases, allergies, bloodType } = form;

    if (!name || !aPaternal || !aMaternal || !birthDate || !phone || !email || !ci || !sexo) {
      toast.error("Todos los campos son obligatorios");
      return;
    }

    setLoading(true);
    try {
      const newPatient: CreatePatient = {
        name,
        aPaternal,
        aMaternal,
        sexo,
        birthDate: new Date(birthDate).toISOString(),
        phone: phone,
        email,
        ci: parseInt(ci),
        organizationId: organization.id,
        chronicDiseases,
        allergies,
        bloodType: bloodType || null,
      };

      await fetchCreatePatient(newPatient);
      toast.success("Paciente creado correctamente");

      const updated = await fetchPatientsByOrg(organization.id);
      setPatients(updated);
      setFilteredPatients(updated);

      setForm({
        name: "",
        aPaternal: "",
        aMaternal: "",
        sexo: "female",
        birthDate: "",
        phone: "",
        email: "",
        ci: "",
        chronicDiseases: [],
        allergies: [],
        bloodType: "",
      });
      onClose();
    } catch (err: any) {
      console.error("Error creando paciente", err);
      toast.error("Error al crear paciente");
    } finally {
      setLoading(false);
    }
  };

  const modalFooter = (
    <div className="flex justify-end gap-3">
      <Button variant="outline" onClick={onClose}>
        Cancelar
      </Button>
      <Button onClick={handleSave} disabled={loading}>
        Guardar Paciente
      </Button>
    </div>
  );

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

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Nuevo Paciente"
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
              placeholder="Nombre o nombres"
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
              placeholder="Ej: 71234567"
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
              placeholder="correo@ejemplo.com"
            />
          </div>
          <div className="mb-2">
            <label htmlFor="birthDate" className="font-semibold">Fecha de Nacimiento</label>
            {showDatePicker && (
              <DatePickerCustom
                value={form.birthDate}
                onChange={(val) => setForm((prev) => ({ ...prev, birthDate: val }))}
              />
            )}
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
              <option value="female">Femenino</option>
              <option value="male">Masculino</option>
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
              {form.chronicDiseases.length === 0 ? (
                <span className="text-muted-foreground text-sm">Ninguna seleccionada</span>
              ) : (
                form.chronicDiseases.map((enf, idx) => (
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
              selected={form.chronicDiseases}
              onChange={vals => setForm(prev => ({ ...prev, chronicDiseases: vals }))}
              title="Seleccionar Enfermedades Crónicas"
            />
          </div>
          <div >
          <label className="font-semibold">Alergias</label> 
            <Button type="button" variant="outline" className="mt-1 w-full flex justify-start" onClick={() => setShowAllergyModal(true)}>
              Seleccionar alergias
            </Button>
            <div className="flex flex-wrap gap-2 mt-2">
              {form.allergies.length === 0 ? (
                <span className="text-muted-foreground text-sm">Ninguna seleccionada</span>
              ) : (
                form.allergies.map((alg, idx) => (
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
              selected={form.allergies}
              onChange={vals => setForm(prev => ({ ...prev, allergies: vals }))}
              title="Seleccionar Alergias"
            />
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
      </div>
    </BaseModal>
  );
}
