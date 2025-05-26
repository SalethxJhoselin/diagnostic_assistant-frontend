export default function Treatments() {
    return (
        <div className="w-full flex flex-col sm:px-20 px-4 py-10">
            <h1 className="text-2xl mb-4 font-semibold">Tratamientos</h1>
            <div className="w-full overflow-x-auto border rounded-md">
                <table className="min-w-full table-auto border-collapse">
                    <thead className="bg-secondary">
                        <tr>
                            <th className="text-left px-4 py-2 border-b">Descripción</th>
                            <th className="text-left px-4 py-2 border-b">Duración</th>
                            <th className="text-left px-4 py-2 border-b">Instrucción</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="px-4 py-2 border-b">Ejemplo de tratamiento</td>
                            <td className="px-4 py-2 border-b">7 días</td>
                            <td className="px-4 py-2 border-b">Tomar 2 veces al día</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2 border-b">Otro tratamiento</td>
                            <td className="px-4 py-2 border-b">14 días</td>
                            <td className="px-4 py-2 border-b">Aplicar cada 8 horas</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
