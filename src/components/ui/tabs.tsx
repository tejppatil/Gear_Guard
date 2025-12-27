"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const TabsContext = React.createContext<{
    value: string
    onValueChange: (value: string) => void
}>({
    value: "",
    onValueChange: () => { },
})

const Tabs = React.forwardRef<HTMLDivElement, any>(
    ({ className, value, onValueChange, defaultValue, children, ...props }, ref) => {
        const [val, setVal] = React.useState(value || defaultValue || "")

        React.useEffect(() => {
            if (value !== undefined) setVal(value)
        }, [value])

        const handleValueChange = (v: string) => {
            setVal(v)
            if (onValueChange) onValueChange(v)
        }

        return (
            <TabsContext.Provider value={{ value: val, onValueChange: handleValueChange }}>
                <div ref={ref} className={cn("", className)} {...props}>
                    {children}
                </div>
            </TabsContext.Provider>
        )
    })
Tabs.displayName = "Tabs"

const TabsList = React.forwardRef<HTMLDivElement, any>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(
                "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
                className
            )}
            {...props}
        />
    )
)
TabsList.displayName = "TabsList"

const TabsTrigger = React.forwardRef<HTMLButtonElement, any>(
    ({ className, value, ...props }, ref) => {
        const { value: selectedValue, onValueChange } = React.useContext(TabsContext)
        const isSelected = selectedValue === value

        return (
            <button
                ref={ref}
                type="button"
                onClick={() => onValueChange(value)}
                className={cn(
                    "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                    isSelected && "bg-background text-foreground shadow-sm",
                    className
                )}
                {...props}
            />
        )
    }
)
TabsTrigger.displayName = "TabsTrigger"

const TabsContent = React.forwardRef<HTMLDivElement, any>(
    ({ className, value, children, ...props }, ref) => {
        const { value: selectedValue } = React.useContext(TabsContext)
        if (selectedValue !== value) return null

        return (
            <div
                ref={ref}
                className={cn(
                    "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    className
                )}
                {...props}
            >
                {children}
            </div>
        )
    }
)
TabsContent.displayName = "TabsContent"

export { Tabs, TabsList, TabsTrigger, TabsContent }
