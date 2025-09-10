

import { useEffect } from "react";

type Props = {
    message: string;
    type?: "success" | "error";
    onClose: () => void;
    duration?: number; // in ms
};

export default function Notification({
    message,
    type = "success",
    onClose,
    duration = 3000,
}: Props) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    return (
        <div
            className={`
        fixed top-4 left-1/2 transform -translate-x-1/2 z-50
        px-4 py-2 rounded shadow-lg transition-all duration-300
        ${type === "success" ? "bg-green-500" : "bg-red-500"} text-white
      `}
        >
            {message}
        </div>
    );
}
