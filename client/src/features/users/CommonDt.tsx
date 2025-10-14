import { Main } from '@/components/layout/main'
import { IconMailPlus, IconUserPlus } from "@tabler/icons-react";
import { useGenericDialog } from "./components/server-side/GenericDialogProvider";
import { GenericPrimaryButtons } from "./components/server-side/GenericPrimaryButtons";
import { ServerSideDataTable } from "./components/server-side/server-side-data-table";
import { fetchUsersFromServer } from "./components/server-side/get-data-from-server";
import { GenericDialogs } from "./components/server-side/GenericDialogs";
import { UsersActionDialog } from "./components/users-action-dialog";
import { UsersInviteDialog } from "./components/users-invite-dialog";
import { UsersDeleteDialog } from "./components/users-delete-dialog";

export default function CommonDt() {

    // Access the dialog context
    const { setOpen } = useGenericDialog<unknown>()

    // Dynamic button configuration
    const buttons = [
        // { label: "Invite User", icon: <IconMailPlus size={18} />, variant: "outline", action: "invite" },
        { label: "Add User", icon: <IconUserPlus size={18} />, variant: "default", action: "add" },
    ]

    return (
        <>
            <Main>
                <div className='mb-2 flex flex-wrap items-center justify-between space-y-2'>
                    <div>
                        <h2 className='text-2xl font-bold tracking-tight'>User List</h2>
                        <p className='text-muted-foreground'>
                            Manage your users and their roles here.
                        </p>
                    </div>
                    {/* ✅ Dynamic Generic Buttons */}
                    <GenericPrimaryButtons
                        buttons={buttons}
                        onAction={(action) => setOpen(action)}
                    />
                </div>
                <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
                    <ServerSideDataTable fetchData={fetchUsersFromServer} />
                </div>
            </Main>
            <GenericDialogs
                entityName="user"
                ActionDialog={UsersActionDialog}
                InviteDialog={UsersInviteDialog}
                DeleteDialog={UsersDeleteDialog}
            />

        </>
    )
}
