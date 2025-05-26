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
import { Button, Table, Modal, Form, Select, TimePicker, message } from 'antd';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { useOrganization } from "@/hooks/organizationContex";
import {
    EditOutlined,
    DeleteOutlined,
    UserAddOutlined
} from '@ant-design/icons';


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

    const columns = [
        {
            title: 'Días',
            dataIndex: 'days',
            key: 'days',
            render: (days: string[]) => days.join(', ')
        },
        {
            title: 'Hora de inicio',
            dataIndex: 'startTime',
            key: 'startTime',
            render: (time: string) => dayjs.utc(time).format('HH:mm')
        },
        {
            title: 'Hora de fin',
            dataIndex: 'endTime',
            key: 'endTime',
            render: (time: string) => dayjs.utc(time).format('HH:mm')
        },
        {
            title: 'Acciones',
            key: 'actions',
            render: (_: any, record: AttentionHour) => (
                <>
                    <Button
                        type="link"
                        icon={<EditOutlined style={{ fontSize: '30px' }} />}
                        onClick={() => {
                            setSelectedSchedule(record);
                            form.setFieldsValue({
                                days: record.days,
                                timeRange: [
                                    dayjs.utc(record.startTime),
                                    dayjs.utc(record.endTime)
                                ]
                            });
                            setIsModalVisible(true);
                        }}
                        style={{ marginRight: 8 }}
                    />

                    <Button
                        type="link"
                        danger
                        icon={<DeleteOutlined style={{ fontSize: '30px' }} />}
                        onClick={() => handleDelete(record.id)}
                        style={{ marginRight: 8 }}
                    />

                    <Button
                        type="link"
                        icon={<UserAddOutlined style={{ fontSize: '30px' }} />}
                        onClick={() => {
                            setSelectedSchedule(record);
                            setIsAssignModalVisible(true);
                        }}
                    />
                </>
            )
        }
    ];

    return (
        <div className="p-6">
            <div className="mb-4">
                <Button
                    type="primary"
                    onClick={() => {
                        setSelectedSchedule(null);
                        form.resetFields();
                        setIsModalVisible(true);
                    }}
                >
                    Agregar Horario
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={schedules}
                rowKey="id"
            />

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
                            {/* TODO: Cargar lista de usuarios disponibles */}
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