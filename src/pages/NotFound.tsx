
export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-background/80">
            <div className="text-center space-y-4">
                <h1 className="text-6xl font-bold text-primary">404</h1>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Página no encontrada</h2>
                <p className="text-gray-600 dark:text-gray-400">Lo sentimos, la página que buscas no existe.</p>
                <button 
                    onClick={() => window.history.back()}
                    className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                    Volver atrás
                </button>
            </div>
        </div>
    );
}