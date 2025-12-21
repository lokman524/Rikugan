import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Sidebar from "@/components/Sidebar";
import Dashboard from "./dashboard";
import Taskboard from "./taskboard";
import TeamManagement from "./team_management";
import {
	DashboardIcon,
	TaskIcon,
	LicenseIcon,
	TeamManagementIcon,
} from "@/components/icons";
import License from "./liscense";

const DashboardPage: React.FC = () => {
	const { user } = useAuth();

	const [sidebarOpen, setSidebarOpen] = useState(false);

	const [currentItemId, setCurrentItemId] = useState("dashboard");

	const menuItems = [
		{ id: "dashboard", label: "Dashboard", icon: DashboardIcon },
		{ id: "taskboard", label: "Taskboard", icon: TaskIcon },
		{ id: "license", label: "License", icon: LicenseIcon },
		{
			id: "team_management",
			label: "Team Management",
			icon: TeamManagementIcon,
		},
	];

	const componentMap: Record<string, React.ReactNode> = {
		dashboard: <Dashboard user={user} />,
		taskboard: <Taskboard user={user} />,
		license: <License user={user} />,
		...(user?.role === "OYAKATASAMA" && {
			team_management: <TeamManagement user={user} />,
		}),
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
