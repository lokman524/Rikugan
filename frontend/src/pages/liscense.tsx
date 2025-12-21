import React, { useState, useEffect } from "react";
import { Input } from "@heroui/input";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";

const License: React.FC<{ user: any }> = ({ user }) => {
	const [licenseKey, setLicenseKey] = useState("");
	const [isValid, setIsValid] = useState<boolean | null>(null);
	const [clicked, setClicked] = useState(false);
	// Mock bounties data - replace with actual API call
	useEffect(() => {}, [user]);

	return (
		<div className="flex flex-col items-center justify-center screen w-full">
			<Card className="w-1/3">
				<CardHeader className="justify-center">Input License Key</CardHeader>
				<CardBody>
					<Input placeholder="Enter your license key here" />
					<Button className="mt-4" color="primary">
						Submit
					</Button>
				</CardBody>
			</Card>
		</div>
	);
};

export default License;
