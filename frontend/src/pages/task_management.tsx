import React, { useState, useEffect } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	useDisclosure,
} from "@heroui/modal";
import BountyCard, { Bounty } from "@/components/BountyCard";
import { SearchIcon } from "@/components/icons";
import SimpleThemeToggle from "@/components/SimpleThemeToggle";

const TaskManagement: React.FC<{ user: any }> = ({ user }) => {
	const [bounties, setBounties] = useState<Bounty[]>([]);
	const [filteredBounties, setFilteredBounties] = useState<Bounty[]>([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [priorityFilter, setPriorityFilter] = useState("ALL");
	const [tagFilter, setTagFilter] = useState("ALL");
	const [showCreateTask, setShowCreateTask] = useState(false);
	const [createTaskForm, setCreateTaskForm] = useState({
		title: "",
		description: "",
		bountyAmount: "",
		deadline: "",
		priority: "MEDIUM",
		tags: "",
		estimatedHours: "",
	});
	const [selectedTags, setSelectedTags] = useState<string[]>([]);
	const [newTagInput, setNewTagInput] = useState("");
	const [manageTaskSelected, setManageTaskSelected] = useState<Bounty | null>(null);
	const [showConfirmComplete, setShowConfirmComplete] = useState(false);
	const [showConfirmInProgress, setShowConfirmInProgress] = useState(false);
	const [pendingStatusTask, setPendingStatusTask] = useState<{bounty: Bounty, status: string} | null>(null);

	// Mock bounties data - replace with actual API call
	useEffect(() => {
		const mockBounties: Bounty[] = [
			{
				id: "1",
				title: "Fix Authentication Bug",
				description:
					"There is a critical bug in the login system that prevents users from accessing their accounts. Need to investigate and fix the JWT token validation.",
				bountyAmount: 250.0,
				deadline: "2025-12-10T23:59:59Z",
				status: "AVAILABLE",
				priority: "HIGH",
				createdBy: user?.username,
				tags: ["Backend", "Authentication", "Critical"],
				estimatedHours: 4,
			},
			{
				id: "2",
				title: "Implement Dark Mode",
				description:
					"Add dark mode support to the entire application. This includes updating all components to respect the theme preference.",
				bountyAmount: 150.0,
				deadline: "2025-12-15T23:59:59Z",
				status: "IN_PROGRESS",
				priority: "MEDIUM",
				createdBy: user?.username,
				tags: ["Frontend", "UI/UX", "Theme"],
				estimatedHours: 8,
			},
			{
				id: "3",
				title: "Database Optimization",
				description:
					"Optimize database queries for better performance. Focus on the user and task tables that are experiencing slow response times.",
				bountyAmount: 300.0,
				deadline: "2025-12-20T23:59:59Z",
				status: "REVIEW",
				priority: "HIGH",
				createdBy: user?.username,
				tags: ["Database", "Performance", "SQL"],
				estimatedHours: 12,
			},
			{
				id: "4",
				title: "Create User Profile Page",
				description:
					"Design and implement a comprehensive user profile page where users can view and edit their information.",
				bountyAmount: 200.0,
				deadline: "2025-12-25T23:59:59Z",
				status: "COMPLETED",
				priority: "MEDIUM",
				createdBy: user?.username,
				tags: ["Frontend", "Profile", "Forms"],
				estimatedHours: 6,
			},
			{
				id: "5",
				title: "API Documentation",
				description:
					"Write comprehensive API documentation for all endpoints. Include examples and error handling scenarios.",
				bountyAmount: 100.0,
				deadline: "2025-12-30T23:59:59Z",
				status: "AVAILABLE",
				priority: "LOW",
				createdBy: user?.username,
				tags: ["Documentation", "API", "Backend"],
				estimatedHours: 10,
			},
		];
		setBounties(mockBounties);
		setFilteredBounties(mockBounties);
	}, [user]);

	// Collect all unique tags from ALL bounties (not just filtered)
	const allTags = React.useMemo(() => {
		const tagSet = new Set<string>();
		bounties.forEach((b) => b.tags.forEach((t) => tagSet.add(t)));
		return Array.from(tagSet);
	}, [bounties]);

	// Filter bounties based on search and filters (only tasks created by me)
	useEffect(() => {
		let filtered = bounties.filter((b) => b.createdBy === user?.username);

		if (searchTerm) {
			filtered = filtered.filter(
				(bounty) =>
					bounty.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
					bounty.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
					bounty.tags.some((tag) =>
						tag.toLowerCase().includes(searchTerm.toLowerCase())
					)
			);
		}

		if (priorityFilter !== "ALL") {
			filtered = filtered.filter(
				(bounty) => bounty.priority === priorityFilter
			);
		}

		if (tagFilter !== "ALL") {
			filtered = filtered.filter((bounty) => bounty.tags.includes(tagFilter));
		}

		setFilteredBounties(filtered);
	}, [searchTerm, priorityFilter, tagFilter, bounties, user]);

	const handleCreateTaskInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
		setCreateTaskForm((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	// Update createTaskForm.tags when selectedTags or newTagInput changes
	useEffect(() => {
		const tags = [
			...selectedTags,
			...(newTagInput
				.split(",")
				.map((t) => t.trim())
				.filter(Boolean)
			),
		];
		setCreateTaskForm((prev) => ({
			...prev,
			tags: tags.join(","),
		}));
	}, [selectedTags, newTagInput]);

	const handleTagChipClick = (tag: string) => {
		setSelectedTags((prev) =>
			prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
		);
	};

	const handleSubmitCreateTask = () => {
		const newTask: Bounty = {
			id: (Math.random() * 100000).toFixed(0),
			title: createTaskForm.title,
			description: createTaskForm.description,
			bountyAmount: parseFloat(createTaskForm.bountyAmount) || 0,
			deadline: createTaskForm.deadline,
			status: "AVAILABLE",
			priority: createTaskForm.priority as "LOW" | "MEDIUM" | "HIGH",
			createdBy: user?.username,
			tags: createTaskForm.tags.split(",").map((t) => t.trim()).filter(Boolean),
			estimatedHours: parseInt(createTaskForm.estimatedHours) || undefined,
		};
		setBounties((prev) => [newTask, ...prev]);
		setShowCreateTask(false);
		setCreateTaskForm({
			title: "",
			description: "",
			bountyAmount: "",
			deadline: "",
			priority: "MEDIUM",
			tags: "",
			estimatedHours: "",
		});
		setSelectedTags([]);
		setNewTagInput("");
	};

	const handleManageTaskStatus = (bounty: Bounty, status: "IN_PROGRESS" | "COMPLETED") => {
		if (status === "COMPLETED") {
			setPendingStatusTask({ bounty, status: "COMPLETED" });
			setShowConfirmComplete(true);
			return;
		}
		if (status === "IN_PROGRESS") {
			setPendingStatusTask({ bounty, status: "IN_PROGRESS" });
			setShowConfirmInProgress(true);
			return;
		}
		// ...should never reach here...
	};

	const confirmSetInProgress = () => {
		if (pendingStatusTask && pendingStatusTask.status === "IN_PROGRESS") {
			const bounty = pendingStatusTask.bounty;
			setBounties((prev) =>
				prev.map((b) =>
					b.id === bounty.id
						? { ...b, status: "IN_PROGRESS" }
						: b
				)
			);
			setManageTaskSelected((b) =>
				b && b.id === bounty.id ? { ...b, status: "IN_PROGRESS" } : b
			);
		}
		setShowConfirmInProgress(false);
		setPendingStatusTask(null);
	};

	const confirmSetCompleted = () => {
		if (pendingStatusTask && pendingStatusTask.status === "COMPLETED") {
			const bounty = pendingStatusTask.bounty;
			setBounties((prev) =>
				prev.map((b) =>
					b.id === bounty.id
						? { ...b, status: "COMPLETED" }
						: b
				)
			);
			setManageTaskSelected((b) =>
				b && b.id === bounty.id ? { ...b, status: "COMPLETED" } : b
			);
		}
		setShowConfirmComplete(false);
		setPendingStatusTask(null);
	};

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex w-full">
			{/* Main Content */}
			<div className={`flex-1 lg:ml-0 transition-all duration-300 ${showCreateTask ? "mr-96" : ""}`}>
				{/* Header */}
				<header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
					<div className="flex items-center justify-between p-4">
						<div className="flex items-center space-x-4">
							<h1 className="text-2xl font-bold text-gray-900 dark:text-white">
								Task Management
							</h1>
						</div>
						<div className="flex items-center space-x-2">
							<Button
								color="primary"
								variant="solid"
								onPress={() => setShowCreateTask(true)}
							>
								Create Task
							</Button>
							<SimpleThemeToggle />
						</div>
					</div>
				</header>

				<div className="p-6">
					{/* Filters */}
					<div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-6">
						<div className="flex flex-col lg:flex-row gap-4">
							<Input
								placeholder="Search my tasks..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								startContent={<SearchIcon />}
								className="flex-1"
							/>
							<Select
								placeholder="Filter by Priority"
								selectedKeys={priorityFilter === "ALL" ? [] : [priorityFilter]}
								onSelectionChange={(keys) =>
									setPriorityFilter((Array.from(keys)[0] as string) || "ALL")
								}
								className="w-full lg:w-48"
							>
								<SelectItem key="ALL">All Priorities</SelectItem>
								<SelectItem key="HIGH">High</SelectItem>
								<SelectItem key="MEDIUM">Medium</SelectItem>
								<SelectItem key="LOW">Low</SelectItem>
							</Select>
							<Select
								placeholder="Filter by Tag"
								selectedKeys={tagFilter === "ALL" ? [] : [tagFilter]}
								onSelectionChange={(keys) =>
									setTagFilter((Array.from(keys)[0] as string) || "ALL")
								}
								className="w-full lg:w-48"
							>
								<SelectItem key="ALL">All Tags</SelectItem>
								{allTags.map((tag) => (
									<SelectItem key={tag}>{tag}</SelectItem>
								))}
							</Select>
						</div>
					</div>

					{/* My Created Tasks List */}
					<div>
						<h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
							My Created Tasks
						</h2>
						{filteredBounties.length === 0 ? (
							<div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow text-center">
								<p className="text-gray-500 dark:text-gray-400">
									No tasks found matching your criteria.
								</p>
							</div>
						) : (
							<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
								{filteredBounties.map((bounty) => (
									<BountyCard
										key={bounty.id}
										bounty={bounty}
										onClick={() => setManageTaskSelected(bounty)}
										isUserTask
									/>
								))}
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Create Task Sidebar */}
			{showCreateTask && (
				<div className="fixed top-0 right-0 h-full w-96 bg-white dark:bg-gray-900 shadow-lg z-50 border-l border-gray-200 dark:border-gray-700 flex flex-col">
					<div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
						<h2 className="text-lg font-semibold text-gray-900 dark:text-white">
							Create New Task
						</h2>
						<Button variant="light" onPress={() => setShowCreateTask(false)}>
							Close
						</Button>
					</div>
					<div className="p-4 overflow-y-auto flex-1">
						<div className="space-y-3">
							<Input
								label="Title"
								name="title"
								value={createTaskForm.title}
								onChange={handleCreateTaskInput}
								required
							/>
							<div>
								<label className="block text-sm font-medium mb-1" htmlFor="create-desc">
									Description
								</label>
								<textarea
									id="create-desc"
									name="description"
									className="w-full rounded border border-gray-300 dark:bg-gray-800 dark:text-white p-2"
									value={createTaskForm.description}
									onChange={handleCreateTaskInput}
									required
									rows={3}
								/>
							</div>
							<Input
								label="Bounty Amount"
								name="bountyAmount"
								type="number"
								value={createTaskForm.bountyAmount}
								onChange={handleCreateTaskInput}
								required
							/>
							<Input
								label="Deadline"
								name="deadline"
								type="date"
								value={createTaskForm.deadline}
								onChange={handleCreateTaskInput}
								required
							/>
							<Select
								label="Priority"
								name="priority"
								selectedKeys={[createTaskForm.priority]}
								onSelectionChange={(keys) =>
									setCreateTaskForm((prev) => ({
										...prev,
										priority: Array.from(keys)[0] as string,
									}))
								}
							>
								<SelectItem key="HIGH">High</SelectItem>
								<SelectItem key="MEDIUM">Medium</SelectItem>
								<SelectItem key="LOW">Low</SelectItem>
							</Select>
							<div>
								<label className="block text-sm font-medium mb-1">
									Tags
								</label>
								<div className="flex flex-wrap gap-2 mb-2">
									{allTags.map((tag) => (
										<button
											type="button"
											key={tag}
											className={`px-2 py-1 rounded text-sm border ${
												selectedTags.includes(tag)
													? "bg-primary-600 text-white border-primary-600"
													: "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-300"
											}`}
											onClick={() => handleTagChipClick(tag)}
										>
											{tag}
										</button>
									))}
								</div>
								<Input
									label="Add new tags (comma separated)"
									name="newtags"
									value={newTagInput}
									onChange={(e) => setNewTagInput(e.target.value)}
									placeholder="e.g. Backend, Urgent"
								/>
							</div>
							<Input
								label="Estimated Hours"
								name="estimatedHours"
								type="number"
								value={createTaskForm.estimatedHours}
								onChange={handleCreateTaskInput}
							/>
							<Button color="primary" className="w-full" onPress={handleSubmitCreateTask}>
								Create
							</Button>
						</div>
					</div>
				</div>
			)}

			{/* Manage Task Modal */}
			<Modal isOpen={!!manageTaskSelected} onClose={() => setManageTaskSelected(null)}>
				<ModalContent>
					{manageTaskSelected && (
						<>
							<ModalHeader className="flex flex-col gap-1">
								<h2 className="text-xl font-bold">{manageTaskSelected.title}</h2>
								<p className="text-sm text-gray-600">
									Status: {manageTaskSelected.status}
								</p>
							</ModalHeader>
							<ModalBody>
								<div className="space-y-4">
									<div>
										<h3 className="font-semibold mb-2">Description</h3>
										<p className="text-gray-700 dark:text-gray-300">
											{manageTaskSelected.description}
										</p>
									</div>
									<div className="grid grid-cols-2 gap-4">
										<div>
											<h4 className="font-semibold">Bounty Amount</h4>
											<p className="text-2xl font-bold text-success">
												${manageTaskSelected.bountyAmount.toFixed(2)}
											</p>
										</div>
										<div>
											<h4 className="font-semibold">Deadline</h4>
											<p>
												{new Date(manageTaskSelected.deadline).toLocaleDateString()}
											</p>
										</div>
									</div>
									<div>
										<h4 className="font-semibold mb-2">Tags</h4>
										<div className="flex flex-wrap gap-2">
											{manageTaskSelected.tags.map((tag, index) => (
												<span
													key={index}
													className="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 rounded text-sm"
												>
													{tag}
												</span>
											))}
										</div>
									</div>
								</div>
							</ModalBody>
							<ModalFooter>
								<Button
									size="sm"
									variant={manageTaskSelected.status === "IN_PROGRESS" ? "solid" : "bordered"}
									onPress={() => handleManageTaskStatus(manageTaskSelected, "IN_PROGRESS")}
									disabled={manageTaskSelected.status === "IN_PROGRESS"}
								>
									Set In Progress
								</Button>
								<Button
									size="sm"
									variant={manageTaskSelected.status === "COMPLETED" ? "solid" : "bordered"}
									onPress={() => handleManageTaskStatus(manageTaskSelected, "COMPLETED")}
									disabled={manageTaskSelected.status === "COMPLETED"}
								>
									Set Completed
								</Button>
								<Button
									size="sm"
									variant="light"
									onPress={() => setManageTaskSelected(null)}
								>
									Close
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>

			{/* Confirm In Progress Status Modal */}
			<Modal isOpen={showConfirmInProgress} onClose={() => { setShowConfirmInProgress(false); setPendingStatusTask(null); }}>
				<ModalContent>
					<ModalHeader>Confirm Status Change</ModalHeader>
					<ModalBody>
						Are you sure you want to refuse the submition?
						{pendingStatusTask && (
							<div className="mt-2 text-sm text-gray-700 dark:text-gray-200">
								<strong>{pendingStatusTask.bounty.title}</strong>
							</div>
						)}
					</ModalBody>
					<ModalFooter>
						<Button variant="light" onPress={() => { setShowConfirmInProgress(false); setPendingStatusTask(null); }}>
							Cancel
						</Button>
						<Button color="primary" onPress={confirmSetInProgress}>
							Confirm
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>

			{/* Confirm Complete Status Modal */}
			<Modal isOpen={showConfirmComplete} onClose={() => { setShowConfirmComplete(false); setPendingStatusTask(null); }}>
				<ModalContent>
					<ModalHeader>Confirm Status Change</ModalHeader>
					<ModalBody>
						Are you sure you want to set this task to <b>Completed</b>?
						{pendingStatusTask && (
							<div className="mt-2 text-sm text-gray-700 dark:text-gray-200">
								<strong>{pendingStatusTask.bounty.title}</strong>
							</div>
						)}
					</ModalBody>
					<ModalFooter>
						<Button variant="light" onPress={() => { setShowConfirmComplete(false); setPendingStatusTask(null); }}>
							Cancel
						</Button>
						<Button color="primary" onPress={confirmSetCompleted}>
							Confirm
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
			{/* ...existing code for Create Task Sidebar ... */}
		</div>
	);
};

export default TaskManagement;
