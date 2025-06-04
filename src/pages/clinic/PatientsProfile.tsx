import { useState, useEffect } from "react";
import { useOrganization } from "@/hooks/organizationContex";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { type PatientHistory, fetchPatientHistory } from "@/services/consultations.services";
import {
    User,
    Phone,
    Mail,
    MapPin,
    Calendar,
    Heart,
    AlertTriangle,
    Droplet,
    PhoneCall,
    FileText,
    Stethoscope,
    Pill,
    IdCard,
    Venus,
    Mars,
    X,
    Clock,
    UserCircle
} from "lucide-react";

export default function PatientsProfile() {
    const [patientHistory, setPatientHistory] = useState<PatientHistory | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedConsultation, setSelectedConsultation] = useState<PatientHistory['consultations'][0] | null>(null);
    const { organization } = useOrganization();
    const patientId = "cmbhefcyi0001urh4eo3pu3fm";

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const history = await fetchPatientHistory(patientId);
                setPatientHistory(history);
            } catch (error) {
                console.error("Error fetching patient history:", error);
                toast.error("Error al cargar el historial médico");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [patientId]);

    const handleCloseModal = () => {
        setSelectedConsultation(null);
    };

    if (!patientHistory) {
        return (
            <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-gray-600">Cargando historial médico...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Historial Médico</h1>
                    <Button className="bg-primary hover:bg-primary/90">
                        <FileText className="w-4 h-4 mr-2" />
                        Descargar Historial
                    </Button>
                </div>

                {/* Tarjetas de información del paciente */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Información personal */}
                    <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
                        <div className="flex items-center mb-6">
                            <div className="w-15 h-15 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                                <User className="w-20 h-20 text-primary" />
                            </div>
                            <h2 className="text-xl font-semibold text-gray-800">Información Personal</h2>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors">
                                <User className="w-5 h-5 text-blue-500 mr-3" />
                                <div className="flex-1">
                                    <span className="text-gray-600">Nombre Completo:</span>
                                    <span className="font-medium ml-2">{`${patientHistory.patient.name} ${patientHistory.patient.aPaternal} ${patientHistory.patient.aMaternal}`}</span>
                                </div>
                            </div>
                            <div className="flex items-center p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors">
                                <IdCard className="w-5 h-5 text-purple-500 mr-3" />
                                <div className="flex-1">
                                    <span className="text-gray-600">Identificación:</span>
                                    <span className="font-medium ml-2">{`${patientHistory.patient.ci}`}</span>
                                </div>
                            </div>
                            <div className="flex items-center p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors">
                                {patientHistory.patient.sexo === 'F' ? (
                                    <Venus className="w-5 h-5 text-pink-500 mr-3" />
                                ) : (
                                    <Mars className="w-5 h-5 text-blue-600 mr-3" />
                                )}
                                <div className="flex-1">
                                    <span className="text-gray-600">Sexo:</span>
                                    <span className="font-medium ml-2">
                                        {patientHistory.patient.sexo === 'F' ? 'Femenino' : 'Masculino'}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors">
                                <Calendar className="w-5 h-5 text-green-500 mr-3" />
                                <div className="flex-1">
                                    <span className="text-gray-600">Fecha de Nacimiento:</span>
                                    <span className="font-medium ml-2">{new Date(patientHistory.patient.birthDate).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <div className="flex items-center p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors">
                                <Phone className="w-5 h-5 text-orange-500 mr-3" />
                                <div className="flex-1">
                                    <span className="text-gray-600">Teléfono:</span>
                                    <span className="font-medium ml-2">{patientHistory.patient.phone}</span>
                                </div>
                            </div>
                            <div className="flex items-center p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors">
                                <Mail className="w-5 h-5 text-red-500 mr-3" />
                                <div className="flex-1">
                                    <span className="text-gray-600">Email:</span>
                                    <span className="font-medium ml-2">{patientHistory.patient.email}</span>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Condiciones médicas */}
                    <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
                        <div className="flex items-center mb-6">
                            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mr-4">
                                <Heart className="w-6 h-6 text-red-500" />
                            </div>
                            <h2 className="text-xl font-semibold text-gray-800">Condiciones Médicas</h2>
                        </div>
                        <div className="space-y-4">
                            <div className="p-4 bg-white rounded-lg hover:bg-gray-50 transition-colors">
                                <div className="flex items-center mb-2">
                                    <Stethoscope className="w-5 h-5 text-red-500 mr-2" />
                                    <h3 className="font-medium text-gray-700">Enfermedades Crónicas</h3>
                                </div>
                                <p className="text-gray-500 ml-7">No hay enfermedades crónicas registradas</p>
                            </div>
                            <div className="p-4 bg-white rounded-lg hover:bg-gray-50 transition-colors">
                                <div className="flex items-center mb-2">
                                    <AlertTriangle className="w-5 h-5 text-yellow-500 mr-2" />
                                    <h3 className="font-medium text-gray-700">Alergias</h3>
                                </div>
                                <p className="text-gray-500 ml-7">No hay alergias registradas</p>
                            </div>
                            <div className="p-4 bg-white rounded-lg hover:bg-gray-50 transition-colors">
                                <div className="flex items-center mb-2">
                                    <Droplet className="w-5 h-5 text-blue-500 mr-2" />
                                    <h3 className="font-medium text-gray-700">Tipo de Sangre</h3>
                                </div>
                                <p className="text-gray-500 ml-7">No registrado</p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Historial de consultas */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-semibold text-gray-800">Historial de Consultas</h2>
                        
                    </div>

                    {isLoading ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                            <p className="mt-4 text-gray-600">Cargando historial médico...</p>
                        </div>
                    ) : patientHistory.consultations.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-600">No hay registros médicos disponibles.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {patientHistory.consultations.map((consultation) => (
                                <Card key={consultation.id} className="p-6 hover:shadow-md transition-shadow duration-300">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h2 className="text-xl font-semibold mb-2 text-gray-800">
                                                Consulta del {new Date(consultation.consultationDate).toLocaleDateString()}
                                            </h2>
                                            <p className="text-gray-600">
                                                Doctor: {consultation.user.email}
                                            </p>
                                        </div>
                                        <Button 
                                            variant="outline" 
                                            className="text-primary border-primary hover:bg-primary/10"
                                            onClick={() => setSelectedConsultation(consultation)}
                                        >
                                            Ver Detalles
                                        </Button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h3 className="font-semibold mb-2 text-gray-700">Motivo de la Consulta</h3>
                                            <p className="text-gray-600">{consultation.motivo}</p>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h3 className="font-semibold mb-2 text-gray-700">Observaciones</h3>
                                            <p className="text-gray-600">{consultation.observaciones}</p>
                                        </div>
                                    </div>

                                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h3 className="font-semibold mb-2 text-gray-700">Diagnósticos</h3>
                                            {consultation.diagnoses.length > 0 ? (
                                                <ul className="list-disc list-inside space-y-1">
                                                    {consultation.diagnoses.map(({ diagnosis }) => (
                                                        <li key={diagnosis.id} className="text-gray-600">
                                                            {diagnosis.name}
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p className="text-gray-500">No hay diagnósticos registrados</p>
                                            )}
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h3 className="font-semibold mb-2 text-gray-700">Tratamientos</h3>
                                            {consultation.treatments.length > 0 ? (
                                                <ul className="list-disc list-inside space-y-1">
                                                    {consultation.treatments.map(({ treatment }) => (
                                                        <li key={treatment.id} className="text-gray-600">
                                                            {treatment.description}
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p className="text-gray-500">No hay tratamientos registrados</p>
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal de Detalles de Consulta */}
            {selectedConsultation && (
                <div className="fixed inset-0 bg-gray-900/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-xl">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-6">
                                <h2 className="text-2xl font-semibold text-gray-800">
                                    Detalles de la Consulta
                                </h2>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={handleCloseModal}
                                    className="hover:bg-gray-100"
                                >
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>

                            <div className="space-y-6">
                                {/* Información del Doctor */}
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="flex items-center mb-4">
                                        <UserCircle className="w-6 h-6 text-primary mr-2" />
                                        <h3 className="text-lg font-semibold text-gray-800">Información del Doctor</h3>
                                    </div>
                                    <p className="text-gray-600">
                                        <span className="font-medium">Email:</span> {selectedConsultation.user.email}
                                    </p>
                                </div>

                                {/* Fecha y Hora */}
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="flex items-center mb-4">
                                        <Clock className="w-6 h-6 text-green-500 mr-2" />
                                        <h3 className="text-lg font-semibold text-gray-800">Fecha y Hora</h3>
                                    </div>
                                    <p className="text-gray-600">
                                        {new Date(selectedConsultation.consultationDate).toLocaleString()}
                                    </p>
                                </div>

                                {/* Motivo y Observaciones */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Motivo de la Consulta</h3>
                                        <p className="text-gray-600">{selectedConsultation.motivo}</p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Observaciones</h3>
                                        <p className="text-gray-600">{selectedConsultation.observaciones}</p>
                                    </div>
                                </div>

                                {/* Diagnósticos */}
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="flex items-center mb-4">
                                        <Stethoscope className="w-6 h-6 text-red-500 mr-2" />
                                        <h3 className="text-lg font-semibold text-gray-800">Diagnósticos</h3>
                                    </div>
                                    {selectedConsultation.diagnoses.length > 0 ? (
                                        <div className="space-y-3">
                                            {selectedConsultation.diagnoses.map(({ diagnosis }) => (
                                                <div key={diagnosis.id} className="bg-white p-3 rounded-md">
                                                    <h4 className="font-medium text-gray-800">{diagnosis.name}</h4>
                                                    <p className="text-gray-600 mt-1">{diagnosis.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500">No hay diagnósticos registrados</p>
                                    )}
                                </div>

                                {/* Tratamientos */}
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="flex items-center mb-4">
                                        <Pill className="w-6 h-6 text-blue-500 mr-2" />
                                        <h3 className="text-lg font-semibold text-gray-800">Tratamientos</h3>
                                    </div>
                                    {selectedConsultation.treatments.length > 0 ? (
                                        <div className="space-y-3">
                                            {selectedConsultation.treatments.map(({ treatment }) => (
                                                <div key={treatment.id} className="bg-white p-3 rounded-md">
                                                    <h4 className="font-medium text-gray-800">{treatment.description}</h4>
                                                    <div className="mt-2 space-y-1">
                                                        <p className="text-gray-600">
                                                            <span className="font-medium">Duración:</span> {treatment.duration}
                                                        </p>
                                                        <p className="text-gray-600">
                                                            <span className="font-medium">Instrucciones:</span> {treatment.instructions}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500">No hay tratamientos registrados</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}