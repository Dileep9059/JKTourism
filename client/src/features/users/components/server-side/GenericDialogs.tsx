import { useGenericDialog } from "./GenericDialogProvider";

interface GenericDialogsProps<T> {
    entityName: string
    ActionDialog: React.ComponentType<{ open: boolean; onOpenChange: (state: boolean) => void; currentRow?: T }>
    InviteDialog?: React.ComponentType<{ open: boolean; onOpenChange: (state: boolean) => void }>
    DeleteDialog?: React.ComponentType<{ open: boolean; onOpenChange: (state: boolean) => void; currentRow: T }>
}

export function GenericDialogs<T extends { id: string | number }>({
    entityName,
    ActionDialog,
    InviteDialog,
    DeleteDialog,
}: GenericDialogsProps<T>) {
    const { open, setOpen, currentRow, setCurrentRow } = useGenericDialog<T>()

    return (
        <>
            {/* Add */}
            <ActionDialog
                key={`${entityName}-add`}
                open={open === "add"}
                onOpenChange={(state) => setOpen(state ? "add" : null)}
            />

            {/* Invite (optional) */}
            {InviteDialog && (
                <InviteDialog
                    key={`${entityName}-invite`}
                    open={open === "invite"}
                    onOpenChange={(state) => setOpen(state ? "invite" : null)}
                />
            )}

            {/* Edit & Delete */}
            {currentRow && (
                <>
                    <ActionDialog
                        key={`${entityName}-edit-${currentRow.id}`}
                        open={open === "edit"}
                        onOpenChange={(state) => {
                            setOpen(state ? "edit" : null)
                            if (!state) setTimeout(() => setCurrentRow(null), 500)
                        }}
                        currentRow={currentRow}
                    />

                    {DeleteDialog && (
                        <DeleteDialog
                            key={`${entityName}-delete-${currentRow.id}`}
                            open={open === "delete"}
                            onOpenChange={(state) => {
                                setOpen(state ? "delete" : null)
                                if (!state) setTimeout(() => setCurrentRow(null), 500)
                            }}
                            currentRow={currentRow}
                        />
                    )}
                </>
            )}
        </>
    )
}
