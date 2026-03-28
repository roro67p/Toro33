import { ReactNode } from 'react'

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: ReactNode
  iconBg?: string
  trend?: {
    value: number
    label: string
    positive?: boolean
  }
}

export function StatCard({ title, value, subtitle, icon, iconBg = 'bg-indigo-100', trend }: StatCardProps) {
  return (
    <div className="card flex items-start gap-4">
      <div className={`${iconBg} p-3 rounded-xl flex-shrink-0`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-0.5">{value}</p>
        {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
        {trend && (
          <div className={`flex items-center gap-1 mt-1.5 text-xs font-medium ${trend.positive ? 'text-emerald-600' : 'text-red-500'}`}>
            <span>{trend.positive ? '↑' : '↓'}</span>
            <span>{trend.value}% {trend.label}</span>
          </div>
        )}
      </div>
    </div>
  )
}
