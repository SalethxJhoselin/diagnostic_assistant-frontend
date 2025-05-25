export default function Loader() {
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="flex flex-col items-center gap-4">
                <span className="loader"></span>
                <span className="text-gray-700 dark:text-gray-300 text-sm">Cargando sesión...</span>
            </div>
        </div>
    )
}