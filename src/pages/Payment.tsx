import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { IconLogo } from "@/assets/icons";
import { ToggleThemeButton } from "@/components/ToggleThemeButton";
import { SignedIn, UserButton, useUser } from "@clerk/clerk-react";
import SyncUserWithBackend from "@/hooks/SyncUserWithBackend";
import { Check, CreditCard, Lock } from "lucide-react";
import { fetchOrgCreate, fetchSubsCreate, fetchOrgById, fetchFindAllPlans, type CreateOrg, type CreateSubs } from "@/services/organizations.services";
import { useOrganization } from "@/hooks/organizationContex";
import type { Plan } from "@/lib/interfaces";

export default function Payment() {
    const location = useLocation();
    const navigate = useNavigate();
    const selectedPlan = location.state?.selectedPlan;
    const orgName = location.state?.orgName;
    const [isProcessing, setIsProcessing] = useState(false);
    const [planInfo, setPlanInfo] = useState<Plan | null>(null);
    const { user } = useUser();
    const { handleSetOrganization } = useOrganization();

    useEffect(() => {
        if (!selectedPlan || !orgName) {
            navigate("/dashboard/plans");
            return;
        }

        const loadPlanInfo = async () => {
            try {
                const plans = await fetchFindAllPlans();
                const plan = plans.find((p: Plan) => p.id === selectedPlan);
                if (plan) {
                    setPlanInfo(plan);
                }
            } catch (error) {
                console.error("Error al cargar la información del plan:", error);
                toast.error("Error al cargar la información del plan");
            }
        };

        loadPlanInfo();
    }, [selectedPlan, orgName, navigate]);

    const handlePayment = async () => {
        setIsProcessing(true);
        try {
            // Simulamos el proceso de pago
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Creamos la organización
            const newOrg: CreateOrg = {
                name: orgName,
                hostUser: user?.primaryEmailAddress?.emailAddress || ''
            };
            const resultOrg = await fetchOrgCreate(newOrg);

            // Creamos la suscripción
            const newSubs: CreateSubs = {
                planId: selectedPlan,
                organizationId: resultOrg.id
            };
            await fetchSubsCreate(newSubs);

            // Obtenemos la organización completa
            const newOrgContext = await fetchOrgById(resultOrg.id);
            handleSetOrganization(newOrgContext);

            toast.success("¡Pago procesado y organización creada exitosamente!");
            navigate(`/dashboard/org/${resultOrg.id}`);
        } catch (error) {
            console.error("Error al procesar el pago:", error);
            toast.error("Error al procesar el pago. Por favor, intenta nuevamente.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <IconLogo />
                        <span className="text-xl font-semibold text-foreground">
                            Diagnostic Assistant
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <ToggleThemeButton />
                        <SignedIn>
                            <UserButton />
                            <SyncUserWithBackend />
                        </SignedIn>
                    </div>
                </div>
            </header>

            {/* Contenido principal */}
            <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                            Proceso de Pago
                        </h1>
                        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                            Completa los detalles de tu pago de forma segura
                        </p>
                    </div>

                    <div className="bg-secondary rounded-2xl p-8 shadow-lg">
                        <div className="flex items-center justify-center mb-8">
                            <div className="bg-primary/10 p-3 rounded-full">
                                <Lock className="h-8 w-8 text-primary" />
                            </div>
                        </div>

                        <div className="space-y-6">
                            {/* Información del plan y organización */}
                            <div className="bg-background/50 p-4 rounded-lg">
                                <h3 className="font-semibold text-lg mb-2">Resumen del Plan</h3>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 dark:text-gray-400">Organización</span>
                                    <span className="font-medium">{orgName}</span>
                                </div>
                                <div className="flex justify-between items-center mt-2">
                                    <span className="text-gray-600 dark:text-gray-400">Plan Seleccionado</span>
                                    <span className="font-medium">{planInfo?.name || 'Cargando...'}</span>
                                </div>
                                <div className="flex justify-between items-center mt-2">
                                    <span className="text-gray-600 dark:text-gray-400">Precio</span>
                                    <span className="font-medium">${planInfo?.price || '0.00'}</span>
                                </div>
                            </div>

                            {/* Formulario de pago simulado */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                    <Check className="h-4 w-4 text-primary" />
                                    <span>Pago seguro con encriptación SSL</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                    <Check className="h-4 w-4 text-primary" />
                                    <span>Procesamiento instantáneo</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                    <Check className="h-4 w-4 text-primary" />
                                    <span>Factura disponible inmediatamente</span>
                                </div>
                            </div>

                            {/* Botón de pago */}
                            <Button
                                onClick={handlePayment}
                                disabled={isProcessing}
                                className="w-full bg-primary hover:bg-primary/90 text-white py-6 text-lg font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                            >
                                {isProcessing ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        Procesando...
                                    </>
                                ) : (
                                    <>
                                        <CreditCard className="h-5 w-5" />
                                        Confirmar Pago
                                    </>
                                )}
                            </Button>

                            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                                Al hacer clic en "Confirmar Pago", aceptas nuestros términos y condiciones
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 