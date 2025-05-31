import ChatBot from "@/pages/ChatBot";

interface AssistanceProps {
  onClose: () => void;
}

export default function AssistanceModal({ onClose }: AssistanceProps) {
  return (
    <div
      className="flex items-center justify-center fixed inset-0 z-50 bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-background rounded-lg shadow-xl w-full max-w-2xl mx-4 sm:mx-0"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <ChatBot/>
      </div>
    </div>
  );
}
