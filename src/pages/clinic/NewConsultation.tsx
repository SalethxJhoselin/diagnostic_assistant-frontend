import { Button } from "@/components/ui/button";
import { useOrganization } from "@/hooks/organizationContex";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
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

    const [openModalDiag, setOpenModalDiag] = useState(false)
    const [openModalTreat, setOpenModalTreat] = useState(false)

    const { organization,user } = useOrganization();
    const navigate = useNavigate();

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
                setDiagnoses(diagnosesData);
                setTreatments(treatmentsData);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, [organization]);

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
            userId: user?.id ||'' ,
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
            toast.success("Consulta creada correctamente");
            navigate(`/dashboard/org/${organization?.id}/clinic/consultations`);
        } catch (error) {
            console.error("Error creating consultation:", error);
            toast.error("Error al crear la consulta");
        }
    };

    return (
        <div className="w-full flex flex-col sm:px-20 px-4 py-10">
            <h1 className="text-2xl mb-4 font-semibold">Nueva Consulta</h1>
            <section className="flex flex-col gap-6">
                <div>
                    <Select value={selectedPatientId} onValueChange={(val) => setSelectedPatientId(val)}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="seleccione un paciente" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Pacientes</SelectLabel>
                                {
                                    patients.map((patient) => (
                                        <SelectItem key={patient.id} value={patient.id}>
                                            {`${patient.name} ${patient.aPaternal} ${patient.aMaternal}`}
                                        </SelectItem>
                                    ))
                                }
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                {selectedPatientId && (
                    <div>
                        <label className="font-semibold">Cita (Opcional)</label>
                        <select
                            className="w-full px-2 py-1 border rounded-md"
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
                )}

                <div>
                    <label className="font-semibold">Motivo</label>
                    <input
                        type="text"
                        className="w-full px-2 py-1 border rounded-md"
                        placeholder="Ej: Paciente reporta dolor torácico"
                        value={motivo}
                        onChange={(e) => setMotivo(e.target.value)}
                    />
                </div>
                <div>
                    <label className="font-semibold">Observaciones</label>
                    <textarea
                        className="w-full px-2 py-1 border rounded-md"
                        rows={3}
                        placeholder="Ej: Paciente parece fatigado, síntomas por 3 días"
                        value={observaciones}
                        onChange={(e) => setObservaciones(e.target.value)}
                    />
                </div>

                <div>
                    <label className="font-semibold">Subir Imagen (Opcional)</label>
                    <input
                        type="file"
                        accept="image/*"
                        className="w-full px-2 py-1 border rounded-md"
                        onChange={handleImageUpload}
                    />
                    {imageFile && (
                        <div className="relative mt-4 w-48 h-48 mx-auto border rounded-md overflow-hidden flex items-center justify-center">
                            <img
                                src={URL.createObjectURL(imageFile)}
                                alt="Uploaded"
                                className="w-full h-full object-contain"
                            />
                            {isProcessingImage && (
                                <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                                    <div className="scanner-line w-full h-8 bg-green-500/50" />
                                </div>
                            )}

                        </div>
                    )}

                    {aiDiagnosis && (
                        <p className="mt-2 text-green-600">
                            Diagnóstico AI: {aiDiagnosis.condition} - {aiDiagnosis.confidence}% confianza
                        </p>
                    )}
                </div>

                <div className="bg-secondary p-4 rounded-md">
                    <label className="font-semibold">Diagnósticos</label>
                    <div className="border rounded-md p-2 flex flex-col gap-2">
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
                    <section className="mt-2 flex items-center gap-x-2">
                        <label className="">Puede agregar un nuevo diagnostico si lo desea</label>
                        <Button
                            className="text-white cursor-pointer animate-fade-in-left"
                            onClick={() => setOpenModalDiag(true)}
                        >
                            Nuevo Diagnostico
                        </Button>
                        {openModalDiag &&
                            <ModalCreateDiag
                                isOpen={openModalDiag}
                                onClose={() => setOpenModalDiag(false)}
                                setDiagnoses={setDiagnoses}
                                setFilteredDiagnoses={()=>{}}
                            />
                        }
                    </section>
                </div>


                <div className="bg-secondary p-4 rounded-md">
                    <label className="font-semibold">Tratamientos</label>
                    <div className="border rounded-md p-2 flex flex-col gap-2">
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
                    <section className="mt-2 flex items-center gap-x-2">
                        <label className="">Puede agregar un nuevo tratamiento si lo desea</label>
                        <Button
                            className="hover:bg-primary/90 text-white cursor-pointer animate-fade-in-left"
                            onClick={() => setOpenModalTreat(true)}
                        >
                            Nuevo Tratamiento
                        </Button>
                        {openModalTreat &&
                            <ModalCreateTreat
                                isOpen={openModalTreat}
                                onClose={() => setOpenModalTreat(false)}
                                setTreatments={setTreatments}
                                setFilteredTreatments={()=>{}}
                            />
                        }
                    </section>
                </div>


                <div className="flex gap-4">
                    <Link to={`/dashboard/org/${organization?.id}/clinic/consultations`}>
                        <Button variant="outline">Cancelar</Button>
                    </Link>
                    <Button onClick={handleSaveConsultation} className="text-white">Guardar Consulta</Button>
                </div>
            </section>
        </div>
    );
}