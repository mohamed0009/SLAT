import * as React from "react"

const Chart = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => {
  return <div className="relative" ref={ref} {...props} />
})
Chart.displayName = "Chart"

const ChartContainer = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div className="overflow-hidden rounded-md border" ref={ref} {...props} />
  },
)
ChartContainer.displayName = "ChartContainer"

const ChartTooltip = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div className="rounded-md border bg-popover p-4 text-popover-foreground shadow-sm" ref={ref} {...props} />
  },
)
ChartTooltip.displayName = "ChartTooltip"

const ChartTooltipContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div className="flex flex-col space-y-1" ref={ref} {...props} />
  },
)
ChartTooltipContent.displayName = "ChartTooltipContent"

interface ChartTooltipItemProps extends React.HTMLAttributes<HTMLDivElement> {
  color?: string
  name?: string
  value?: string | number
}

const ChartTooltipItem = React.forwardRef<HTMLDivElement, ChartTooltipItemProps>(
  ({ className, color, name, value, ...props }, ref) => {
    return (
      <div className="flex items-center justify-between space-x-2" ref={ref} {...props}>
        <div className="flex items-center space-x-1">
          {color && <span className="block h-2 w-2 rounded-full" style={{ backgroundColor: color }} />}
          {name && <span className="text-sm font-medium">{name}</span>}
        </div>
        {value && <span className="text-sm">{value}</span>}
      </div>
    )
  },
)
ChartTooltipItem.displayName = "ChartTooltipItem"

export { Chart, ChartContainer, ChartTooltip, ChartTooltipContent, ChartTooltipItem }
