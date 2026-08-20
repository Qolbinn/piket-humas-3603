import { LucideIcon } from 'lucide-react'

interface PageHeaderProps {
  title: string
  description: string
  breadcrumbText: string
  breadcrumbIcon: LucideIcon
  action?: React.ReactNode
}

export default function PageHeader({ 
  title, 
  description, 
  breadcrumbText, 
  breadcrumbIcon: Icon,
  action 
}: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <Icon className="h-4 w-4" />
          <span>{breadcrumbText}</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">{title}</h1>
        <p className="text-muted-foreground">
          {description}
        </p>
      </div>
      {action && (
        <div className="shrink-0">
          {action}
        </div>
      )}
    </div>
  )
}
