import { Button } from "@/components/ui/button";
import { useOrganization } from "@/hooks/organizationContex";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { gsap } from "gsap";
import { fetchDiagnosesByOrg, type GetDiagnoses } from "@/services/diagnoses.services";
import { fetchTreatmentsByOrg, type GetTreatments } from "@/services/treatments.services";
import { fetchAddConsulDiag, fetchAddConsulTreat, fetchCreateConsultation, type GetConsultation } from "@/services/consultations.services";
import { fetchPatientsByOrg, type GetPatient } from "@/services/patients.services";
import {
    SelectItem, Select, SelectContent, SelectGroup,
    SelectLabel, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { fetchModel } from "@/services/model";
import ModalCreateDiag from "@/components/diagnoses/ModalCreateDiagnoses";
import ModalCreateTreat from "@/components/treatments/ModalCreateTreatments";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    User,
    Calendar,
    FileText,
    Stethoscope,
    Pill,
    Image as ImageIcon,
    History,
    X,
    Clock,
    AlertCircle,
    CheckCircle2
} from "lucide-react";
import { IconSearch } from "@/assets/icons";

export default function NewConsultation() {
    const [patients, setPatients] = useState<GetPatient[]>([]);
    const [appointments, setAppointments] = useState<any[]>([]);
    const [diagnoses, setDiagnoses] = useState<GetDiagnoses[]>([]);
    const [treatments, setTreatments] = useState<GetTreatments[]>([]);
    const [selectedPatientId, setSelectedPatientId] = useState("");
    const [selectedAppointmentId, setSelectedAppointmentId] = useState("");
    const [motivo, setMotivo] = useState("");
    const [observaciones, setObservaciones] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [aiDiagnosis, setAiDiagnosis] = useState<{ condition: string; confidence: number } | null>(null);
    const [selectedDiagnosisIds, setSelectedDiagnosisIds] = useState<string[]>([]);
    const [selectedTreatmentIds, setSelectedTreatmentIds] = useState<string[]>([]);
    const [isProcessingImage, setIsProcessingImage] = useState(false);
    const [showImageModal, setShowImageModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredPatients, setFilteredPatients] = useState<GetPatient[]>([]);

    const [openModalDiag, setOpenModalDiag] = useState(false)
    const [openModalTreat, setOpenModalTreat] = useState(false)

    const { organization, user } = useOrganization();
    const navigate = useNavigate();
    const location = useLocation();

    // Función para guardar el estado en localStorage
    const saveConsultationState = () => {
        const state = {
            selectedPatientId,
            selectedAppointmentId,
            motivo,
            observaciones,
            selectedDiagnosisIds,
            selectedTreatmentIds,
            aiDiagnosis
        };
        localStorage.setItem('newConsultationState', JSON.stringify(state));
    };

    // Función para cargar el estado desde localStorage
    const loadConsultationState = () => {
        const savedState = localStorage.getItem('newConsultationState');
        if (savedState) {
            const state = JSON.parse(savedState);
            setSelectedPatientId(state.selectedPatientId || "");
            setSelectedAppointmentId(state.selectedAppointmentId || "");
            setMotivo(state.motivo || "");
            setObservaciones(state.observaciones || "");
            setSelectedDiagnosisIds(state.selectedDiagnosisIds || []);
            setSelectedTreatmentIds(state.selectedTreatmentIds || []);
            setAiDiagnosis(state.aiDiagnosis || null);
        }
    };

    // Cargar el estado solo si venimos del historial
    useEffect(() => {
        const fromHistory = sessionStorage.getItem('fromHistory');
        if (fromHistory === 'true') {
            loadConsultationState();
            sessionStorage.removeItem('fromHistory');
        }
    }, []);

    // Guardar el estado cuando se navega al historial
    const handleViewHistory = () => {
        saveConsultationState();
        sessionStorage.setItem('fromHistory', 'true');
        navigate(`/dashboard/org/${organization?.id}/clinic/patient/${selectedPatientId}/history`);
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!organization) return;
            try {
                const [patientsData, diagnosesData, treatmentsData] = await Promise.all([
                    fetchPatientsByOrg(organization.id),
                    fetchDiagnosesByOrg(organization.id),
                    fetchTreatmentsByOrg(organization.id),
                ]);
                setPatients(patientsData);
                setFilteredPatients(patientsData);
                setDiagnoses(diagnosesData);
                setTreatments(treatmentsData);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, [organization]);

    // Efecto para filtrar pacientes
    useEffect(() => {
        if (!patients) return;
        
        if (searchQuery.trim() === "") {
            setFilteredPatients(patients);
        } else {
            const query = searchQuery.toLowerCase();
            const filtered = patients.filter(patient => {
                const fullName = `${patient.name} ${patient.aPaternal} ${patient.aMaternal}`.toLowerCase();
                return fullName.includes(query);
            });
            setFilteredPatients(filtered);
        }
    }, [searchQuery, patients]);

    useEffect(() => {
        const fetchAppointments = async () => {
            if (!selectedPatientId) return;
            try {
                //const appointmentsData = await fetchAppointmentsByPatient(selectedPatientId);
                setAppointments([]);
            } catch (error) {
                console.error("Error fetching appointments:", error);
            }
        };
        fetchAppointments();
    }, [selectedPatientId]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setImageFile(file);
        setIsProcessingImage(true);

        gsap.to(".scanner-line", {
            y: "100%",
            duration: 1.5,
            repeat: -1,
            yoyo: true,
            ease: "power1.inOut"
        });

        try {
            const formData = new FormData();
            formData.append("image", file);
            const result = await fetchModel(formData);
            setAiDiagnosis(result);

            // Stop animation
            gsap.killTweensOf(".scanner-line");
        } catch (error) {
            console.error("Error processing image:", error);
            toast.error("Error al procesar la imagen. Intente de nuevo.");
            gsap.killTweensOf(".scanner-line");
        } finally {
            setIsProcessingImage(false);
        }
    };

    const handleSaveConsultation = async () => {
        if (!organization || !selectedPatientId || !motivo) {
            toast.error("Paciente y motivo son obligatorios");
            return;
        }

        const newConsultation = {
            motivo,
            observaciones: observaciones,
            organizationId: organization.id,
            patientId: selectedPatientId,
            userId: user?.id || '',
        };

        try {
            const resultConsul: GetConsultation = await fetchCreateConsultation(newConsultation);
            selectedDiagnosisIds.forEach(async (id) => {
                await fetchAddConsulDiag({
                    consultationId: resultConsul.id,
                    diagnosisId: id
                })
            })
            selectedTreatmentIds.forEach(async (id) => {
                await fetchAddConsulTreat({
                    consultationId: resultConsul.id,
                    treatmentId: id
                })
            })
            // Limpiar el estado guardado
            localStorage.removeItem('newConsultationState');
            toast.success("Consulta creada correctamente");
            navigate(`/dashboard/org/${organization?.id}/clinic/consultations`);
        } catch (error) {
            console.error("Error creating consultation:", error);
            toast.error("Error al crear la consulta");
        }
    };

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Stethoscope className="w-6 h-6 text-primary" />
                    </div>
                    <h1 className="text-3xl font-bold">Nueva Consulta</h1>
                </div>
                <div className="flex gap-4">
                    {selectedPatientId && (
                        <Button
                            variant="outline"
                            onClick={handleViewHistory}
                            className="flex items-center gap-2"
                        >
                            <History className="w-4 h-4" />
                            Ver Historial
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                                <User className="w-5 h-5 text-blue-500" />
                            </div>
                            <div>
                                <CardTitle>Información del Paciente</CardTitle>
                                <CardDescription>Seleccione el paciente y la cita correspondiente</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Paciente</Label>
                            <div className="space-y-2">
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                        <IconSearch />
                                    </div>
                                    <Input
                                        placeholder="Buscar paciente..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-9"
                                    />
                                </div>
                                <Select value={selectedPatientId} onValueChange={(val) => setSelectedPatientId(val)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccione un paciente" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Pacientes</SelectLabel>
                                            {filteredPatients && filteredPatients.length > 0 ? (
                                                filteredPatients.map((patient) => (
                                                    <SelectItem key={patient.id} value={patient.id}>
                                                        {`${patient.name} ${patient.aPaternal} ${patient.aMaternal}`}
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                <SelectItem value="no-results" disabled>
                                                    No se encontraron pacientes
                                                </SelectItem>
                                            )}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {selectedPatientId && (
                            <div className="space-y-2">
                                <Label>Cita (Opcional)</Label>
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-muted-foreground" />
                                    <select
                                        className="w-full px-3 py-2 border rounded-md bg-background"
                                        value={selectedAppointmentId}
                                        onChange={(e) => setSelectedAppointmentId(e.target.value)}
                                    >
                                        <option value="">Sin cita</option>
                                        {appointments.map(appointment => (
                                            <option key={appointment.id} value={appointment.id}>
                                                {new Date(appointment.appointmentDateTime).toLocaleString()}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                                <FileText className="w-5 h-5 text-green-500" />
                            </div>
                            <div>
                                <CardTitle>Detalles de la Consulta</CardTitle>
                                <CardDescription>Ingrese el motivo y observaciones de la consulta</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Motivo</Label>
                            <div className="flex items-start gap-2">
                                <AlertCircle className="w-5 h-5 text-muted-foreground mt-2" />
                                <textarea
                                    className="w-full px-3 py-2 border rounded-md bg-background min-h-[50px]"
                                    placeholder="Ej: Paciente reporta dolor torácico"
                                    value={motivo}
                                    onChange={(e) => setMotivo(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Observaciones</Label>
                            <div className="flex items-start gap-2">
                                <FileText className="w-5 h-5 text-muted-foreground mt-2" />
                                <textarea
                                    className="w-full px-3 py-2 border rounded-md bg-background min-h-[100px]"
                                    placeholder="Ej: Paciente parece fatigado, síntomas por 3 días"
                                    value={observaciones}
                                    onChange={(e) => setObservaciones(e.target.value)}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="md:col-span-2">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                                <ImageIcon className="w-5 h-5 text-purple-500" />
                            </div>
                            <div>
                                <CardTitle>Análisis de Imagen</CardTitle>
                                <CardDescription>Suba una imagen para análisis de IA</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <ImageIcon className="w-5 h-5 text-muted-foreground" />
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="cursor-pointer"
                                />
                            </div>
                            {imageFile && (
                                <div className="relative mt-4 w-48 h-48 mx-auto border rounded-md overflow-hidden flex items-center justify-center">
                                    <img
                                        src={URL.createObjectURL(imageFile)}
                                        alt="Uploaded"
                                        className="w-full h-full object-contain cursor-pointer"
                                        onClick={() => setShowImageModal(true)}
                                    />
                                    {isProcessingImage && (
                                        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                                            <div className="scanner-line w-full h-8 bg-green-500/50" />
                                        </div>
                                    )}
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        className="absolute top-2 right-2"
                                        onClick={() => {
                                            setImageFile(null);
                                            setAiDiagnosis(null);
                                        }}
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            )}
                            {aiDiagnosis && (
                                <div className="mt-4 p-4 bg-green-50 rounded-md flex items-center gap-2">
                                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                                    <p className="text-green-700">
                                        Diagnóstico AI: {aiDiagnosis.condition} - {aiDiagnosis.confidence}% confianza
                                    </p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card className="md:col-span-2">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                                <Stethoscope className="w-5 h-5 text-red-500" />
                            </div>
                            <div>
                                <CardTitle>Diagnósticos y Tratamientos</CardTitle>
                                <CardDescription>Seleccione los diagnósticos y tratamientos correspondientes</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <Stethoscope className="w-5 h-5 text-red-500" />
                                        <Label className="text-lg font-semibold">Diagnósticos</Label>
                                    </div>
                                    <Button
                                        variant="outline"
                                        onClick={() => setOpenModalDiag(true)}
                                        className="flex items-center gap-2"
                                    >
                                        <Stethoscope className="w-4 h-4" />
                                        Nuevo Diagnóstico
                                    </Button>
                                </div>
                                <div className="border rounded-md p-4 space-y-2 max-h-[300px] overflow-y-auto">
                                    {diagnoses.map((diagnosis) => (
                                        <label key={diagnosis.id} className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={selectedDiagnosisIds.includes(diagnosis.id)}
                                                onChange={() => {
                                                    setSelectedDiagnosisIds((prev) =>
                                                        prev.includes(diagnosis.id)
                                                            ? prev.filter((id) => id !== diagnosis.id)
                                                            : [...prev, diagnosis.id]
                                                    );
                                                }}
                                            />
                                            {diagnosis.name}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <Pill className="w-5 h-5 text-blue-500" />
                                        <Label className="text-lg font-semibold">Tratamientos</Label>
                                    </div>
                                    <Button
                                        variant="outline"
                                        onClick={() => setOpenModalTreat(true)}
                                        className="flex items-center gap-2"
                                    >
                                        <Pill className="w-4 h-4" />
                                        Nuevo Tratamiento
                                    </Button>
                                </div>
                                <div className="border rounded-md p-4 space-y-2 max-h-[300px] overflow-y-auto">
                                    {treatments.map((treatment) => (
                                        <label key={treatment.id} className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={selectedTreatmentIds.includes(treatment.id)}
                                                onChange={() => {
                                                    setSelectedTreatmentIds((prev) =>
                                                        prev.includes(treatment.id)
                                                            ? prev.filter((id) => id !== treatment.id)
                                                            : [...prev, treatment.id]
                                                    );
                                                }}
                                            />
                                            {treatment.description}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-4">
                        <Link to={`/dashboard/org/${organization?.id}/clinic/consultations`}>
                            <Button variant="outline" className="flex items-center gap-2">
                                <X className="w-4 h-4" />
                                Cancelar
                            </Button>
                        </Link>
                        <Button
                            onClick={handleSaveConsultation}
                            className="bg-primary text-white flex items-center gap-2"
                        >
                            <CheckCircle2 className="w-4 h-4" />
                            Guardar Consulta
                        </Button>
                    </CardFooter>
                </Card>
            </div>

            {/* Modal de visualización de imagen */}
            {showImageModal && imageFile && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="relative bg-background rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
                        <div className="absolute top-4 right-4 z-10">
                            <Button
                                variant="destructive"
                                size="icon"
                                onClick={() => setShowImageModal(false)}
                                className="bg-black/50 hover:bg-black/70"
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                        <div className="p-4">
                            <img
                                src={URL.createObjectURL(imageFile)}
                                alt="Imagen en tamaño completo"
                                className="w-full h-full object-contain max-h-[80vh]"
                            />
                        </div>
                    </div>
                </div>
            )}

            {openModalDiag && (
                <ModalCreateDiag
                    isOpen={openModalDiag}
                    onClose={() => setOpenModalDiag(false)}
                    setDiagnoses={setDiagnoses}
                    setFilteredDiagnoses={() => { }}
                />
            )}

            {openModalTreat && (
                <ModalCreateTreat
                    isOpen={openModalTreat}
                    onClose={() => setOpenModalTreat(false)}
                    setTreatments={setTreatments}
                    setFilteredTreatments={() => { }}
                />
            )}
        </div>
    );
}
