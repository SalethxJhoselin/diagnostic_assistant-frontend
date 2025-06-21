import React, { useState, useEffect } from "react";
import { Button } from "./button";

interface SelectMultipleModalProps {
  isOpen: boolean;
  onClose: () => void;
  options: string[];
  selected: string[];
  onChange: (values: string[]) => void;
  title: string;
}

export default function SelectMultipleModal({
  isOpen,
  onClose,
  options,
  selected,
  onChange,
  title
}: SelectMultipleModalProps) {
  const [localSelected, setLocalSelected] = useState<string[]>([]);

  useEffect(() => {
    setLocalSelected(selected);
  }, [isOpen, selected, options]);

  const handleCheck = (opt: string) => {
    setLocalSelected(
      localSelected.includes(opt)
        ? localSelected.filter(s => s !== opt)
        : [...localSelected, opt]
    );
  };

  const handleSave = () => {
    onChange(localSelected);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Fondo semitransparente sin blur */}
      <div
        className="fixed inset-0 bg-black/30 transition-opacity"
        onClick={onClose}
      />
      {/* Panel flotante */}
      <div className="relative bg-white dark:bg-zinc-900 rounded-lg shadow-xl w-full max-w-md mx-auto p-6 z-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          <button
            className="text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 text-xl font-bold"
            onClick={onClose}
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto">
          <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))' }}>
            {options.map(opt => (
              <label key={opt} className="flex items-center gap-2 whitespace-normal">
                <input
                  type="checkbox"
                  checked={localSelected.includes(opt)}
                  onChange={() => handleCheck(opt)}
                />
                {opt}
              </label>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSave}>Guardar</Button>
        </div>
      </div>
    </div>
  );
} 