interface BadgeProps {
  label: string
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'default' | 'purple' | 'gold' | 'silver' | 'bronze' | 'platinum'
  size?: 'sm' | 'md'
}

const variantClasses: Record<string, string> = {
  success: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
  warning: 'bg-amber-100 text-amber-700 border border-amber-200',
  danger: 'bg-red-100 text-red-700 border border-red-200',
  info: 'bg-blue-100 text-blue-700 border border-blue-200',
  default: 'bg-gray-100 text-gray-700 border border-gray-200',
  purple: 'bg-purple-100 text-purple-700 border border-purple-200',
  gold: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
  silver: 'bg-slate-100 text-slate-600 border border-slate-200',
  bronze: 'bg-orange-100 text-orange-700 border border-orange-200',
  platinum: 'bg-indigo-100 text-indigo-700 border border-indigo-200',
}

export function Badge({ label, variant = 'default', size = 'sm' }: BadgeProps) {
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-2.5 py-1'
  return (
    <span className={`inline-flex items-center rounded-full font-medium ${sizeClass} ${variantClasses[variant]}`}>
      {label}
    </span>
  )
}

// Utility functions for status badges
export function getOrderStatusVariant(status: string): BadgeProps['variant'] {
  switch (status) {
    case 'en attente': return 'warning'
    case 'en préparation': return 'info'
    case 'servie': return 'success'
    case 'payée': return 'default'
    default: return 'default'
  }
}

export function getTableStatusVariant(status: string): BadgeProps['variant'] {
  switch (status) {
    case 'libre': return 'success'
    case 'occupée': return 'danger'
    case 'réservée': return 'warning'
    default: return 'default'
  }
}

export function getReservationStatusVariant(status: string): BadgeProps['variant'] {
  switch (status) {
    case 'confirmée': return 'success'
    case 'en attente': return 'warning'
    case 'annulée': return 'danger'
    case 'arrivée': return 'info'
    default: return 'default'
  }
}

export function getClientTierVariant(tier: string): BadgeProps['variant'] {
  switch (tier) {
    case 'Bronze': return 'bronze'
    case 'Argent': return 'silver'
    case 'Or': return 'gold'
    case 'Platine': return 'platinum'
    default: return 'default'
  }
}

export function getEmployeeStatusVariant(status: string): BadgeProps['variant'] {
  switch (status) {
    case 'actif': return 'success'
    case 'congé': return 'warning'
    case 'absent': return 'danger'
    default: return 'default'
  }
}

export function getInvoiceStatusVariant(status: string): BadgeProps['variant'] {
  switch (status) {
    case 'payée': return 'success'
    case 'en attente': return 'warning'
    case 'annulée': return 'danger'
    default: return 'default'
  }
}

export function getSupplierStatusVariant(status: string): BadgeProps['variant'] {
  switch (status) {
    case 'actif': return 'success'
    case 'inactif': return 'danger'
    default: return 'default'
  }
}
