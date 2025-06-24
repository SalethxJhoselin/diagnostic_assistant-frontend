import React, { useState, useEffect } from 'react';
import MedicaReport from './MedicaReport';
import { useOrganization } from '@/hooks/organizationContex';
import { fetchPatientsByOrg, type GetPatient } from '@/services/patients.services';
import { toast } from 'sonner';
import {
  fetchMedicalReportsByOrg,
  fetchCreateMedicalReport,
  fetchUpdateMedicalReport,
  fetchDeleteMedicalReport,
  fetchDownloadMedicalReportPdf,
  type MedicalReport
} from '@/services/medical-report.services';
import { Button } from '@/components/ui/button';
import { IconSearch } from '@/assets/icons';
import BaseModal from '@/components/ui/BaseModal';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const ITEMS_PER_PAGE = 10;

const MedicalReportList = () => {
  const { organization } = useOrganization();
  const [patients, setPatients] = useState<GetPatient[]>([]);
  const [reports, setReports] = useState<MedicalReport[]>([]);
  const [isLoadingPatients, setIsLoadingPatients] = useState(false);
  const [isLoadingReports, setIsLoadingReports] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewingReport, setViewingReport] = useState<string | null>(null);
  const [editingReport, setEditingReport] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Cargar pacientes reales al montar
  useEffect(() => {
    const loadPatients = async () => {
      if (!organization) return;
      setIsLoadingPatients(true);
      try {
        const data = await fetchPatientsByOrg(organization.id);
        setPatients(data);
      } catch (error) {
        toast.error('Error al cargar pacientes');
        setPatients([]);
      } finally {
        setIsLoadingPatients(false);
      }
    };
    loadPatients();
  }, [organization]);

  // Cargar informes médicos al montar o al cambiar organización
  useEffect(() => {
    const loadReports = async () => {
      if (!organization) return;
      setIsLoadingReports(true);
      setError(null);
      try {
        const data = await fetchMedicalReportsByOrg(organization.id);
        setReports(data);
      } catch (err) {
        setError('Error al cargar informes médicos');
        setReports([]);
      } finally {
        setIsLoadingReports(false);
      }
    };
    loadReports();
  }, [organization]);

  // Obtener paciente por id
  const getPatient = (id: string) => patients.find(p => String(p.id) === String(id));

  // Filtrar y paginar
  const filteredReports = reports.filter(r => {
    const patient = getPatient(r.patientId);
    return (
      !searchQuery ||
      (patient && `${patient.name} ${patient.aPaternal} ${patient.aMaternal}`.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });
  const totalPages = Math.ceil(filteredReports.length / ITEMS_PER_PAGE);
  const paginatedReports = filteredReports.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // Ver informe
  const handleView = (report: MedicalReport) => {
    setViewingReport(report.id);
    setEditingReport(null);
    setCreating(false);
  };

  // Guardar cambios desde MedicaReport (editar)
  const handleUpdateReport = async (updated: any) => {
    try {
      await fetchUpdateMedicalReport(updated.id, {
        fecha: updated.fecha,
        informe: updated.informe,
      });
      toast.success('Informe actualizado');
      if (organization) {
        const data = await fetchMedicalReportsByOrg(organization.id);
        setReports(data);
      }
    } catch (err) {
      toast.error('Error al actualizar informe');
    }
    setEditingReport(null);
    setViewingReport(null);
  };

  // Guardar nuevo informe
  const handleSaveNew = async (newData: any) => {
    console.log('Datos recibidos en handleSaveNew:', newData);
    try {
      const body = {
        patientId: String(newData.patient.id),
        organizationId: String(organization!.id),
        fecha: new Date(newData.fecha).toISOString(), // Si newData.fecha ya es ISO, solo pásalo directo
        informe: newData.informe,
      };
      await fetchCreateMedicalReport(body);
      toast.success('Informe creado');
      if (organization) {
        const data = await fetchMedicalReportsByOrg(organization.id);
        setReports(data);
      }
    } catch (err) {
      toast.error('Error al crear informe');
    }
    setCreating(false);
    setSelectedPatientId('');
  };

  // Eliminar informe
  const handleDelete = (id: string) => {
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await fetchDeleteMedicalReport(deleteId);
      toast.success('Informe eliminado');
      setReports(reports.filter(r => r.id !== deleteId));
    } catch (err) {
      toast.error('Error al eliminar informe');
    }
    setIsDeleteModalOpen(false);
    setDeleteId(null);
  };

  // Descargar PDF del informe
  const handleDownloadPdf = async (id: string) => {
    try {
      await fetchDownloadMedicalReportPdf(id);
      toast.success('PDF descargado');
    } catch (err) {
      toast.error('Error al descargar PDF');
    }
  };

  // Nuevo informe: primero seleccionar paciente
  const handleNew = () => {
    setCreating(true);
    setSelectedPatientId('');
    setViewingReport(null);
    setEditingReport(null);
  };

  // Cancelar creación/edición
  const handleBack = () => {
    setCreating(false);
    setEditingReport(null);
    setViewingReport(null);
    setSelectedPatientId('');
  };

  // Renderizar creación de informe
  if (creating) {
    if (!organization) return <div className="text-center mt-16">Cargando organización...</div>;
    if (!selectedPatientId) {
      return (
        <div className="max-w-md mx-auto mt-16 bg-white shadow-lg rounded-lg p-8 border border-gray-200">
          <h2 className="text-xl font-bold mb-4">Seleccionar Paciente</h2>
          {isLoadingPatients ? (
            <div className="mb-6">Cargando pacientes...</div>
          ) : (
            <select
              className="border rounded px-2 py-2 w-full mb-6"
              value={selectedPatientId}
              onChange={e => setSelectedPatientId(e.target.value)}
            >
              <option value="">Seleccione un paciente</option>
              {patients.map(p => (
                <option key={p.id} value={p.id}>{p.name} {p.aPaternal} {p.aMaternal}</option>
              ))}
            </select>
          )}
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={handleBack}>Cancelar</Button>
            <Button
              className="bg-primary text-white"
              disabled={!selectedPatientId}
              onClick={() => setSelectedPatientId(selectedPatientId)}
            >Continuar</Button>
          </div>
        </div>
      );
    }
    const patient = getPatient(selectedPatientId);
    if (!patient) return <div className="text-center mt-16">Paciente no encontrado.</div>;
    const safePatient = {
      ...patient,
      createdAt: typeof patient.createAt === 'string' ? patient.createAt : patient.createAt?.toISOString() || '',
      ci: String(patient.ci),
      phone: String(patient.phone),
      birthDate: typeof patient.birthDate === 'string' ? patient.birthDate : new Date(patient.birthDate).toISOString(),
    };
    const initialData = {
      id: '',
      patientId: safePatient.id,
      organizationId: organization.id,
      fecha: new Date().toISOString().split('T')[0],
      informe: '',
      createdAt: '',
      updatedAt: '',
      patient: safePatient,
      organization: organization,
    };
    return (
      <MedicaReport
        initialData={initialData}
        editable={true}
        onSave={handleSaveNew}
        onBack={handleBack}
      />
    );
  }

  // Renderizar edición de informe
  if (editingReport) {
    if (!organization) return <div className="text-center mt-16">Cargando organización...</div>;
    const report = reports.find(r => r.id === editingReport);
    if (!report) return <div className="text-center mt-16">Informe no encontrado.</div>;
    const patient = getPatient(report.patientId);
    if (!patient) return <div className="text-center mt-16">Paciente no encontrado.</div>;
    const safePatient = {
      ...patient,
      createdAt: typeof patient.createAt === 'string' ? patient.createAt : patient.createAt?.toISOString() || '',
      ci: String(patient.ci),
      phone: String(patient.phone),
      birthDate: typeof patient.birthDate === 'string' ? patient.birthDate : new Date(patient.birthDate).toISOString(),
    };
    return (
      <MedicaReport
        initialData={{ ...report, patient: safePatient, organization: organization }}
        editable={true}
        onSave={handleUpdateReport}
        onBack={handleBack}
      />
    );
  }

  // Renderizar visualización de informe
  if (viewingReport) {
    if (!organization) return <div className="text-center mt-16">Cargando organización...</div>;
    const report = reports.find(r => r.id === viewingReport);
    if (!report) return <div className="text-center mt-16">Informe no encontrado.</div>;
    const patient = getPatient(report.patientId);
    if (!patient) return <div className="text-center mt-16">Paciente no encontrado.</div>;
    const safePatient = {
      ...patient,
      createdAt: typeof patient.createAt === 'string' ? patient.createAt : patient.createAt?.toISOString() || '',
      ci: String(patient.ci),
      phone: String(patient.phone),
      birthDate: typeof patient.birthDate === 'string' ? patient.birthDate : new Date(patient.birthDate).toISOString(),
    };
    return (
      <MedicaReport
        initialData={{ ...report, patient: safePatient, organization: organization }}
        editable={true}
        onSave={handleUpdateReport}
        onBack={handleBack}
      />
    );
  }

  // Renderizar listado
  return (
    <div className="w-full flex flex-col sm:px-20 px-4 py-10">
      <section className="mb-8">
        <h1 className="text-2xl mb-4 font-semibold">Informes Médicos</h1>
        <div className="flex flex-col sm:flex-row gap-y-4 gap-x-4">
          <Button
            className="hover:bg-primary/90 border-zinc-400 px-6 py-2 cursor-pointer animate-fade-in-left flex items-center gap-2"
            onClick={handleNew}
            disabled={patients.length === 0 || isLoadingPatients}
          >
            Nuevo Informe
          </Button>
          <div className="flex items-center relative group">
            <div className="absolute pl-4 text-zinc-600 dark:text-zinc-200">
              <IconSearch />
            </div>
            <input
              className="w-full sm:w-80 border rounded-lg pl-12 py-0.5 bg-[var(--input-soft)]"
              type="search"
              placeholder="Buscar por paciente..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>
      </section>
      <div className="w-full overflow-x-auto border rounded-md">
        {isLoadingReports ? (
          <div className="text-center my-8">Cargando informes médicos...</div>
        ) : error ? (
          <div className="text-center my-8 text-red-500">{error}</div>
        ) : filteredReports.length === 0 ? (
          <div className="text-center my-8 text-gray-500">No se encontraron informes médicos.</div>
        ) : (
          <table className="min-w-full table-auto border-collapse">
            <thead className="bg-secondary border-b text-left text-sm">
              <tr>
                <th className="px-4 py-2 border-r">Paciente</th>
                <th className="px-4 py-2 border-r">Fecha</th>
                <th className="px-4 py-2 border-r">Resumen</th>
                <th className="px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginatedReports.map(r => {
                const patient = getPatient(r.patientId);
                return (
                  <tr key={r.id} className="group text-[14px] border-t hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-all animate-fade-in-up">
                    <td className="px-4 py-3 border group-hover:border-gray-200 dark:group-hover:border-gray-700 transition-colors">
                      {patient ? `${patient.name} ${patient.aPaternal}` : '-'}
                    </td>
                    <td className="px-4 py-3 border group-hover:border-gray-200 dark:group-hover:border-gray-700 transition-colors">
                      {r.fecha.slice(0, 10)}
                    </td>
                    <td className="px-4 py-3 border group-hover:border-gray-200 dark:group-hover:border-gray-700 transition-colors">
                      {r.informe.slice(0, 40)}...
                    </td>
                    <td className="px-4 py-3 border group-hover:border-gray-200 dark:group-hover:border-gray-700 transition-colors flex gap-2">
                      <Button size="sm" variant="outline" className="flex items-center gap-1" onClick={() => handleView(r)}>
                        Ver/Editar
                      </Button>
                      <Button size="sm" variant="outline" className="flex items-center gap-1 text-green-700 border-green-600" onClick={() => handleDownloadPdf(r.id)}>
                        PDF
                      </Button>
                      <Button size="sm" variant="destructive" className="flex items-center gap-1" onClick={() => handleDelete(r.id)}>
                        Eliminar
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
      {totalPages > 1 && (
        <div className="flex justify-between mt-4">
          <Button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
          >
            Anterior
          </Button>
          <span>Página {currentPage} de {totalPages}</span>
          <Button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => prev + 1)}
          >
            Siguiente
          </Button>
        </div>
      )}
      {patients.length === 0 && !isLoadingPatients && (
        <div className="text-center mt-8 text-gray-500">No hay pacientes registrados en la organización.</div>
      )}

      {/* Modal de confirmación de eliminación */}
      <BaseModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeleteId(null);
        }}
        title="Confirmar eliminación"
        size="sm"
      >
        <div className="flex flex-col items-center gap-4 py-4">
          <ExclamationCircleOutlined className="text-4xl text-red-500" />
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">¿Estás seguro de eliminar este informe?</h3>
            <p className="text-gray-500 dark:text-gray-400">
              Esta acción no se puede deshacer y eliminará permanentemente el informe seleccionado.
            </p>
          </div>
          <div className="flex gap-3 mt-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteModalOpen(false);
                setDeleteId(null);
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
            >
              Sí, eliminar
            </Button>
          </div>
        </div>
      </BaseModal>
    </div>
  );
};

export default MedicalReportList; 