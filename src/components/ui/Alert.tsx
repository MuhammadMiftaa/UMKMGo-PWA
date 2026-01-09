import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from "lucide-react";

export type AlertType = "success" | "error" | "warning" | "info";

interface AlertProps {
  isOpen: boolean;
  onClose: () => void;
  type: AlertType;
  title: string;
  message?: string;
  duration?: number; // auto close after duration (ms), 0 = no auto close
  showCloseButton?: boolean;
}

const alertConfig = {
  success: {
    icon: CheckCircle2,
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    titleColor: "text-green-800",
    messageColor: "text-green-700",
  },
  error: {
    icon: XCircle,
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
    titleColor: "text-red-800",
    messageColor: "text-red-700",
  },
  warning: {
    icon: AlertTriangle,
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    titleColor: "text-amber-800",
    messageColor: "text-amber-700",
  },
  info: {
    icon: Info,
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    titleColor: "text-blue-800",
    messageColor: "text-blue-700",
  },
};

export function Alert({
  isOpen,
  onClose,
  type,
  title,
  message,
  duration = 5000,
  showCloseButton = true,
}: AlertProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      if (duration > 0) {
        const timer = setTimeout(() => {
          setIsVisible(false);
          setTimeout(onClose, 300);
        }, duration);
        return () => clearTimeout(timer);
      }
    } else {
      setIsVisible(false);
    }
  }, [isOpen, duration, onClose]);

  if (!isOpen) return null;

  const config = alertConfig[type];
  const Icon = config.icon;

  return (
    <div className="fixed top-4 left-1/2 z-50 w-full max-w-md -translate-x-1/2 px-4">
      <div
        className={`transform transition-all duration-300 ease-out ${
          isVisible ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
        }`}
      >
        <div
          className={`rounded-2xl border ${config.borderColor} ${config.bgColor} p-4 shadow-lg`}
        >
          <div className="flex items-start gap-3">
            {/* Icon */}
            <div className={`rounded-full ${config.iconBg} p-2`}>
              <Icon size={20} className={config.iconColor} />
            </div>

            {/* Content */}
            <div className="flex-1">
              <h4 className={`font-semibold ${config.titleColor}`}>{title}</h4>
              {message && (
                <p className={`mt-1 text-sm ${config.messageColor}`}>
                  {message}
                </p>
              )}
            </div>

            {/* Close Button */}
            {showCloseButton && (
              <button
                onClick={() => {
                  setIsVisible(false);
                  setTimeout(onClose, 300);
                }}
                className="rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Toast-style alert that can be used with a hook
interface ToastAlertProps {
  id: string;
  type: AlertType;
  title: string;
  message?: string;
  onRemove: (id: string) => void;
}

export function ToastAlert({
  id,
  type,
  title,
  message,
  onRemove,
}: ToastAlertProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animate in
    setTimeout(() => setIsVisible(true), 10);

    // Auto remove after 5 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onRemove(id), 300);
    }, 5000);

    return () => clearTimeout(timer);
  }, [id, onRemove]);

  const config = alertConfig[type];
  const Icon = config.icon;

  return (
    <div
      className={`transform transition-all duration-300 ease-out ${
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`}
    >
      <div
        className={`rounded-2xl border ${config.borderColor} ${config.bgColor} p-4 shadow-lg`}
      >
        <div className="flex items-start gap-3">
          <div className={`rounded-full ${config.iconBg} p-2`}>
            <Icon size={20} className={config.iconColor} />
          </div>
          <div className="flex-1">
            <h4 className={`font-semibold ${config.titleColor}`}>{title}</h4>
            {message && (
              <p className={`mt-1 text-sm ${config.messageColor}`}>{message}</p>
            )}
          </div>
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(() => onRemove(id), 300);
            }}
            className="rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
