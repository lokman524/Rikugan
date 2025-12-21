import React, { useState, useEffect } from "react";

const MyTask: React.FC<{ user: any }> = ({ user }) => {
	// Mock bounties data - replace with actual API call
	useEffect(() => {}, [user]);

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
			fuck you this is my task fuck you cyrus
		</div>
	);
};

export default MyTask;
