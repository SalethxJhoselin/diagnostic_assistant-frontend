import { useState, useEffect } from 'react';
import {
    fetchOrganizationAttentionHours,
    fetchCreateAttentionHour,
    fetchUpdateAttentionHour,
    fetchDeleteAttentionHour,
    fetchAssignUserToHour,
    fetchRemoveUserFromHour,
    type AttentionHour,
    type CreateAttentionHour
} from '../../services/attentionHours';
import { Button as UIButton } from "@/components/ui/button";
import { Button } from "antd";
import { useOrganization } from "@/hooks/organizationContex";
import { EditOutlined, DeleteOutlined, UserAddOutlined } from '@ant-design/icons';
import { Modal, Form, Select, TimePicker, message } from 'antd';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { toast } from "sonner";

dayjs.extend(utc);
dayjs.extend(timezone);

const { Option } = Select;

export default function Schedules() {
    const [schedules, setSchedules] = useState<AttentionHour[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isAssignModalVisible, setIsAssignModalVisible] = useState(false);
    const [selectedSchedule, setSelectedSchedule] = useState<AttentionHour | null>(null);
    const [form] = Form.useForm();
    const [assignForm] = Form.useForm();
    const { organization } = useOrganization();

    if (!organization?.id) {
        return message.error('No se encontró la organización');
    }


    const days = [
        { label: 'Lunes', value: 'lunes' },
        { label: 'Martes', value: 'martes' },
        { label: 'Miércoles', value: 'miercoles' },
        { label: 'Jueves', value: 'jueves' },
        { label: 'Viernes', value: 'viernes' },
        { label: 'Sábado', value: 'sabado' },
        { label: 'Domingo', value: 'domingo' },
    ];

    useEffect(() => {
        loadSchedules();
    }, []);

    const loadSchedules = async () => {
        try {

            const data = await fetchOrganizationAttentionHours(organization.id);
            setSchedules(data);
            console.log(data);
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
            return message.error('Error al crear el horario');
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
        try {
            console.log("id " + id)
            await fetchDeleteAttentionHour(id);
            message.success('Horario eliminado exitosamente');
            loadSchedules();
        } catch (error) {
            message.error('Error al eliminar el horario');
        }
    };

    const handleAssignUser = async (values: any) => {
        if (!selectedSchedule) return;

        try {
            await fetchAssignUserToHour({
                userId: values.userId,
                attentionHourId: selectedSchedule.id
            });
            message.success('Usuario asignado exitosamente');
            setIsAssignModalVisible(false);
            assignForm.resetFields();
            loadSchedules();
        } catch (error) {
            message.error('Error al asignar el usuario');
        }
    };

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
                                            onClick={() => {
                                                setSelectedSchedule(schedule);
                                                setIsAssignModalVisible(true);
                                            }}
                                        >
                                            <UserAddOutlined />
                                        </UIButton>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal
                title={selectedSchedule ? "Editar Horario" : "Crear Horario"}
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
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
                            {days.map(day => (
                                <Option key={day.value} value={day.value}>{day.label}</Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="timeRange"
                        label="Horario"
                        rules={[{ required: true, message: 'Por favor seleccione el horario' }]}
                    >
                        <TimePicker.RangePicker format="HH:mm" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            {selectedSchedule ? "Actualizar" : "Crear"}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="Asignar Usuario"
                open={isAssignModalVisible}
                onCancel={() => setIsAssignModalVisible(false)}
                footer={null}
            >
                <Form
                    form={assignForm}
                    onFinish={handleAssignUser}
                    layout="vertical"
                >
                    <Form.Item
                        name="userId"
                        label="Usuario"
                        rules={[{ required: true, message: 'Por favor seleccione un usuario' }]}
                    >
                        <Select placeholder="Seleccione un usuario">
                            <Option value="user1">Usuario 1</Option>
                            <Option value="user2">Usuario 2</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Asignar
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}