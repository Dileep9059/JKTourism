import {
    EditIcon,
    FileIcon,
    FolderIcon,
    SearchIcon,
    TrashIcon,
    UploadIcon,
    FileTextIcon,
    FolderPlusIcon,
    GridIcon,
    ListIcon,
    InfoIcon,
    MoreVertical,
    FilterIcon,
    CalendarIcon,
} from 'lucide-react'
import React, { useState } from 'react'

import { Input } from '../ui/input'
import { Tooltip } from '../ui/tooltip'
import { Button } from '../ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from '../ui/dialog'
import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group' // assuming shadcn toggle group
import { IconFileTypeDocx, IconFileTypePdf } from '@tabler/icons-react'
import { InnerHeader } from '../layout/structure/InnerHeader'
import { Main } from '../layout/main'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '../ui/breadcrumb'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Calendar } from '../ui/calendar'

interface File {
    dateModified: string
    name: string
    type: 'folder' | 'file'
    path: string
    content?: File[]
    previewUrl?: string
}

const rootFiles: File[] = [
    {
        name: 'Documents',
        type: 'folder',
        path: '/documents',
        content: [
            {
                name: 'resume.pdf', type: 'file', path: '/documents/resume.pdf', dateModified: '2025-05-01'
            },
            {
                name: 'work_report.docx', type: 'file', path: '/documents/work_report.docx', dateModified: '2025-06-15'
            },
            {
                name: 'presentation.pptx', type: 'file', path: '/documents/presentation.pptx', dateModified: '2025-07-20'
            },
            {
                name: 'invoice.xlsx', type: 'file', path: '/documents/invoice.xlsx', dateModified: '2025-08-10'
            },
        ],
        dateModified: '2025'
    },
    {
        name: 'Images',
        type: 'folder',
        path: '/images',
        content: [
            {
                name: 'vacation.jpg',
                type: 'file',
                path: '/images/vacation.jpg',
                previewUrl: '/images/vacation.jpg',
                dateModified: '2025-03-21'
            },
            {
                name: 'profile.png',
                type: 'file',
                path: '/images/profile.png',
                previewUrl: '/images/profile.png',
                dateModified: '2025-02-10'
            },
            {
                name: 'logo.svg',
                type: 'file',
                path: '/images/logo.svg',
                previewUrl: '/images/logo.svg',
                dateModified: '2025-04-12'
            },
            {
                name: 'family_photo.png',
                type: 'file',
                path: '/images/family_photo.png',
                previewUrl: '/images/family_photo.png',
                dateModified: '2025-01-28'
            },
        ],
        dateModified: '2025'
    },
    {
        name: 'Videos',
        type: 'folder',
        path: '/videos',
        content: [
            {
                name: 'birthday.mp4',
                type: 'file',
                path: '/videos/birthday.mp4',
                previewUrl: '/videos/birthday.mp4',
                dateModified: '2025-02-22'
            },
            {
                name: 'workshop.mov',
                type: 'file',
                path: '/videos/workshop.mov',
                previewUrl: '/videos/workshop.mov',
                dateModified: '2025-05-10'
            },
            {
                name: 'conference.mp4',
                type: 'file',
                path: '/videos/conference.mp4',
                previewUrl: '/videos/conference.mp4',
                dateModified: '2025-06-05'
            },
        ],
        dateModified: '2025'
    },
    {
        name: 'Music',
        type: 'folder',
        path: '/music',
        content: [
            {
                name: 'song1.mp3',
                type: 'file',
                path: '/music/song1.mp3',
                previewUrl: '/music/song1.mp3',
                dateModified: '2025-01-15'
            },
            {
                name: 'song2.mp3',
                type: 'file',
                path: '/music/song2.mp3',
                previewUrl: '/music/song2.mp3',
                dateModified: '2025-03-01'
            },
            {
                name: 'album.zip',
                type: 'file',
                path: '/music/album.zip',
                dateModified: '2025-04-05'
            },
        ],
        dateModified: '2025'
    },
    {
        name: 'Projects',
        type: 'folder',
        path: '/projects',
        content: [
            {
                name: 'web_app',
                type: 'folder',
                path: '/projects/web_app',
                content: [
                    {
                        name: 'index.html',
                        type: 'file',
                        path: '/projects/web_app/index.html',
                        dateModified: '2025-06-01'
                    },
                    {
                        name: 'style.css',
                        type: 'file',
                        path: '/projects/web_app/style.css',
                        dateModified: '2025-06-02'
                    },
                    {
                        name: 'app.js',
                        type: 'file',
                        path: '/projects/web_app/app.js',
                        dateModified: '2025-06-03'
                    },
                ],
                dateModified: '2025'
            },
            {
                name: 'mobile_app',
                type: 'folder',
                path: '/projects/mobile_app',
                content: [
                    {
                        name: 'main_activity.xml',
                        type: 'file',
                        path: '/projects/mobile_app/main_activity.xml',
                        dateModified: '2025-07-10'
                    },
                    {
                        name: 'app_code.java',
                        type: 'file',
                        path: '/projects/mobile_app/app_code.java',
                        dateModified: '2025-07-12'
                    },
                ],
                dateModified: '2025'
            },
        ],
        dateModified: '2025'
    }
];


const getFileIcon = (file: File) => {
    if (file.type === 'folder') {
        return <FolderIcon className="w-6 h-6 text-yellow-500" />
    }
    // Show image preview if image and previewUrl available
    if (file.previewUrl && /\.(jpg|jpeg|png|gif|webp)$/i.test(file.name)) {
        return (
            <img
                src={file.previewUrl}
                alt={file.name}
                className="w-6 h-6 object-cover rounded-sm"
                loading="lazy"
            />
        )
    }

    // Map extensions to icons
    const ext = file.name.split('.').pop()?.toLowerCase()
    switch (ext) {
        case 'pdf':
            return <IconFileTypePdf className="w-6 h-6 text-red-600" />
        case 'doc':
        case 'docx':
            return <IconFileTypeDocx className="w-6 h-6 text-blue-700" />
        case 'txt':
            return <FileTextIcon className="w-6 h-6 text-gray-500" />
        default:
            return <FileIcon className="w-6 h-6 text-gray-400 dark:text-gray-300" />
    }
}

const FileManager: React.FC = () => {
    const [pathStack, setPathStack] = useState<File[]>([])
    const [selectedFiles, setSelectedFiles] = useState<string[]>([])
    const [search, setSearch] = useState('')
    const [dialogType, setDialogType] = useState<'delete' | 'rename' | 'upload' | 'folderCreate' | null>(null)
    const [selectedFileForDialog, setSelectedFileForDialog] = useState<File | null>(null)
    const [fileUpload, setFileUpload] = useState<File | null>(null)
    const [renameInput, setRenameInput] = useState('')
    const [showDialog, setShowDialog] = useState(false)
    const [newFolderName, setNewFolderName] = useState('')

    // new states
    const [viewMode, setViewMode] = useState<"list" | "icon" | "detail">("list");
    const [yearFilter, setYearFilter] = useState("all");
    const [sortBy, setSortBy] = useState("name");
    const [date, setDate] = useState<Date | undefined>(new Date());


    const currentFiles = pathStack.length === 0
        ? rootFiles
        : pathStack[pathStack.length - 1].content || []

    const currentPath = pathStack.map(folder => folder.name).join('/') || '/'

    // Helpers to update files in pathStack immutably

    // Because rootFiles is const, we need to manage it via state
    const [rootFilesState, setRootFiles] = useState<File[]>(rootFiles)
    const filesToUse = pathStack.length === 0 ? rootFilesState : currentFiles


    const navigateToFolder = (folder: File) => {
        setPathStack(prev => [...prev, folder])
        setSelectedFiles([])
        setSearch('')
    }

    const goToPathIndex = (index: number) => {
        setPathStack(prev => prev.slice(0, index + 1))
        setSelectedFiles([])
        setSearch('')
    }

    const goHome = () => {
        setPathStack([])
        setSelectedFiles([])
        setSearch('')
    }

    const filteredFiles = currentFiles.filter((file) => {
        const matchesSearch = file.name
            .toLowerCase()
            .includes(search.toLowerCase());
        const matchesYear =
            yearFilter === "all" ||
            (file.dateModified &&
                new Date(file.dateModified).getFullYear().toString() === yearFilter);
        return matchesSearch && matchesYear;
    });

    const sortedFiles = [...filteredFiles].sort((a, b) => {
        if (sortBy === "name") return a.name.localeCompare(b.name);
        if (sortBy === "type") return a.type.localeCompare(b.type);
        if (sortBy === "date")
            return (
                new Date(b.dateModified || 0).getTime() -
                new Date(a.dateModified || 0).getTime()
            );
        return 0;
    });

    const handleDelete = (filePath: string) => {
        const updatedFiles = filesToUse.filter(file => file.path !== filePath)
        if (pathStack.length > 0) {
            const parent = { ...pathStack[pathStack.length - 1], content: updatedFiles }
            setPathStack([...pathStack.slice(0, -1), parent])
        } else {
            setRootFiles(updatedFiles)
        }
        setSelectedFiles(prev => prev.filter(p => p !== filePath))
    }

    const handleRename = (filePath: string, newName: string) => {
        const updatedFiles = filesToUse.map(file =>
            file.path === filePath ? { ...file, name: newName } : file
        )
        if (pathStack.length > 0) {
            const parent = { ...pathStack[pathStack.length - 1], content: updatedFiles }
            setPathStack([...pathStack.slice(0, -1), parent])
        } else {
            setRootFiles(updatedFiles)
        }
    }

    const handleFileUpload = () => {
        if (!fileUpload) return
        const newFile: File = {
            name: fileUpload.name,
            path: `${currentPath === '/' ? '' : currentPath}/${fileUpload.name}`,
            type: 'file',
            dateModified: ''
        }
        const updatedFiles = [...filesToUse, newFile]
        if (pathStack.length > 0) {
            const parent = { ...pathStack[pathStack.length - 1], content: updatedFiles }
            setPathStack([...pathStack.slice(0, -1), parent])
        } else {
            setRootFiles(updatedFiles)
        }
        setFileUpload(null)
    }

    const handleFolderCreate = () => {
        if (!newFolderName.trim()) return
        const folderPath = `${currentPath === '/' ? '' : currentPath}/${newFolderName}`
        const newFolder: File = {
            name: newFolderName,
            type: 'folder',
            path: folderPath,
            content: [],
            dateModified: ''
        }
        const updatedFiles = [...filesToUse, newFolder]
        if (pathStack.length > 0) {
            const parent = { ...pathStack[pathStack.length - 1], content: updatedFiles }
            setPathStack([...pathStack.slice(0, -1), parent])
        } else {
            setRootFiles(updatedFiles)
        }
        setNewFolderName('')
        setShowDialog(false)
    }

    const openDialog = (
        type: 'delete' | 'rename' | 'upload' | 'folderCreate',
        file: File | null = null
    ) => {
        setDialogType(type)
        setSelectedFileForDialog(file)
        if (file) setRenameInput(file.name)
        if (type === 'folderCreate') setNewFolderName('')
        setShowDialog(true)
    }

    // Delete selected multiple files
    const handleDeleteSelected = () => {
        if (selectedFiles.length === 0) return
        const updatedFiles = filesToUse.filter(file => !selectedFiles.includes(file.path))
        if (pathStack.length > 0) {
            const parent = { ...pathStack[pathStack.length - 1], content: updatedFiles }
            setPathStack([...pathStack.slice(0, -1), parent])
        } else {
            setRootFiles(updatedFiles)
        }
        setSelectedFiles([])
    }

    return (

        <section>
            <InnerHeader />

            <Main>
                <div className="relative p-4 w-full h-full bg-background text-foreground space-y-4 overflow-hidden">
                    {/* Breadcrumb */}
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink onClick={goHome} className="cursor-pointer">
                                    Home
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            {pathStack.map((folder, i) => (
                                <React.Fragment key={folder.path}>
                                    <BreadcrumbSeparator />
                                    <BreadcrumbItem>
                                        {i === pathStack.length - 1 ? (
                                            <BreadcrumbPage>{folder.name}</BreadcrumbPage>
                                        ) : (
                                            <BreadcrumbLink
                                                onClick={() => goToPathIndex(i)}
                                                className="cursor-pointer"
                                            >
                                                {folder.name}
                                            </BreadcrumbLink>
                                        )}
                                    </BreadcrumbItem>
                                </React.Fragment>
                            ))}
                        </BreadcrumbList>
                    </Breadcrumb>

                    {/* Search + Filters + View toggle */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 flex-wrap">

                        <div className="flex items-center gap-2 flex-1 min-w-0">
                            <Input
                                className="w-full"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search files and folders"
                            />
                            <SearchIcon className="w-6 h-6 text-muted-foreground" />
                        </div>

                        <div className="flex flex-wrap gap-2 items-center justify-center">

                            {/* View Dropdown */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                                        {viewMode === "list" && <ListIcon className="w-4 h-4" />}
                                        {viewMode === "icon" && <GridIcon className="w-4 h-4" />}
                                        {viewMode === "detail" && <InfoIcon className="w-4 h-4" />}
                                        <span className="hidden sm:inline">View</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => setViewMode("list")}>
                                        <ListIcon className="w-4 h-4 mr-2" />
                                        List
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setViewMode("icon")}>
                                        <GridIcon className="w-4 h-4 mr-2" />
                                        Icon
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setViewMode("detail")}>
                                        <InfoIcon className="w-4 h-4 mr-2" />
                                        Detail
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            {/* Filters Dropdown */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                                        <FilterIcon className="w-4 h-4" />
                                        Filters
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-40">
                                    {/* Year Submenu */}
                                    <DropdownMenuSub>
                                        <DropdownMenuSubTrigger>Year</DropdownMenuSubTrigger>
                                        <DropdownMenuSubContent>
                                            <DropdownMenuItem onClick={() => setYearFilter("all")}>
                                                All Years
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => setYearFilter("2023")}>
                                                2023
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => setYearFilter("2024")}>
                                                2024
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => setYearFilter("2025")}>
                                                2025
                                            </DropdownMenuItem>
                                        </DropdownMenuSubContent>
                                    </DropdownMenuSub>

                                    {/* Sort Submenu */}
                                    <DropdownMenuSub>
                                        <DropdownMenuSubTrigger>Sort by</DropdownMenuSubTrigger>
                                        <DropdownMenuSubContent>
                                            <DropdownMenuItem onClick={() => setSortBy("name")}>
                                                Name
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => setSortBy("type")}>
                                                Type
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => setSortBy("date")}>
                                                Date Modified
                                            </DropdownMenuItem>
                                        </DropdownMenuSubContent>
                                    </DropdownMenuSub>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            {/* Calendar beside Filters */}
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                                        <CalendarIcon className="w-4 h-4" />
                                        <span className="hidden sm:inline">Date</span>
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="p-2">
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={setDate}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>

                        </div>

                    </div>

                    {/* File view */}
                    <div className="space-y-2 max-h-[60vh] overflow-auto border rounded-md p-3 bg-muted/10">

                        {/* List view */}
                        {viewMode === "list" && (
                            <ul className="divide-y divide-muted">
                                {sortedFiles.map((file) => (
                                    <li
                                        key={file.path}
                                        className="flex items-center justify-between p-2 cursor-pointer hover:bg-muted rounded"
                                        onClick={() =>
                                            file.type === "folder"
                                                ? navigateToFolder(file)
                                                : setSelectedFiles([file.path])
                                        }
                                    >
                                        <div className="flex items-center gap-2">
                                            {getFileIcon(file)}
                                            <span>{file.name}</span>
                                        </div>
                                        <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                                            <Tooltip>
                                                <Button size="icon" variant="ghost" onClick={() => openDialog("rename", file)}>
                                                    <EditIcon className="w-4 h-4" />
                                                </Button>
                                            </Tooltip>
                                            <Tooltip>
                                                <Button size="icon" variant="ghost" onClick={() => openDialog("delete", file)}>
                                                    <TrashIcon className="w-4 h-4" />
                                                </Button>
                                            </Tooltip>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}

                        {/* Icon view */}
                        {viewMode === "icon" && (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                {sortedFiles.map((file) => (
                                    <div
                                        key={file.path}
                                        className="group p-4 border rounded cursor-pointer hover:bg-muted relative"
                                        onClick={() =>
                                            file.type === "folder"
                                                ? navigateToFolder(file)
                                                : setSelectedFiles([file.path])
                                        }
                                    >
                                        <div className="flex flex-col items-center gap-2">
                                            {getFileIcon(file)}
                                            <div className="truncate text-sm text-center">{file.name}</div>
                                        </div>

                                        {/* Actions menu (3 dots) */}
                                        <div
                                            className="absolute top-2 right-2"
                                            onClick={(e) => e.stopPropagation()} // prevent opening folder when clicking menu
                                        >
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button size="icon" variant="ghost">
                                                        <MoreVertical className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => openDialog("rename", file)}>
                                                        <EditIcon className="w-4 h-4 mr-2" />
                                                        Rename
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => openDialog("delete", file)}>
                                                        <TrashIcon className="w-4 h-4 mr-2" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}


                        {/* Detail view */}
                        {viewMode === "detail" && (
                            <div className="overflow-auto">
                                <table className="w-full text-sm min-w-[600px]">
                                    <thead>
                                        <tr className="text-left text-muted-foreground border-b">
                                            <th className="p-2">Name</th>
                                            <th className="p-2">Type</th>
                                            <th className="p-2">Date Modified</th>
                                            <th className="p-2 text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sortedFiles.map((file) => (
                                            <tr
                                                key={file.path}
                                                className="hover:bg-muted cursor-pointer"
                                                onClick={() =>
                                                    file.type === "folder"
                                                        ? navigateToFolder(file)
                                                        : setSelectedFiles([file.path])
                                                }
                                            >
                                                <td className="p-2 flex items-center gap-2">
                                                    {getFileIcon(file)} {file.name}
                                                </td>
                                                <td className="p-2">{file.type}</td>
                                                <td className="p-2">{file.dateModified || "Unknown"}</td>
                                                <td className="p-2 text-center" onClick={(e) => e.stopPropagation()}>
                                                    <div className="flex justify-center gap-1">
                                                        <Tooltip>
                                                            <Button
                                                                size="icon"
                                                                variant="ghost"
                                                                onClick={() => openDialog("rename", file)}
                                                            >
                                                                <EditIcon className="w-4 h-4" />
                                                            </Button>
                                                        </Tooltip>
                                                        <Tooltip>
                                                            <Button
                                                                size="icon"
                                                                variant="ghost"
                                                                onClick={() => openDialog("delete", file)}
                                                            >
                                                                <TrashIcon className="w-4 h-4" />
                                                            </Button>
                                                        </Tooltip>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {sortedFiles.length === 0 && (
                            <p className="text-center text-muted-foreground">No files or folders found.</p>
                        )}
                    </div>

                    {/* Dock-style toggle group */}
                    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 sm:bottom-6 sm:left-1/2 sm:transform sm:-translate-x-1/2 z-50">
                        <ToggleGroup
                            type="single"
                            className="flex items-center space-x-4 bg-muted rounded-lg p-2 shadow-lg"
                        >
                            <Tooltip>
                                <ToggleGroupItem
                                    value="folderCreate"
                                    aria-label="Create Folder"
                                    onClick={() => openDialog("folderCreate")}
                                    className="inline-flex items-center justify-center p-2 rounded hover:bg-muted cursor-pointer"
                                >
                                    <FolderPlusIcon className="w-5 h-5" />
                                </ToggleGroupItem>
                            </Tooltip>

                            <Tooltip>
                                <ToggleGroupItem
                                    value="uploadFile"
                                    aria-label="Upload File"
                                    onClick={() => openDialog("upload")}
                                    className="inline-flex items-center justify-center p-2 rounded hover:bg-muted cursor-pointer"
                                >
                                    <UploadIcon className="w-5 h-5" />
                                </ToggleGroupItem>
                            </Tooltip>

                            {selectedFiles.length > 0 && (
                                <Tooltip>
                                    <ToggleGroupItem
                                        value="deleteSelected"
                                        aria-label="Delete Selected"
                                        onClick={handleDeleteSelected}
                                        className="inline-flex items-center justify-center p-2 rounded hover:bg-red-600 hover:text-white cursor-pointer"
                                    >
                                        <TrashIcon className="w-5 h-5" />
                                    </ToggleGroupItem>
                                </Tooltip>
                            )}
                        </ToggleGroup>
                    </div>

                    {/* Dialogs */}
                    <Dialog open={showDialog} onOpenChange={setShowDialog}>
                        <DialogContent>
                            {dialogType === "delete" && selectedFileForDialog && (
                                <>
                                    <DialogHeader>
                                        <DialogTitle>Delete File</DialogTitle>
                                        <DialogDescription>
                                            Are you sure you want to delete "{selectedFileForDialog.name}"?
                                        </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 sm:justify-end">
                                        <Button
                                            variant="destructive"
                                            className="w-full sm:w-auto"
                                            onClick={() => {
                                                handleDelete(selectedFileForDialog.path);
                                                setShowDialog(false);
                                            }}
                                        >
                                            Confirm
                                        </Button>
                                        <DialogClose asChild>
                                            <Button variant="outline" className="w-full sm:w-auto">
                                                Cancel
                                            </Button>
                                        </DialogClose>
                                    </DialogFooter>
                                </>
                            )}

                            {dialogType === "rename" && selectedFileForDialog && (
                                <>
                                    <DialogHeader>
                                        <DialogTitle>Rename File</DialogTitle>
                                    </DialogHeader>
                                    <Input
                                        className="my-4 w-full"
                                        value={renameInput}
                                        onChange={(e) => setRenameInput(e.target.value)}
                                        autoFocus
                                    />
                                    <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 sm:justify-end">
                                        <Button
                                            className="w-full sm:w-auto"
                                            onClick={() => {
                                                handleRename(selectedFileForDialog.path, renameInput);
                                                setShowDialog(false);
                                            }}
                                        >
                                            Save
                                        </Button>
                                        <DialogClose asChild>
                                            <Button variant="outline" className="w-full sm:w-auto">
                                                Cancel
                                            </Button>
                                        </DialogClose>
                                    </DialogFooter>
                                </>
                            )}

                            {dialogType === "upload" && (
                                <>
                                    <DialogHeader>
                                        <DialogTitle>Upload a File</DialogTitle>
                                    </DialogHeader>
                                    <Input
                                        type="file"
                                        onChange={(e) => {
                                            if (e.target.files?.[0]) setFileUpload(e.target.files[0]);
                                        }}
                                        className="w-full"
                                    />
                                    <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 sm:justify-end mt-4">
                                        <Button className="w-full sm:w-auto" onClick={() => {
                                            handleFileUpload();
                                            setShowDialog(false);
                                        }}>
                                            Upload
                                        </Button>
                                        <DialogClose asChild>
                                            <Button variant="outline" className="w-full sm:w-auto">
                                                Cancel
                                            </Button>
                                        </DialogClose>
                                    </DialogFooter>
                                </>
                            )}

                            {dialogType === "folderCreate" && (
                                <>
                                    <DialogHeader>
                                        <DialogTitle>Create New Folder</DialogTitle>
                                    </DialogHeader>
                                    <Input
                                        className="my-4 w-full"
                                        placeholder="Folder name"
                                        value={newFolderName}
                                        onChange={(e) => setNewFolderName(e.target.value)}
                                        autoFocus
                                    />
                                    <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 sm:justify-end">
                                        <Button className="w-full sm:w-auto" onClick={handleFolderCreate}>
                                            Create
                                        </Button>
                                        <DialogClose asChild>
                                            <Button variant="outline" className="w-full sm:w-auto">
                                                Cancel
                                            </Button>
                                        </DialogClose>
                                    </DialogFooter>
                                </>
                            )}
                        </DialogContent>
                    </Dialog>

                </div>
            </Main>
        </section>



    )
}

export default FileManager
