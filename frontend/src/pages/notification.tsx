import React, { useState, useEffect } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { NotificationIcon } from "@/components/icons";

interface NotificationItem {
	id: number;
	userId: number;
	type: string;
	message: string;
	relatedId: number;
	isRead: boolean;
	createdAt: string;
}

const mockNotifications: NotificationItem[] = [
	{
		id: 1,
		userId: 1,
		type: "TASK_ASSIGNED",
		message: "You have been assigned a new task!",
		relatedId: 101,
		isRead: false,
		createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
	},
	{
		id: 2,
		userId: 1,
		type: "BOUNTY_COMPLETED",
		message: "Your bounty has been completed!",
		relatedId: 102,
		isRead: true,
		createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
	},
	{
		id: 3,
		userId: 1,
		type: "DEADLINE_REMINDER",
		message: "A task deadline is approaching soon.",
		relatedId: 103,
		isRead: false,
		createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
	},
];

const Notification: React.FC<{ user: any }> = ({ user }) => {
	const [notifications, setNotifications] = useState<NotificationItem[]>([]);
	const [showUnreadOnly, setShowUnreadOnly] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [expandedId, setExpandedId] = useState<number | null>(null);

	useEffect(() => {
		// Replace with API call
		setNotifications(mockNotifications);
	}, [user]);

	const unreadCount = notifications.filter((n) => !n.isRead).length;

	const filteredNotifications = notifications.filter((n) => {
		if (showUnreadOnly && n.isRead) return false;
		if (
			searchTerm &&
			!n.message.toLowerCase().includes(searchTerm.toLowerCase())
		)
			return false;
		return true;
	});

	const handleMarkAsRead = (id: number) => {
		setNotifications((prev) =>
			prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
		);
	};

	const handleMarkAllAsRead = () => {
		setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
	};

	const handleDelete = (id: number) => {
		setNotifications((prev) => prev.filter((n) => n.id !== id));
	};

	const handleExpand = (notification: NotificationItem) => {
		setExpandedId(expandedId === notification.id ? null : notification.id);
		if (!notification.isRead) handleMarkAsRead(notification.id);
	};

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex w-full">
			<div className="flex-1 lg:ml-0 transition-all duration-300 mx-auto">
				{/* Header */}
				<header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
					<div className="flex items-center justify-between p-4">
						<div className="flex items-center space-x-4">
							<NotificationIcon className="w-8 h-8 text-primary" />
							<h1 className="text-2xl font-bold text-gray-900 dark:text-white">
								Notifications
							</h1>
							{unreadCount > 0 && (
								<span className="ml-2 px-2 py-0.5 rounded-full bg-red-500 text-white text-xs font-semibold">
									{unreadCount} Unread
								</span>
							)}
						</div>
						<div className="flex items-center space-x-2">
							<Button
								variant={showUnreadOnly ? "solid" : "bordered"}
								onPress={() => setShowUnreadOnly((v) => !v)}
							>
								{showUnreadOnly ? "Show All" : "Show Unread"}
							</Button>
							<Button
								variant="bordered"
								onPress={handleMarkAllAsRead}
								disabled={unreadCount === 0}
							>
								Mark All as Read
							</Button>
						</div>
					</div>
				</header>

				<div className="p-6">
					{/* Search Bar */}
					<div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-6 flex gap-4 items-center">
						<Input
							placeholder="Search notifications..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="flex-1"
						/>
					</div>

					{/* Notification List - Email/Inbox Style */}
					<div className="bg-white dark:bg-gray-800 rounded-lg shadow divide-y divide-gray-200 dark:divide-gray-700">
						{filteredNotifications.length === 0 ? (
							<div className="p-8 text-center text-gray-500 dark:text-gray-400">
								No notifications found.
							</div>
						) : (
							filteredNotifications.map((n) => (
								<div key={n.id}>
									<div
										className={`flex items-center px-4 py-3 cursor-pointer transition group ${
											!n.isRead
												? "bg-primary-50 dark:bg-primary-900/30 font-semibold border-l-4 border-primary-500"
												: "hover:bg-gray-100 dark:hover:bg-gray-900"
										}`}
										onClick={() => handleExpand(n)}
									>
										<NotificationIcon className="w-5 h-5 text-primary mr-3 flex-shrink-0" />
										<div className="flex-1 min-w-0">
											<div className="flex items-center gap-2">
												<span className="truncate">
													{n.type.replace(/_/g, " ")}
												</span>
												{!n.isRead && (
													<span className="ml-2 px-2 py-0.5 rounded-full bg-primary-500 text-white text-xs font-semibold">
														New
													</span>
												)}
											</div>
											<div className="truncate text-gray-700 dark:text-gray-300 text-sm">
												{n.message}
											</div>
										</div>
										<div className="ml-4 flex flex-col items-end">
											<span className="text-xs text-gray-500 dark:text-gray-400">
												{new Date(n.createdAt).toLocaleString()}
											</span>
											<div className="flex gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
												<Button
													size="sm"
													variant="light"
													onClick={(e) => {
														e.stopPropagation();
														handleDelete(n.id);
													}}
												>
													Delete
												</Button>
												{!n.isRead && (
													<Button
														size="sm"
														variant="light"
														onClick={(e) => {
															e.stopPropagation();
															handleMarkAsRead(n.id);
														}}
													>
														Mark as Read
													</Button>
												)}
											</div>
										</div>
									</div>
									{/* Inline Expansion for Details */}
									{expandedId === n.id && (
										<div className="bg-gray-50 dark:bg-gray-900 px-8 py-4 border-t border-gray-200 dark:border-gray-800 animate-fade-in">
											<div className="mb-2 text-gray-700 dark:text-gray-300">
												{n.message}
											</div>
											<div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
												{new Date(n.createdAt).toLocaleString()}
											</div>
											<div className="flex gap-2">
												<Button
													variant="light"
													onClick={() => setExpandedId(null)}
												>
													Close
												</Button>
												{!n.isRead && (
													<Button
														color="primary"
														onClick={() => handleMarkAsRead(n.id)}
													>
														Mark as Read
													</Button>
												)}
												<Button
													color="danger"
													onClick={() => handleDelete(n.id)}
												>
													Delete
												</Button>
											</div>
										</div>
									)}
								</div>
							))
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Notification;
