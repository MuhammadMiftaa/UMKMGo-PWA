import { useNavigate, useLocation } from "react-router-dom";
import { Home, Activity, Bell, User } from "lucide-react";
import { useNotification } from "../contexts/NotificationContext";

interface BottomNavigationProps {
  notificationCount?: number;
}

export default function BottomNavigation({
  notificationCount,
}: BottomNavigationProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { unreadCount } = useNotification();

  // Use prop if provided, otherwise use context
  const badgeCount = notificationCount ?? unreadCount;

  const isActive = (path: string) => location.pathname === path;

  const items = [
    { icon: Home, label: "Beranda", path: "/dashboard" },
    { icon: Activity, label: "Aktivitas", path: "/activity" },
    {
      icon: Bell,
      label: "Notifikasi",
      path: "/notifications",
      badge: badgeCount,
    },
    { icon: User, label: "Profile", path: "/profile" },
  ];

  return (
    <nav className="border-border fixed right-0 bottom-0 left-0 z-50 mx-auto max-w-md border-t bg-white">
      <div className="flex justify-around py-2">
        {items.map((item, idx) => (
          <button
            key={idx}
            onClick={() => navigate(item.path)}
            className={`relative flex flex-col items-center px-4 py-3 transition-colors ${
              isActive(item.path)
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <item.icon size={24} />
            <span className="mt-1 text-xs font-semibold">{item.label}</span>
            {item.badge !== undefined && item.badge > 0 && (
              <div className="bg-destructive absolute top-0 right-2 flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold text-white">
                {item.badge > 99 ? "99+" : item.badge}
              </div>
            )}
          </button>
        ))}
      </div>
    </nav>
  );
}
