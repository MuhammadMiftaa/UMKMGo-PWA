import { useNavigate, useLocation } from 'react-router-dom'
import { Home, Activity, Bell, User } from 'lucide-react'

interface BottomNavigationProps {
  unreadCount?: number
}

export default function BottomNavigation({ unreadCount = 0 }: BottomNavigationProps) {
  const navigate = useNavigate()
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  const items = [
    { icon: Home, label: 'Beranda', path: '/dashboard' },
    { icon: Activity, label: 'Aktivitas', path: '/activity' },
    { icon: Bell, label: 'Notifikasi', path: '/notifications', badge: unreadCount },
    { icon: User, label: 'Profile', path: '/profile' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-border z-50 max-w-md mx-auto">
      <div className="flex justify-around py-2">
        {items.map((item, idx) => (
          <button
            key={idx}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center py-3 px-4 transition-colors relative ${
              isActive(item.path)
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <item.icon size={24} />
            <span className="text-xs mt-1 font-semibold">{item.label}</span>
            {item.badge && item.badge > 0 && (
              <div className="absolute top-0 right-2 bg-destructive text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {item.badge}
              </div>
            )}
          </button>
        ))}
      </div>
    </nav>
  )
}
