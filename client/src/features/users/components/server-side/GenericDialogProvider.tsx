import React, { useState } from "react"
import useDialogState from "@/hooks/use-dialog-state"

type DialogType = "invite" | "add" | "edit" | "delete"

export interface GenericDialogContextType<T = unknown> {
    open: DialogType | null
    setOpen: (str: DialogType | null) => void
    currentRow: T | null
    setCurrentRow: React.Dispatch<React.SetStateAction<T | null>>
}

const GenericDialogContext = React.createContext<GenericDialogContextType | null>(
    null
)

interface Props {
    children: React.ReactNode
}

export function GenericDialogProvider<T = unknown>({ children }: Props) {
    const [open, setOpen] = useDialogState<DialogType>(null)
    const [currentRow, setCurrentRow] = useState<T | null>(null)

    return (
        <GenericDialogContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
            {children}
        </GenericDialogContext.Provider>
    )
}

export function useGenericDialog<T = any>() {
    const context = React.useContext(GenericDialogContext)
    if (!context) throw new Error("useGenericDialog must be used within <GenericDialogProvider>")
    return context as GenericDialogContextType<T>
}
