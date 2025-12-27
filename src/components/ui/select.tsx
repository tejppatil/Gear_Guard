"use client"

import * as React from "react"
import { Check, ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"

// Simple Context Mock for Select
const SelectContext = React.createContext<{
    value: string
    onValueChange: (value: string) => void
    open: boolean
    setOpen: (open: boolean) => void
}>({
    value: "",
    onValueChange: () => { },
    open: false,
    setOpen: () => { },
})

const Select = ({ children, value, onValueChange, defaultValue }: any) => {
    const [val, setVal] = React.useState(value || defaultValue || "")
    const [open, setOpen] = React.useState(false)

    // Sync controlled state
    React.useEffect(() => {
        if (value !== undefined) setVal(value)
    }, [value])

    const handleValueChange = (newValue: string) => {
        setVal(newValue)
        if (onValueChange) onValueChange(newValue)
        setOpen(false)
    }

    return (
        <SelectContext.Provider value={{ value: val, onValueChange: handleValueChange, open, setOpen }}>
            <div className="relative">{children}</div>
        </SelectContext.Provider>
    )
}

const SelectTrigger = React.forwardRef<HTMLButtonElement, any>(
    ({ className, children, ...props }, ref) => {
        const { open, setOpen } = React.useContext(SelectContext)
        return (
            <button
                ref={ref}
                type="button"
                onClick={() => setOpen(!open)}
                className={cn(
                    "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                    className
                )}
                {...props}
            >
                {children}
                <ChevronDown className="h-4 w-4 opacity-50" />
            </button>
        )
    }
)
SelectTrigger.displayName = "SelectTrigger"

const SelectValue = React.forwardRef<HTMLSpanElement, any>(
    ({ className, placeholder, ...props }, ref) => {
        const { value } = React.useContext(SelectContext)
        // We can't easily map value to label without children inspection in this simple mock, 
        // but for now we'll display value if present, or placeholder.
        // In a real app we'd need a map. For this demo, let's assume value ~ label or we need a trick.
        // TRICK: We will let the SelectContent render pass the labels back up? No.
        // Simple fallback: Just render value. 
        return (
            <span ref={ref} className={cn("block truncate", className)} {...props}>
                {value || placeholder}
            </span>
        )
    }
)
SelectValue.displayName = "SelectValue"

const SelectContent = React.forwardRef<HTMLDivElement, any>(
    ({ className, children, position = "popper", ...props }, ref) => {
        const { open } = React.useContext(SelectContext)
        if (!open) return null
        return (
            <div
                ref={ref}
                className={cn(
                    "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-80 mt-1 w-full",
                    className
                )}
                {...props}
            >
                <div className="p-1">{children}</div>
            </div>
        )
    }
)
SelectContent.displayName = "SelectContent"

const SelectItem = React.forwardRef<HTMLDivElement, any>(
    ({ className, children, value, ...props }, ref) => {
        const { value: selectedValue, onValueChange } = React.useContext(SelectContext)
        const isSelected = selectedValue === value
        return (
            <div
                ref={ref}
                onClick={(e) => {
                    e.stopPropagation()
                    onValueChange(value)
                }}
                className={cn(
                    "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                    className
                )}
                {...props}
            >
                {isSelected && (
                    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                        <Check className="h-4 w-4" />
                    </span>
                )}
                <span className="truncate">{children}</span>
            </div>
        )
    }
)
SelectItem.displayName = "SelectItem"

// Stubs for others
const SelectGroup = ({ children }: any) => <>{children}</>
const SelectLabel = ({ children }: any) => <div className="py-1.5 pl-8 pr-2 text-sm font-semibold">{children}</div>
const SelectSeparator = () => <div className="-mx-1 my-1 h-px bg-muted" />

export {
    Select,
    SelectGroup,
    SelectValue,
    SelectTrigger,
    SelectContent,
    SelectLabel,
    SelectItem,
    SelectSeparator,
}
