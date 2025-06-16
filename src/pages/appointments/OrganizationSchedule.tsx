import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useOrganization } from "@/hooks/organizationContex";
import { fetchMembersByOrganization, type OrganizationMember } from "@/services/organizations-members";
import { fetchOrganizationAttentionHours, type AttentionHour } from "@/services/attentionHours";
import { CalendarDays, Clock, Users } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Constantes
const DAYS_OF_WEEK = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"] as const;
const BLOCK_COLORS = [
  { light: 'bg-green-100 border-green-200', dark: 'dark:bg-green-900/30 dark:border-green-800' },
  { light: 'bg-blue-100 border-blue-200', dark: 'dark:bg-blue-900/30 dark:border-blue-800' },
  { light: 'bg-purple-100 border-purple-200', dark: 'dark:bg-purple-900/30 dark:border-purple-800' },
  { light: 'bg-yellow-100 border-yellow-200', dark: 'dark:bg-yellow-900/30 dark:border-yellow-800' },
  { light: 'bg-pink-100 border-pink-200', dark: 'dark:bg-pink-900/30 dark:border-pink-800' },
] as const;

// Utilidades
const formatTime = (hour: number, minute: number) => 
  `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

const sameDay = (a: string, b: string) => a.toLowerCase() === b.toLowerCase();

const sameUser = (u: { id?: string; userId?: string }, m: OrganizationMember) =>
  u.id === m.userId || u.id === m.id || u.userId === m.userId;

export default function OrganizationSchedule() {
  const { organization } = useOrganization();
  const [members, setMembers] = useState<OrganizationMember[]>([]);
  const [attentionHours, setAttentionHours] = useState<AttentionHour[]>([]);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [startHour, setStartHour] = useState(0);
  const [endHour, setEndHour] = useState(23);

  useEffect(() => {
    const loadData = async () => {
      if (!organization) return;
      try {
        const [membersData, hoursData] = await Promise.all([
          fetchMembersByOrganization(organization.id),
          fetchOrganizationAttentionHours(organization.id)
        ]);
        setMembers(membersData);
        setAttentionHours(hoursData);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, [organization]);

  const handleDayClick = (day: string) => {
    setSelectedDay(day);
    setActiveTab("detail");
  };

  const isMemberAssignedToDay = (member: OrganizationMember, day: string) =>
    attentionHours.some(
      (hour) =>
        hour.days.some((d) => sameDay(d, day)) &&
        hour.users.some((u) => sameUser(u, member))
    );

  const getMemberTimeBlocksForDay = (member: OrganizationMember, day: string) => {
    const relevant = attentionHours.filter(
      (hour) =>
        hour.days.some((d) => sameDay(d, day)) &&
        hour.users.some((u) => sameUser(u, member))
    );

    return relevant.map((hour, index) => {
      const startDate = new Date(hour.startTime);
      const endDate = new Date(hour.endTime);
      
      const startHour = startDate.getUTCHours() + (startDate.getUTCMinutes() / 60);
      const endHour = endDate.getUTCHours() + (endDate.getUTCMinutes() / 60);
      
      const adjustedEndHour = endHour < startHour ? endHour + 24 : endHour;

      return {
        start: startHour,
        end: adjustedEndHour,
        id: hour.id,
        color: `${BLOCK_COLORS[index % BLOCK_COLORS.length].light} ${BLOCK_COLORS[index % BLOCK_COLORS.length].dark}`
      };
    });
  };

  const getMemberAssignmentsCountForDay = (member: OrganizationMember, day: string) =>
    attentionHours.filter(hour => 
      hour.days.some(d => sameDay(d, day)) && 
      hour.users.some(u => sameUser(u, member))
    ).length;

  // Generar opciones de hora para el selector
  const hourOptions = Array.from({ length: 24 }, (_, i) => ({
    value: i.toString(),
    label: formatTime(i, 0)
  }));

  // Generar intervalos de 15 minutos
  const timeSlots = Array.from({ length: 24 * 4 }, (_, i) => {
    const hour = Math.floor(i / 4);
    const minute = (i % 4) * 15;
    return formatTime(hour, minute);
  });

  // Filtrar los timeSlots basado en el rango seleccionado
  const filteredTimeSlots = timeSlots.filter((time) => {
    const [hour] = time.split(':').map(Number);
    return hour >= startHour && hour <= endHour;
  });

  const renderTimeBlock = (time: string, block: any, isInBlock: boolean) => (
    <td key={time} className="px-1 py-4 text-center">
      <div className="relative h-8">
        {isInBlock && (
          <div className={`absolute inset-0 ${block.color} rounded-md`} />
        )}
        <span
          className={`relative inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium ${
            isInBlock 
              ? 'text-gray-800 dark:text-gray-200' 
              : 'text-gray-400 dark:text-gray-600'
          }`}
        >
          {isInBlock ? '✓' : ''}
        </span>
      </div>
    </td>
  );

  const renderMemberRow = (member: OrganizationMember, timeBlocks: any[]) => (
    <>
      <tr key={member.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors">
        <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100 whitespace-nowrap">
          {member.user?.email ?? member.userId}
        </td>
        {filteredTimeSlots.map((time) => {
          const [hour, minute] = time.split(':').map(Number);
          const timeValue = hour + (minute / 60);
          
          const block = timeBlocks[0];
          const isInBlock = block && (() => {
            const normalizedTime = timeValue;
            const normalizedStart = block.start;
            const normalizedEnd = block.end > 23 ? block.end - 24 : block.end;
            
            return block.end > 23
              ? normalizedTime >= normalizedStart || normalizedTime <= normalizedEnd
              : normalizedTime >= normalizedStart && normalizedTime <= normalizedEnd;
          })();
          
          return renderTimeBlock(time, block, isInBlock);
        })}
      </tr>
      {timeBlocks.slice(1).map((block, blockIndex) => (
        <tr key={`${member.id}-${blockIndex}`} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors">
          <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100 whitespace-nowrap">
            <span className="text-gray-400 dark:text-gray-500 text-xs">Horario adicional {blockIndex + 2}</span>
          </td>
          {filteredTimeSlots.map((time) => {
            const [hour, minute] = time.split(':').map(Number);
            const timeValue = hour + (minute / 60);
            
            const isInBlock = (() => {
              const normalizedTime = timeValue;
              const normalizedStart = block.start;
              const normalizedEnd = block.end > 23 ? block.end - 24 : block.end;
              
              return block.end > 23
                ? normalizedTime >= normalizedStart || normalizedTime <= normalizedEnd
                : normalizedTime >= normalizedStart && normalizedTime <= normalizedEnd;
            })();
            
            return renderTimeBlock(time, block, isInBlock);
          })}
        </tr>
      ))}
    </>
  );

  return (
    <div className="w-full flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Horario de Atención de Miembros</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <div className="flex items-center gap-2">
                <Select
                  value={startHour.toString()}
                  onValueChange={(value) => setStartHour(parseInt(value))}
                >
                  <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="Desde" />
                  </SelectTrigger>
                  <SelectContent>
                    {hourOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span className="text-gray-500 dark:text-gray-400">-</span>
                <Select
                  value={endHour.toString()}
                  onValueChange={(value) => setEndHour(parseInt(value))}
                >
                  <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="Hasta" />
                  </SelectTrigger>
                  <SelectContent>
                    {hourOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="text-sm text-gray-500 dark:text-gray-400">{members.length} miembros</span>
            </div>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4 bg-gray-100 dark:bg-gray-800">
          <TabsTrigger value="overview" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">
            Vista General
          </TabsTrigger>
          <TabsTrigger value="detail" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">
            Vista Detallada
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card className="p-4 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700/50">
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">Miembro</th>
                    {DAYS_OF_WEEK.map((day) => (
                      <th 
                        key={day} 
                        className="px-4 py-4 text-center text-sm font-medium text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        onClick={() => handleDayClick(day)}
                      >
                        <div className="flex flex-col items-center gap-1">
                          <span>{day.charAt(0).toUpperCase() + day.slice(1)}</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {members.map((member) => (
                    <tr key={member.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100 whitespace-nowrap">
                        {member.user?.email ?? member.userId}
                      </td>
                      {DAYS_OF_WEEK.map((day) => {
                        const isAssigned = isMemberAssignedToDay(member, day);
                        const assignmentsCount = getMemberAssignmentsCountForDay(member, day);
                        
                        return (
                          <td 
                            key={day} 
                            className="px-4 py-4 text-center"
                          >
                            <span
                              className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${
                                isAssigned 
                                  ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' 
                                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                              }`}
                            >
                              {isAssigned ? `${assignmentsCount} asignación${assignmentsCount !== 1 ? 'es' : ''}` : 'Sin asignar'}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="detail">
          <Card className="p-4 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <div className="mb-4">
              <select 
                className="w-full max-w-xs px-3 py-2 border rounded-md bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                value={selectedDay || ''}
                onChange={(e) => setSelectedDay(e.target.value)}
              >
                <option value="">Seleccione un día</option>
                {DAYS_OF_WEEK.map((day) => (
                  <option key={day} value={day}>{day.charAt(0).toUpperCase() + day.slice(1)}</option>
                ))}
              </select>
            </div>

            {selectedDay && (
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto border-collapse">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-700/50">
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">Miembro</th>
                      {filteredTimeSlots.map((time) => (
                        <th key={time} className="px-2 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                          {time}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {members.map((member) => {
                      const timeBlocks = getMemberTimeBlocksForDay(member, selectedDay);
                      return renderMemberRow(member, timeBlocks);
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

