import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchFindAllPlans } from "@/services/organizations.services";
import type { Plan } from "@/lib/interfaces";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Check } from "lucide-react";
import { IconLogo } from "@/assets/icons";
import { ToggleThemeButton } from "@/components/ToggleThemeButton";
import { SignedIn, UserButton } from "@clerk/clerk-react";
import SyncUserWithBackend from "@/hooks/SyncUserWithBackend";

export default function Plans() {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [selectedPlan, setSelectedPlan] = useState<string>("");
    const [orgName, setOrgName] = useState<string>("");
    const navigate = useNavigate();
    const MIN_ORG_NAME_LENGTH = 3;

    useEffect(() => {
        const loadPlans = async () => {
            try {
                const result = await fetchFindAllPlans();
                setPlans(result);
            } catch (error) {
                toast.error("Error al cargar los planes");
            }
        };
        loadPlans();
    }, []);

    const handleSelectPlan = (planId: string) => {
        setSelectedPlan(planId);
    };

    const handleContinue = () => {
        if (!selectedPlan) {
            toast.error("Por favor selecciona un plan");
            return;
        }
        if (!orgName.trim() || orgName.trim().length < MIN_ORG_NAME_LENGTH) {
            toast.error(`El nombre de la organización debe tener al menos ${MIN_ORG_NAME_LENGTH} caracteres`);
            return;
        }
        navigate("/dashboard/payment", { 
            state: { 
                selectedPlan,
                orgName: orgName.trim()
            } 
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8">
                            <IconLogo />
                        </div>
                        <span className="text-xl font-semibold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
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
            <div className="pt-28 pb-16 px-4 sm:px-6 lg:px-8 ">
                <div className="max-w-7xl mx-auto ">
                    <div className="text-center mb-16">
                        <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-6">
                            Elige el Plan Perfecto para tu Organización
                        </h1>
                        <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">
                            Selecciona el plan que mejor se adapte a tus necesidades y comienza a optimizar tus diagnósticos
                        </p>
                    </div>

                    {/* Campo de nombre de organización */}
                    <div className="max-w-md mx-auto mb-16 bg-card p-8 rounded-2xl shadow-lg border border-border">
                        <label htmlFor="orgName" className="block text-lg font-semibold text-foreground mb-4">
                            Nombre de tu Organización a Crear
                        </label>
                        <input
                            type="text"
                            id="orgName"
                            value={orgName}
                            onChange={(e) => setOrgName(e.target.value)}
                            placeholder="Ingresa el nombre de tu organización"
                            className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background transition-all duration-200"
                            minLength={MIN_ORG_NAME_LENGTH}
                        />
                        <p className={`mt-2 text-sm ${orgName.trim().length > 0 && orgName.trim().length < MIN_ORG_NAME_LENGTH ? 'text-destructive' : 'text-muted-foreground'}`}>
                            {orgName.trim().length > 0 && orgName.trim().length < MIN_ORG_NAME_LENGTH 
                                ? `El nombre debe tener al menos ${MIN_ORG_NAME_LENGTH} caracteres (${orgName.trim().length}/${MIN_ORG_NAME_LENGTH})`
                                : orgName.trim().length >= MIN_ORG_NAME_LENGTH 
                                    ? '✓ Longitud válida'
                                    : `Mínimo ${MIN_ORG_NAME_LENGTH} caracteres`}
                        </p>
                    </div>

                    <div className="grid justify-items-center grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ">
                        {plans.map((plan) => (
                            <div
                                key={plan.id}
                                className={`relative rounded-2xl p-8 transition-all duration-300 cursor-pointer group
                                    ${selectedPlan === plan.id
                                        ? "bg-primary/10 border-2 border-primary shadow-xl scale-105"
                                        : "bg-card border border-border hover:shadow-lg hover:border-primary/50"
                                    }`}
                                onClick={() => handleSelectPlan(plan.id)}
                            >
                                {selectedPlan === plan.id && (
                                    <div className="absolute -top-3 -right-3 bg-primary text-primary-foreground rounded-full p-1.5 shadow-lg animate-in fade-in zoom-in">
                                        <Check className="h-5 w-5" />
                                    </div>
                                )}
                                
                                <div className="text-center">
                                    <h3 className="text-2xl font-bold text-foreground mb-2">
                                        {plan.name}
                                    </h3>
                                    <div className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-4">
                                        ${plan.price}
                                    </div>
                                    <p className="text-muted-foreground mb-6">
                                        {plan.description}
                                    </p>
                                </div>

                                <ul className="space-y-4 mb-8">
                                    <li className="flex items-center text-muted-foreground">
                                        <Check className="h-5 w-5 text-primary mr-2" />
                                        {plan.limitMembers} miembros
                                    </li>
                                    <li className="flex items-center text-muted-foreground">
                                        <Check className="h-5 w-5 text-primary mr-2" />
                                        {plan.limitModelUses} usos del modelo
                                    </li>
                                    <li className="flex items-center text-muted-foreground">
                                        <Check className="h-5 w-5 text-primary mr-2" />
                                        {plan.durationInDays} días de duración
                                    </li>
                                </ul>
                            </div>
                        ))}
                    </div>

                    <div className="mt-16 text-center">
                        <Button
                            onClick={handleContinue}
                            disabled={!selectedPlan || !orgName.trim() || orgName.trim().length < MIN_ORG_NAME_LENGTH}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-lg text-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                        >
                            Continuar con la Selección
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
} 