import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
    Building2,
    Users,
    Settings,
    Shield,
    Activity,
    Plus,
    Trash2,
    Edit2,
    Rocket,
    Calendar,
    Mail,
    Clock,
} from "lucide-react";
import { fetchOrgById } from "@/services/organizations.services";
import { fetchMembersByOrganization } from "@/services/organizations-members";
import { useOrganization } from "@/hooks/organizationContex";
import Loader from "@/components/Loader";
import DeleteOrganizationModal from "@/components/DeleteOrganizationModal";
import AddMemberModal from "@/components/AddMemberModal";
import EditOrganizationModal from "@/components/EditOrganizationModal";
import { toast } from "sonner";

interface Organization {
    id: string;
    name: string;
    hostUser: string;
    createdAt: string;
    updatedAt: string;
    subscriptions: {
        id: string;
        planId: string;
        startDate: string;
        endDate: string;
        modelUsesCount: number;
        isActive: boolean;
        plan: {
            id: string;
            name: string;
            description: string;
            limitMembers: number;
            limitModelUses: number;
            price: number;
            durationInDays: number;
        };
    }[];
}

interface Member {
    id: string;
    role: string;
    organizationId: string;
    userId: string;
    user: {
        email: string;
    };
}

export default function Admin() {
    const { organization } = useOrganization();
    const [organizationDates, setOrganizationDates] = useState<Organization | null>(null);
    const [loading, setLoading] = useState(true);
    const [members, setMembers] = useState<any[]>([]);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    useEffect(() => {
        const loadOrganization = async () => {
            try {
                if (organization?.id) {
                    const [orgData, membersData] = await Promise.all([
                        fetchOrgById(organization.id),
                        fetchMembersByOrganization(organization.id)
                    ]);
                    setOrganizationDates(orgData);
                    setMembers(membersData);
                }
            } catch (error) {
                console.error("Error al cargar la organización:", error);
            } finally {
                setLoading(false);
            }
        };

        loadOrganization();
    }, [organization?.id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader />
            </div>
        );
    }

    if (!organization || !organizationDates) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-muted-foreground">Organización no encontrada</p>
            </div>
        );
    }

    const activeSubscription = organizationDates.subscriptions.find(sub => sub.isActive);

    const handleAddMember = async () => {
        if (!organization) return;
        setIsAddMemberModalOpen(true);
    };

    const handleMemberCreated = async () => {
        if (!organization?.id) return;
        try {
            const membersData = await fetchMembersByOrganization(organization.id);
            setMembers(membersData);
        } catch (error) {
            console.error("Error al actualizar miembros:", error);
        }
    };

    const handleOrganizationUpdated = async () => {
        if (!organization?.id) return;
        try {
            const updatedOrg = await fetchOrgById(organization.id);
            setOrganizationDates(updatedOrg);
            if (organization) {
                organization.name = updatedOrg.name;
            }
            setMembers([...members]);
            toast.success("Organización actualizada correctamente");
        } catch (error) {
            console.error("Error al actualizar la organización:", error);
            toast.error("Error al actualizar la información de la organización");
        }
    };

    return (
        <TooltipProvider>
            <div className="min-h-screen bg-background p-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-foreground">Panel de Administración</h1>
                            <p className="text-muted-foreground mt-1">Gestiona y configura las organizaciones</p>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                                {/* Información Principal */}
                                <Card className="p-4 sm:p-6 md:p-8 bg-gradient-to-br from-background to-muted/20 border-primary/10 hover:shadow-lg transition-all duration-300 lg:col-span-2">
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6 sm:mb-8">
                                        <div className="p-2 rounded-lg bg-primary/10">
                                            <Building2 className="w-6 h-6 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg sm:text-xl font-semibold">Información de la Organización</h3>
                                            <p className="text-sm text-muted-foreground mt-1">Detalles generales y configuración</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                        <div className="flex items-center gap-3 sm:gap-4 p-4 sm:p-6 rounded-lg bg-background/50 hover:bg-background/80 transition-colors h-full">
                                            <div className="p-2 rounded-lg bg-primary/10">
                                                <Building2 className="w-5 h-5 text-primary" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-muted-foreground">Nombre</p>
                                                <p className="text-base font-semibold truncate">{organization.name}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 sm:gap-4 p-4 sm:p-6 rounded-lg bg-background/50 hover:bg-background/80 transition-colors h-full">
                                            <div className="p-2 rounded-lg bg-primary/10">
                                                <Mail className="w-5 h-5 text-primary" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-muted-foreground">Administrador</p>
                                                <p className="text-base font-semibold truncate">{organizationDates.hostUser}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 sm:gap-4 p-4 sm:p-6 rounded-lg bg-background/50 hover:bg-background/80 transition-colors h-full">
                                            <div className="p-2 rounded-lg bg-primary/10">
                                                <Calendar className="w-5 h-5 text-primary" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-muted-foreground">Fecha de Creación</p>
                                                <p className="text-base font-semibold">
                                                    {new Date(organizationDates.createdAt).toLocaleString('es-ES', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 sm:gap-4 p-4 sm:p-6 rounded-lg bg-background/50 hover:bg-background/80 transition-colors h-full">
                                            <div className="p-2 rounded-lg bg-primary/10">
                                                <Clock className="w-5 h-5 text-primary" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-muted-foreground">Última Actualización</p>
                                                <p className="text-base font-semibold">
                                                    {new Date(organizationDates.updatedAt).toLocaleString('es-ES', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </Card>

                                {/* Estado de la Organización */}
                                <Card className="p-4 sm:p-6 md:p-8 bg-gradient-to-br from-background to-muted/20 border-primary/10 hover:shadow-lg transition-all duration-300">
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6 sm:mb-8">
                                        <div className="p-2 rounded-lg bg-primary/10">
                                            <Activity className="w-6 h-6 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg sm:text-xl font-semibold">Estado Actual</h3>
                                            <p className="text-sm text-muted-foreground mt-1">Estado y actividad</p>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="p-4 rounded-lg bg-background/50">
                                            <div className="flex items-center justify-between mb-2">
                                                <p className="text-sm font-medium text-muted-foreground">Estado</p>
                                                <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                                                    Activo
                                                </span>
                                            </div>
                                            <p className="text-sm text-muted-foreground">La organización está funcionando correctamente</p>
                                        </div>

                                        {/* Barra de Progreso de Miembros */}
                                        <div className="p-4 rounded-lg bg-background/50 hover:bg-background/80 transition-all duration-300">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-2">
                                                    <Users className="w-4 h-4 text-primary" />
                                                    <p className="text-sm font-medium">Miembros</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-semibold text-primary">
                                                        {members.length}
                                                    </span>
                                                    <span className="text-sm text-muted-foreground">/</span>
                                                    <span className="text-sm text-muted-foreground">
                                                        {activeSubscription?.plan.limitMembers || 0}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="relative w-full h-3 bg-muted/50 rounded-full overflow-hidden">
                                                <div 
                                                    className="absolute h-full rounded-full transition-all duration-500 ease-out"
                                                    style={{ 
                                                        width: `${(members.length / (activeSubscription?.plan.limitMembers || 1)) * 100}%`,
                                                        background: members.length > (activeSubscription?.plan.limitMembers || 0) * 0.8 
                                                            ? 'linear-gradient(90deg, #ef4444 0%, #dc2626 100%)'
                                                            : 'linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)',
                                                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                                    }}
                                                />
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-2">
                                                {members.length} miembros activos de {activeSubscription?.plan.limitMembers || 0} permitidos
                                            </p>
                                        </div>

                                        {/* Barra de Progreso de Modelos */}
                                        <div className="p-4 rounded-lg bg-background/50 hover:bg-background/80 transition-all duration-300">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-2">
                                                    <Rocket className="w-4 h-4 text-primary" />
                                                    <p className="text-sm font-medium">Uso de Modelos</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-semibold text-primary">
                                                        {activeSubscription?.modelUsesCount || 0}
                                                    </span>
                                                    <span className="text-sm text-muted-foreground">/</span>
                                                    <span className="text-sm text-muted-foreground">
                                                        {activeSubscription?.plan.limitModelUses || 0}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="relative w-full h-3 bg-muted/50 rounded-full overflow-hidden">
                                                <div 
                                                    className="absolute h-full rounded-full transition-all duration-500 ease-out"
                                                    style={{ 
                                                        width: `${((activeSubscription?.modelUsesCount || 0) / (activeSubscription?.plan.limitModelUses || 1)) * 100}%`,
                                                        background: (activeSubscription?.modelUsesCount || 0) > (activeSubscription?.plan.limitModelUses || 0) * 0.8 
                                                            ? 'linear-gradient(90deg, #ef4444 0%, #dc2626 100%)'
                                                            : 'linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)',
                                                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                                    }}
                                                />
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-2">
                                                {activeSubscription?.modelUsesCount || 0} usos de {activeSubscription?.plan.limitModelUses || 0} disponibles
                                            </p>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </div>

                    </div>

                    {/* Tabs principales */}
                    <Tabs defaultValue="organizations" className="space-y-6">
                        <TabsList className="grid w-full grid-cols-4 lg:w-[800px]">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <TabsTrigger value="organizations">
                                        <Building2 className="w-4 h-4 mr-2" />
                                        Organización
                                    </TabsTrigger>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Gestionar organización</p>
                                </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <TabsTrigger value="users">
                                        <Users className="w-4 h-4 mr-2" />
                                        Usuarios
                                    </TabsTrigger>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Gestionar usuarios</p>
                                </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <TabsTrigger value="settings">
                                        <Settings className="w-4 h-4 mr-2" />
                                        Configuración
                                    </TabsTrigger>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Configuración general</p>
                                </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <TabsTrigger value="security">
                                        <Shield className="w-4 h-4 mr-2" />
                                        Seguridad
                                    </TabsTrigger>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Configuración de seguridad</p>
                                </TooltipContent>
                            </Tooltip>
                        </TabsList>

                        {/* Contenido de Organizaciones */}
                        <TabsContent value="organizations" className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {/* Tarjeta de Organización */}
                                <Card className="p-6 hover:shadow-lg transition-shadow overflow-hidden  max-w-full">

                                    <div className="justify-end flex gap-2 ">
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <Rocket className="w-4 h-4" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Upgrade</p>
                                            </TooltipContent>
                                        </Tooltip>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon"
                                                    onClick={() => setIsEditModalOpen(true)}
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Editar</p>
                                            </TooltipContent>
                                        </Tooltip>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className="text-destructive"
                                                    onClick={() => setIsDeleteModalOpen(true)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Eliminar</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </div>
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="font-semibold text-lg">{organization.name}</h3>
                                            <p className="text-sm text-muted-foreground">ID: {organization.id}</p>
                                        </div>

                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Plan:</span>
                                            <span className="font-medium">{activeSubscription?.plan.name || 'Sin plan'}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Miembros:</span>
                                            <span className="font-medium">{activeSubscription?.plan.limitMembers || 0} miembros</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">StarDate:</span>
                                            <p className="text-base font-semibold">
                                                {organization.subscriptions.length > 0 && new Date(organization.subscriptions[0].startDate).toLocaleString('es-ES', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">endDate:</span>
                                            <p className="text-base font-semibold">
                                                {organization.subscriptions.length > 0 && new Date(organization.subscriptions[0].endDate).toLocaleString('es-ES', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Estado:</span>
                                            <span className="text-green-500 font-medium">Activo</span>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </TabsContent>

                        {/* Contenido de Configuración */}
                        <TabsContent value="settings" className="space-y-6">
                            <Card className="p-6">
                                <h3 className="text-lg font-semibold mb-4">Configuración General</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label>Modo de prueba</Label>
                                            <p className="text-sm text-muted-foreground">
                                                Activa el modo de prueba para nuevas funcionalidades
                                            </p>
                                        </div>
                                        <Switch />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label>Notificaciones por email</Label>
                                            <p className="text-sm text-muted-foreground">
                                                Recibe actualizaciones importantes por correo
                                            </p>
                                        </div>
                                        <Switch />
                                    </div>
                                </div>
                            </Card>
                            <Card className="p-6">
                                <h3 className="text-lg font-semibold mb-4">Límites y Restricciones</h3>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Límite de miembros</Label>
                                            <Input
                                                type="number"
                                                value={organization.subscriptions.length > 0 ? organization.subscriptions[0].plan.limitMembers : 0}
                                                disabled
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Límite de diagnósticos</Label>
                                            <Input
                                                type="number"
                                                value={organization.subscriptions.length > 0 ? organization.subscriptions[0].plan.limitModelUses : 0}
                                                disabled
                                            />
                                        </div>
                                    </div>
                                </div>
                            </Card>

                        </TabsContent>

                        {/* Contenido de Seguridad */}
                        <TabsContent value="security" className="space-y-6">
                            <Card className="p-6">
                                <h3 className="text-lg font-semibold mb-4">Configuración de Seguridad</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label>Autenticación de dos factores</Label>
                                            <p className="text-sm text-muted-foreground">
                                                Requiere 2FA para todos los usuarios
                                            </p>
                                        </div>
                                        <Switch />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label>Registro de actividad</Label>
                                            <p className="text-sm text-muted-foreground">
                                                Mantén un registro de todas las acciones
                                            </p>
                                        </div>
                                        <Switch />
                                    </div>
                                </div>
                            </Card>

                            <Card className="p-6">
                                <h3 className="text-lg font-semibold mb-4">Registro de Actividad</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                                        <Activity className="w-5 h-5 text-primary" />
                                        <div>
                                            <p className="font-medium">Cambio de configuración</p>
                                            <p className="text-sm text-muted-foreground">Admin - Hace 5 minutos</p>
                                        </div>
                                    </div>
                                    {/* Más registros de actividad... */}
                                </div>
                            </Card>
                        </TabsContent>

                        {/* Contenido de Usuarios */}
                        <TabsContent value="users" className="space-y-6">
                            <Card className="p-4 sm:p-6 md:p-8 bg-gradient-to-br from-background to-muted/20 border-primary/10 hover:shadow-lg transition-all duration-300">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-primary/10">
                                            <Users className="w-6 h-6 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg sm:text-xl font-semibold">Miembros de la Organización</h3>
                                            <p className="text-sm text-muted-foreground mt-1">Gestiona los miembros y sus roles</p>
                                        </div>
                                    </div>
                                    <Button 
                                        className="flex items-center gap-2"
                                        onClick={handleAddMember}
                                    >
                                        <Plus className="w-4 h-4" />
                                        Agregar Miembro
                                    </Button>
                                </div>

                                <div className="space-y-4">
                                    {members.map((member: Member) => (
                                        <div 
                                            key={member.id}
                                            className="flex items-center justify-between p-4 rounded-lg bg-background/50 hover:bg-background/80 transition-all duration-300"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="p-2 rounded-full bg-primary/10">
                                                    <Users className="w-5 h-5 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">{member.user.email}</p>
                                                    <p className="text-sm text-muted-foreground">{member.role}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <Edit2 className="w-4 h-4" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Editar rol</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="text-destructive">
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Eliminar miembro</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </div>
                                        </div>
                                    ))}

                                    {members.length === 0 && (
                                        <div className="text-center py-8">
                                            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                            <p className="text-muted-foreground">No hay miembros en la organización</p>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>

                <DeleteOrganizationModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    organizationName={organization.name}
                    organizationId={organization.id}
                />

                {organization && (
                    <AddMemberModal
                        isOpen={isAddMemberModalOpen}
                        onClose={() => setIsAddMemberModalOpen(false)}
                        onCreated={handleMemberCreated}
                        organizationId={organization.id}
                    />
                )}

                {organization && (
                    <EditOrganizationModal
                        isOpen={isEditModalOpen}
                        onClose={() => setIsEditModalOpen(false)}
                        organizationName={organization.name}
                        organizationId={organization.id}
                        onUpdated={handleOrganizationUpdated}
                    />
                )}
            </div>
        </TooltipProvider>
    );
}