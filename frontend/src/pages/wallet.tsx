import React, { useState, useEffect } from "react";

const Wallet: React.FC<{ user: any }> = ({ user }) => {
	// Mock bounties data - replace with actual API call
	useEffect(() => {}, [user]);

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
			Fuck you this is wallet page
		</div>
	);
};

export default Wallet;
