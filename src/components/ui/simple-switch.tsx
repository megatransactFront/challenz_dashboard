//src/components/ui/simple-switch.tsx
import React from "react";

interface SimpleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function SimpleSwitch({ checked, onChange }: SimpleSwitchProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`w-12 h-7 rounded-full p-1 flex items-center transition-colors duration-200 ${
        checked ? "bg-green-500" : "bg-gray-300"
      }`}
      aria-pressed={checked}
    >
      <span
        className={`h-5 w-5 bg-white rounded-full shadow transform transition-transform duration-200 ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}
