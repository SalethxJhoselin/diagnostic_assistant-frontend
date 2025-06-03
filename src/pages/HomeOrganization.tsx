import { useState, useEffect } from "react";
import { useOrganization } from "@/hooks/organizationContex";
import { fetchMembersByOrganization } from "@/services/organizations-members";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
// Registrar los elementos de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function HomeOrganization() {
  const { organization } = useOrganization();
  const [members, setMembers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      if (organization) {
        try {
          const data = await fetchMembersByOrganization(organization.id); // Obtener los miembros
          setMembers(data);
        } catch (error) {
          console.error("Error fetching members:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchData();
  }, [organization]);

  // Obtener el número de miembros actuales y el uso de modelos de la suscripción activa
  const currentMembers = members.length;
  const modelUsesCount = organization?.subscriptions[0]?.modelUsesCount || 0;
  const limitMembers = organization?.subscriptions[0]?.plan.limitMembers || 0;
  const limitModelUses = organization?.subscriptions[0]?.plan.limitModelUses || 0;

  // Configuración de los gráficos
  const membersChartData = {
    labels: ["Miembros Actuales", "Miembros Restantes", "Límite de Miembros"],
    datasets: [
      {
        label: "Miembros",
        data: [currentMembers, limitMembers - currentMembers, limitMembers],
        backgroundColor: ["#4CAF50", "#FF9800", "#2196F3"],
        borderColor: ["#388E3C", "#F57C00", "#1976D2"],
        borderWidth: 1,
      },
    ],
  };

  const modelUsesChartData = {
    labels: ["Usos Actuales", "Restantes", "Límite de Usos"],
    datasets: [
      {
        label: "Usos de Modelo",
        data: [modelUsesCount, limitModelUses - modelUsesCount, limitModelUses],
        backgroundColor: ["#FF5722", "#FFC107", "#009688"],
        borderColor: ["#D32F2F", "#FFB300", "#00796B"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-8">
      {/* Mensaje de bienvenida */}
      <div className="flex flex-col items-center mb-8">
        <h1 className="text-3xl font-semibold text-gray-800 mb-4">
          ¡Bienvenido a {organization?.name}!
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Estamos encantados de que seas parte de nuestra organización. Aquí tienes un resumen de tu cuenta.
        </p>
      </div>

      {/* Información de la organización */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Información de la Organización</h2>
        <p className="text-sm text-gray-600 mb-2">
          <strong>Organización:</strong> {organization?.name}
        </p>
        <p className="text-sm text-gray-600 mb-2">
          <strong>Host:</strong> {organization?.hostUser}
        </p>
        <p className="text-sm text-gray-600 mb-2">
          <strong>Suscripción Activa:</strong> {organization?.subscriptions[0]?.plan.name}
        </p>
        <p className="text-sm text-gray-600">
            <strong>Fecha de Expiración:</strong> 
            {organization?.subscriptions[0]?.endDate ? 
                new Date(organization.subscriptions[0].endDate).toLocaleDateString() : 
                "Fecha no disponible"
            }
            </p>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gráfico de Miembros */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Miembros</h3>
          {isLoading ? (
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
          ) : (
            <Bar data={membersChartData} options={{ responsive: true }} />
          )}
        </div>

        {/* Gráfico de Uso de Modelos */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Uso de Modelos</h3>
          {isLoading ? (
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
          ) : (
            <Bar data={modelUsesChartData} options={{ responsive: true }} />
          )}
        </div>
      </div>
    </div>
  );
}
