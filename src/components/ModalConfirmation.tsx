import { Button } from "./ui/button";

interface ModalConfirmationProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
}

export default function ModalConfirmation({
    isOpen,
    onClose,
    onConfirm,
    title = "¿Estás seguro?",
    message = "Esta acción no se puede deshacer.",
    confirmText = "Confirmar",
    cancelText = "Cancelar",
}: ModalConfirmationProps) {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
            onClick={onClose}
        >
            <div
                className="bg-white dark:bg-secondary rounded-lg shadow-xl w-full max-w-md mx-4 sm:mx-0"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
            >
                <div className="px-6 py-4 border-b">
                    <h2 id="modal-title" className="text-lg font-semibold">{title}</h2>
                </div>
                <div className="px-6 py-4">
                    <p className="text-sm text-gray-600 dark:text-gray-300">{message}</p>
                </div>
                <div className="flex justify-end gap-3 px-6 py-4 border-t">
                    <Button
                        variant="outline"
                        className="text-sm"
                        onClick={onClose}
                    >
                        {cancelText}
                    </Button>
                    <Button
                        className="text-sm"
                        onClick={onConfirm}
                    >
                        {confirmText}
                    </Button>
                </div>
            </div>
        </div>
    );
}
