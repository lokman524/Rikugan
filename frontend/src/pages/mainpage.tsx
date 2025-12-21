import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Sidebar from "@/components/Sidebar";
import Dashboard from "./dashboard";
import Taskboard from "./taskboard";
import { DashboardIcon, TaskIcon, WalletIcon } from "@/components/icons";

const DashboardPage: React.FC = () => {
	const { user } = useAuth();

	const [sidebarOpen, setSidebarOpen] = useState(false);

	const [currentItemId, setCurrentItemId] = useState("dashboard");

	const menuItems = [
		{ id: "dashboard", label: "Dashboard", icon: DashboardIcon },
		{ id: "taskboard", label: "Taskboard", icon: TaskIcon },
	];

	const componentMap: Record<string, React.ReactNode> = {
		dashboard: <Dashboard user={user} />,
		taskboard: <Taskboard user={user} />,
	};

	return (
		<div className="h-screen bg-gray-50 dark:bg-gray-900 flex">
			<Sidebar
				isOpen={sidebarOpen}
				onClose={() => setSidebarOpen(false)}
				menuItems={menuItems}
				setCurrentItemId={setCurrentItemId}
			/>

			{/* Main Content */}
			{componentMap[currentItemId]}
		</div>
	);
};

export default DashboardPage;
