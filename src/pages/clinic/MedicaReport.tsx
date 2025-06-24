import React, { useState, useEffect } from 'react';
import logo from '@/assets/logo.png';
import { Button } from '@/components/ui/button';
import type { MedicalReport, Patient, Organization } from '@/services/medical-report.services';

// Tipos de props

interface MedicaReportProps {
  initialData: MedicalReport & { patient: Patient; organization: Organization };
  editable?: boolean;
  onSave?: (data: MedicalReport & { patient: Patient; organization: Organization }) => void;
  onBack?: () => void;
}


// Si luego tienes la firma, descomenta y usa:
// const buildSignatureBlock = (firmaBase64: string) => ({
//   stack: [
//     { image: firmaBase64, width: 100, alignment: 'center', margin: [0, 20, 0, 5] },
//   ]
// });

const MedicaReport: React.FC<MedicaReportProps> = ({ initialData, editable = false, onSave, onBack }) => {
  const [fecha, setFecha] = useState(initialData.fecha ? initialData.fecha.slice(0, 10) : '');
  const [informe, setInforme] = useState(initialData.informe || '');
  const [editMode, setEditMode] = useState(editable);

  useEffect(() => {
    setFecha(initialData.fecha ? initialData.fecha.slice(0, 10) : '');
    setInforme(initialData.informe || '');
    setEditMode(editable);
  }, [initialData, editable]);

  const handleSave = () => {
    if (onSave) {
      onSave({
        ...initialData,
        fecha: fecha ? new Date(fecha + 'T00:00:00.000Z').toISOString() : '',
        informe,
      });
    }
    setEditMode(false);
  };

  const handleEdit = () => setEditMode(true);

  const patient = initialData.patient;
  const organization = initialData.organization;

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-8 mt-8 mb-8 border border-gray-200">
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-4 mb-6">
        <img src={logo} alt="Logo" className="w-16 h-16 object-contain" />
        <div className="text-right">
          <h1 className="text-2xl font-bold text-gray-800">Informe Médico</h1>
          <span className="text-sm text-gray-500">{organization.name}</span>
        </div>
      </div>

      {/* Info Paciente y Organización */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1 min-w-[220px]">
          <h2 className="font-semibold text-blue-900 mb-2">Datos del Paciente</h2>
          <div className="text-sm text-gray-700 space-y-1">
            <div><span className="font-semibold">Nombre:</span> {patient.name} {patient.aPaternal} {patient.aMaternal}</div>
            <div><span className="font-semibold">CI:</span> {patient.ci}</div>
            <div><span className="font-semibold">Sexo:</span> {patient.sexo === 'male' ? 'Masculino' : 'Femenino'}</div>
            <div><span className="font-semibold">Fecha de Nacimiento:</span> {new Date(patient.birthDate).toLocaleDateString('es-BO')}</div>
            <div><span className="font-semibold">Email:</span> {patient.email}</div>
            <div><span className="font-semibold">Teléfono:</span> {patient.phone}</div>
          </div>
        </div>
        <div className="flex-1 min-w-[220px] text-right">
          <h2 className="font-semibold text-blue-900 mb-2">Organización</h2>
          <div className="text-sm text-gray-700 space-y-1">
            <div><span className="font-semibold">Ciudad:</span> Santa Cruz de la Sierra</div>
            <div><span className="font-semibold">Organización:</span> {organization.name}</div>
            <div><span className="font-semibold">Responsable:</span> {organization.hostUser}</div>
            <div>
              <span className="font-semibold">Sitio Web:</span> <a href="https://www.Derma-AI.com" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">www.Derma-AI.com</a>
            </div>
          </div>
        </div>
      </div>

      {/* Fecha editable o solo lectura */}
      <div className="mb-6 flex items-center gap-2">
        <label className="font-semibold text-gray-700" htmlFor="fecha">Fecha del informe:</label>
        {editMode ? (
          <input
            id="fecha"
            type="date"
            value={fecha}
            onChange={e => setFecha(e.target.value)}
            className="border rounded px-2 py-1"
          />
        ) : (
          <span className="ml-2">{fecha ? new Date(fecha).toLocaleDateString('es-BO') : ''}</span>
        )}
      </div>

      {/* Informe Médico editable o solo lectura */}
      <div className="mb-8">
        {editMode ? (
          <textarea
            id="informe"
            value={informe}
            onChange={e => setInforme(e.target.value)}
            rows={8}
            placeholder="Escriba aquí el informe, diagnóstico, recomendaciones, etc."
            className="border rounded px-3 py-2 w-full text-base text-gray-800 focus:outline-blue-400"
          />
        ) : (
          <div className="whitespace-pre-line border rounded px-3 py-2 bg-gray-50 text-base text-gray-800 min-h-[120px]">{informe}</div>
        )}
      </div>

      {/* Botones de acción */}
      <div className="flex gap-2 justify-end mt-8">
        {onBack && (
          <Button variant="outline" onClick={onBack}>Volver</Button>
        )}
        {editMode ? (
          <Button className="bg-primary text-white" onClick={handleSave}>Guardar</Button>
        ) : (
          editable && (
            <Button className="bg-yellow-500 text-white" onClick={handleEdit}>Editar</Button>
          )
        )}
      </div>
    </div>
  );
};

export default MedicaReport;
