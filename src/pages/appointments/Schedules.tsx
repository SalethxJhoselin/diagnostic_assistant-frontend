import { useState, useEffect } from 'react';
import {
    fetchOrganizationAttentionHours,
    fetchCreateAttentionHour,
    fetchUpdateAttentionHour,
    fetchDeleteAttentionHour,
    fetchUsersByAttentionHour,
    fetchAssignMultipleUsersToHour,
    fetchRemoveMultipleUsersFromHour,
    type AttentionHour,
    type CreateAttentionHour
} from '../../services/attentionHours';
import { Button as UIButton } from "@/components/ui/button";
import { Button } from "antd";
import { useOrganization } from "@/hooks/organizationContex";
import { EditOutlined, DeleteOutlined, UserAddOutlined, UserDeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Form, Select, TimePicker, message } from 'antd';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { toast } from "sonner";
import BaseModal from '@/components/ui/BaseModal';
import { fetchMembersByOrganization, type OrganizationMember } from '@/services/organizations-members';

dayjs.extend(utc);
dayjs.extend(timezone);

const { Option } = Select;

// Constantes
const DAYS = [
    { label: 'Lunes', value: 'lunes' },
    { label: 'Martes', value: 'martes' },
    { label: 'Miércoles', value: 'miercoles' },
    { label: 'Jueves', value: 'jueves' },
    { label: 'Viernes', value: 'viernes' },
    { label: 'Sábado', value: 'sabado' },
    { label: 'Domingo', value: 'domingo' },
] as const;

export default function Schedules() {
    const [schedules, setSchedules] = useState<AttentionHour[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isAssignModalVisible, setIsAssignModalVisible] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [selectedSchedule, setSelectedSchedule] = useState<AttentionHour | null>(null);
    const [scheduleToDelete, setScheduleToDelete] = useState<string | null>(null);
    const [isRemoveUser, setIsRemoveUser] = useState(false);
    const [form] = Form.useForm();
    const [assignForm] = Form.useForm();
    const { organization } = useOrganization();
    const [assignedUsers, setAssignedUsers] = useState<OrganizationMember[]>([]);
    const [availableUsers, setAvailableUsers] = useState<OrganizationMember[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    if (!organization?.id) {
        return message.error('No se encontró la organización');
    }

    useEffect(() => {
        loadSchedules();
    }, []);

    const loadSchedules = async () => {
        try {
            const data = await fetchOrganizationAttentionHours(organization.id);
            setSchedules(data);
        } catch (error) {
            message.error('Error al cargar los horarios');
        }
    };

    const handleCreate = async (values: any) => {
        try {
            const scheduleData: CreateAttentionHour = {
                days: values.days,
                startTime: values.timeRange[0].format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
                endTime: values.timeRange[1].format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
                organizationId: organization?.id
            };

            await fetchCreateAttentionHour(scheduleData);
            message.success('Horario creado exitosamente');
            setIsModalVisible(false);
            form.resetFields();
            loadSchedules();
        } catch (error) {
            message.error('Error al crear el horario');
        }
    };

    const handleRemoveUser = async (values: any) => {
        if (!selectedSchedule) return;

        try {
            await fetchRemoveMultipleUsersFromHour({
                userIds: values.userIds,
                attentionHourId: selectedSchedule.id
            });
            message.success('Usuarios quitados exitosamente');
            setIsAssignModalVisible(false);
            assignForm.resetFields();
            loadSchedules();
        } catch (error) {
            message.error('Error al quitar los usuarios');
        }
    };

    const openAssignModal = async (schedule: AttentionHour, isRemove = false) => {
        if (!organization?.id) {
            message.error('No se encontró la organización');
            return;
        }

        setSelectedSchedule(schedule);
        setIsRemoveUser(isRemove);
        setIsAssignModalVisible(true);
        setIsLoading(true);

        try {
            const [orgUsers, attUsers] = await Promise.all([
                fetchMembersByOrganization(organization.id),
                fetchUsersByAttentionHour(schedule.id)
            ]);
            setAvailableUsers(orgUsers);
            setAssignedUsers(attUsers);
        } catch (error) {
            message.error('Error al cargar los usuarios');
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdate = async (values: any) => {
        if (!selectedSchedule) return;

        try {
            await fetchUpdateAttentionHour(selectedSchedule.id, {
                days: values.days,
                startTime: values.timeRange[0].format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
                endTime: values.timeRange[1].format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
            });
            message.success('Horario actualizado exitosamente');
            setIsModalVisible(false);
            form.resetFields();
            loadSchedules();
        } catch (error) {
            message.error('Error al actualizar el horario');
        }
    };

    const handleDelete = async (id: string) => {
        setScheduleToDelete(id);
        setIsDeleteModalVisible(true);
    };

    const confirmDelete = async () => {
        if (!scheduleToDelete) return;
        
        try {
            await fetchDeleteAttentionHour(scheduleToDelete);
            message.success('Horario eliminado exitosamente');
            setIsDeleteModalVisible(false);
            setScheduleToDelete(null);
            loadSchedules();
        } catch (error) {
            message.error('Error al eliminar el horario');
        }
    };

    const handleAssignUser = async (values: any) => {
        if (!selectedSchedule) return;

        try {
            await fetchAssignMultipleUsersToHour({
                userIds: values.userIds,
                attentionHourId: selectedSchedule.id
            });
            message.success('Usuarios asignados exitosamente');
            setIsAssignModalVisible(false);
            assignForm.resetFields();
            loadSchedules();
        } catch (error) {
            message.error('Error al asignar los usuarios');
        }
    };

    const renderActionButtons = (schedule: AttentionHour) => (
        <div className="flex gap-2">
            <UIButton
                className="border-primary text-primary hover:bg-primary/10"
                variant="outline"
                onClick={() => {
                    setSelectedSchedule(schedule);
                    form.setFieldsValue({
                        days: schedule.days,
                        timeRange: [
                            dayjs.utc(schedule.startTime),
                            dayjs.utc(schedule.endTime)
                        ]
                    });
                    setIsModalVisible(true);
                }}
            >
                <EditOutlined />
            </UIButton>
            <UIButton
                className="border-red-500 text-red-500 hover:bg-red-500/10"
                variant="outline"
                onClick={() => handleDelete(schedule.id)}
            >
                <DeleteOutlined />
            </UIButton>
            <UIButton
                className="border-primary text-primary hover:bg-primary/10"
                variant="outline"
                onClick={() => openAssignModal(schedule, false)}
            >
                <UserAddOutlined />
            </UIButton>
            <UIButton
                className="border-red-500 text-red-500 hover:bg-red-500/10"
                variant="outline"
                onClick={() => openAssignModal(schedule, true)}
            >
                <UserDeleteOutlined />
            </UIButton>
        </div>
    );

    return (
        <div className="w-full flex flex-col sm:px-20 px-4 py-10">
            <section className="mb-8">
                <h1 className="text-2xl mb-4 font-semibold">Horarios de Atención</h1>
                <div className="flex flex-col sm:flex-row gap-y-4 gap-x-4">
                    <UIButton
                        className="hover:bg-primary/90 border-zinc-400 px-6 py-2 cursor-pointer animate-fade-in-left"
                        onClick={() => {
                            setSelectedSchedule(null);
                            form.resetFields();
                            setIsModalVisible(true);
                        }}
                    >
                        Agregar Horario
                    </UIButton>
                </div>
            </section>

            <div className="w-full overflow-x-auto border rounded-md">
                <table className="min-w-full table-auto border-collapse">
                    <thead className="bg-secondary border-b">
                        <tr>
                            <th className="text-left px-4 py-2 border-r">Días</th>
                            <th className="text-left px-4 py-2 border-r">Hora de inicio</th>
                            <th className="text-left px-4 py-2 border-r">Hora de fin</th>
                            <th className="text-left px-4 py-2">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {schedules.map((schedule) => (
                            <tr key={schedule.id} className="group text-[14px]">
                                <td className="px-4 py-1 border group-hover:border-zinc-400 transition-colors duration-200 animate-fade-in-up">
                                    {schedule.days.join(', ')}
                                </td>
                                <td className="px-4 py-1 border group-hover:border-zinc-400 transition-colors duration-200 animate-fade-in-up">
                                    {dayjs.utc(schedule.startTime).format('HH:mm')}
                                </td>
                                <td className="px-4 py-1 border group-hover:border-zinc-400 transition-colors duration-200 animate-fade-in-up">
                                    {dayjs.utc(schedule.endTime).format('HH:mm')}
                                </td>
                                <td className="px-4 py-1 border group-hover:border-zinc-400 transition-colors duration-200 animate-fade-in-up">
                                    {renderActionButtons(schedule)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <BaseModal
                isOpen={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                title={selectedSchedule ? "Editar Horario" : "Crear Horario"}
                size="md"
            >
                <Form
                    form={form}
                    onFinish={selectedSchedule ? handleUpdate : handleCreate}
                    layout="vertical"
                >
                    <Form.Item
                        name="days"
                        label="Días"
                        rules={[{ required: true, message: 'Por favor seleccione los días' }]}
                    >
                        <Select mode="multiple" placeholder="Seleccione los días">
                            {DAYS.map(day => (
                                <Option key={day.value} value={day.value}>{day.label}</Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="timeRange"
                        label="Horario"
                        rules={[{ required: true, message: 'Por favor seleccione el horario' }]}
                    >
                        <TimePicker.RangePicker
                            format="HH:mm"
                            minuteStep={15}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            {selectedSchedule ? "Actualizar" : "Crear"}
                        </Button>
                    </Form.Item>
                </Form>
            </BaseModal>

            <BaseModal
                isOpen={isAssignModalVisible}
                onClose={() => {
                    setIsAssignModalVisible(false);
                    setIsRemoveUser(false);
                    setAssignedUsers([]);
                    setAvailableUsers([]);
                }}
                title={isRemoveUser ? "Quitar Usuarios" : "Asignar Usuarios"}
                size="md"
            >
                <Form
                    form={assignForm}
                    onFinish={isRemoveUser ? handleRemoveUser : handleAssignUser}
                    layout="vertical"
                >
                    <Form.Item
                        name="userIds"
                        label="Usuarios"
                        rules={[{ required: true, message: 'Por favor seleccione al menos un usuario' }]}
                    >
                        <Select
                            mode="multiple"
                            placeholder="Seleccione los usuarios"
                            loading={isLoading}
                            style={{ width: '100%' }}
                        >
                            {isRemoveUser
                                ? assignedUsers.map(user => (
                                    <Option key={user.userId} value={user.userId}>
                                        {user.user?.email ?? 'No disponible'}
                                    </Option>
                                ))
                                : availableUsers
                                    .filter(u => !assignedUsers.some(a => a.userId === u.userId))
                                    .map(user => (
                                        <Option key={user.userId} value={user.userId}>
                                            {user.user?.email ?? 'No disponible'}
                                        </Option>
                                    ))
                            }
                        </Select>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            {isRemoveUser ? "Quitar Usuarios" : "Asignar Usuarios"}
                        </Button>
                    </Form.Item>
                </Form>
            </BaseModal>

            <BaseModal
                isOpen={isDeleteModalVisible}
                onClose={() => {
                    setIsDeleteModalVisible(false);
                    setScheduleToDelete(null);
                }}
                title="Confirmar eliminación"
                size="sm"
            >
                <div className="flex flex-col items-center gap-4 py-4">
                    <ExclamationCircleOutlined className="text-4xl text-red-500" />
                    <div className="text-center">
                        <h3 className="text-lg font-semibold mb-2">¿Estás seguro de eliminar este horario?</h3>
                        <p className="text-gray-500 dark:text-gray-400">
                            Esta acción no se puede deshacer y eliminará permanentemente el horario seleccionado.
                        </p>
                    </div>
                    <div className="flex gap-3 mt-2">
                        <UIButton
                            variant="outline"
                            onClick={() => {
                                setIsDeleteModalVisible(false);
                                setScheduleToDelete(null);
                            }}
                        >
                            Cancelar
                        </UIButton>
                        <UIButton
                            variant="destructive"
                            onClick={confirmDelete}
                        >
                            Sí, eliminar
                        </UIButton>
                    </div>
                </div>
            </BaseModal>
        </div>
    );
}