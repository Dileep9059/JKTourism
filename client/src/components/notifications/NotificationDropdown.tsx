"use client";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Bell } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";

interface Notification {
  id: string;
  message: string;
  date: string;
  read: boolean;
}

export function NotificationDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      message: "Welcome to your dashboard!",
      date: new Date().toISOString(),
      read: false,
    },
    {
      id: "2",
      message: "System update available.",
      date: new Date().toISOString(),
      read: false,
    },
    // {
    //   id: "3",
    //   message: "Check your messages.",
    //   date: "2025-09-10 06:54:12",
    //   read: false,
    // },
    // {
    //   id: "4",
    //   message: "Meeting at 3 PM tomorrow.",
    //   date: "2025-09-12 06:54:12",
    //   read: false,
    // },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const dismiss = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    toast.success("Notification dismissed");

    if ("vibrate" in navigator) {
      navigator.vibrate(10);
    }
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  useEffect(() => {
    if (isDialogOpen) markAllAsRead();
  }, [isDialogOpen]);

  const isToday = (date: Date) =>
    date.toDateString() === new Date().toDateString();

  const isYesterday = (date: Date) => {
    const y = new Date();
    y.setDate(y.getDate() - 1);
    return date.toDateString() === y.toDateString();
  };

  const getWeekStart = (d: Date) => {
    const date = new Date(d);
    date.setDate(date.getDate() - date.getDay());
    date.setHours(0, 0, 0, 0);
    return date.getTime();
  };

  const isThisWeek = (date: Date) => {
    const now = new Date();
    const start = getWeekStart(now);
    const end = start + 7 * 24 * 60 * 60 * 1000;
    return date.getTime() >= start && date.getTime() < end;
  };

  const isLastWeek = (date: Date) => {
    const now = new Date();
    const start = getWeekStart(now) - 7 * 24 * 60 * 60 * 1000;
    const end = start + 7 * 24 * 60 * 60 * 1000;
    return date.getTime() >= start && date.getTime() < end;
  };

  const formatRelativeTime = (date: Date) => {
    const diff = Date.now() - date.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const filteredNotifications = useMemo(
    () =>
      notifications.filter((n) =>
        n.message.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [notifications, searchTerm]
  );

  const groupNotifications = (list: Notification[]) => {
    const today: Notification[] = [];
    const yesterday: Notification[] = [];
    const thisWeek: Notification[] = [];
    const lastWeek: Notification[] = [];
    const older: Notification[] = [];

    list.forEach((n) => {
      const date = new Date(n.date);
      if (isToday(date)) today.push(n);
      else if (isYesterday(date)) yesterday.push(n);
      else if (isThisWeek(date)) thisWeek.push(n);
      else if (isLastWeek(date)) lastWeek.push(n);
      else older.push(n);
    });

    return { today, yesterday, thisWeek, lastWeek, older };
  };

  const grouped = groupNotifications(filteredNotifications);

  const renderNotificationItem = (n: Notification) => {
    const date = new Date(n.date);

    return (
      <div
        key={n.id}
        className="group flex justify-between items-center py-1 px-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition relative"
      >
        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            {!n.read && <span className="w-2 h-2 bg-blue-500 rounded-full" />}
            <span className="text-sm truncate">{n.message}</span>
          </div>
          <span className="text-xs text-gray-500">
            {formatRelativeTime(date)}
          </span>
        </div>
        <button
          onClick={() => dismiss(n.id)}
          className="opacity-0 group-hover:opacity-100 text-red-500 px-2 transition"
          aria-label="Dismiss notification"
        >
          ✕
        </button>
      </div>
    );
  };

  const renderGroup = (label: string, items: Notification[]) =>
    items.length > 0 && (
      <div key={label}>
        <h3 className="font-semibold mb-1 text-gray-700 dark:text-gray-300">
          {label}
        </h3>
        <div className="space-y-1">{items.map(renderNotificationItem)}</div>
      </div>
    );

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="relative p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 transition"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 px-1.5 py-0.5 text-xs font-bold text-white bg-red-600 rounded-full transform translate-x-1/2 -translate-y-1/2">
                {unreadCount}
              </span>
            )}
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-full max-w-xs sm:max-w-[600px] max-h-[70vh] overflow-auto rounded-md shadow-lg">
          <DropdownMenuLabel className="text-sm font-semibold">Notifications</DropdownMenuLabel>
          <DropdownMenuSeparator />

          {notifications.length === 0 ? (
            <DropdownMenuItem className="text-gray-500 text-sm">
              No notifications
            </DropdownMenuItem>
          ) : (
            <>
              {renderGroup("Today", grouped.today)}
              {renderGroup("Yesterday", grouped.yesterday)}
              {renderGroup("This Week", grouped.thisWeek)}
              {renderGroup("Last Week", grouped.lastWeek)}
              {renderGroup("Older", grouped.older)}
            </>
          )}

          <DropdownMenuSeparator />

          <div className="px-2 py-2">
            <button
              onClick={() => setIsDialogOpen(true)}
              className="w-full text-center text-sm font-medium text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded px-3 py-2 transition"
            >
              See all
            </button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>


      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>All Notifications</DialogTitle>
            <DialogDescription>
              Here are all your notifications.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-2 mb-4">
            <input
              type="search"
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-4 max-h-80 overflow-auto">
            {filteredNotifications.length === 0 ? (
              <p className="text-gray-500">No notifications found</p>
            ) : (
              <>
                {renderGroup("Today", grouped.today)}
                {renderGroup("Yesterday", grouped.yesterday)}
                {renderGroup("This Week", grouped.thisWeek)}
                {renderGroup("Last Week", grouped.lastWeek)}
                {renderGroup("Older", grouped.older)}
              </>
            )}
          </div>

          {filteredNotifications.length > 0 && (
            <div className="mt-4 flex justify-between">
              <button
                onClick={markAllAsRead}
                className="text-blue-600 hover:underline"
              >
                Mark all as read
              </button>
              <button
                onClick={() =>
                  setNotifications((prev) =>
                    prev.filter((n) => !filteredNotifications.includes(n))
                  )
                }
                className="text-red-600 hover:underline"
              >
                Dismiss all
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
