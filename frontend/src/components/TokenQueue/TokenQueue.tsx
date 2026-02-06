"use client";

import { useState, useEffect } from "react";
import { TOKEN_STATUS, COUNTERS } from "@/src/lib/constants";
import type { TokenStatus } from "@/src/lib/types/staff";
import styles from "./TokenQueue.module.css";

// Define the Token interface
interface Token {
	id: string;
	tokenNumber: string;
	userId: string;
	userName: string;
	slotId: string;
	slotTiming: string;
	status: TokenStatus;
	counterId?: number;
	counterName?: string;
	createdAt: Date;
	servedAt?: Date;
}

export default function TokenQueue() {
	const [selectedCounter, setSelectedCounter] = useState<number | null>(null);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	const [tokens, setTokens] = useState<Token[]>([
		{
			id: "1",
			tokenNumber: "T001",
			userId: "U001",
			userName: "John Doe",
			slotId: "1",
			slotTiming: "8 AM - 9 AM",
			status: TOKEN_STATUS.SERVING,
			counterId: 1,
			counterName: "Counter 1",
			createdAt: new Date(),
		},
		{
			id: "2",
			tokenNumber: "T002",
			userId: "U002",
			userName: "Jane Smith",
			slotId: "1",
			slotTiming: "8 AM - 9 AM",
			status: TOKEN_STATUS.ACTIVE,
			counterId: 2,
			counterName: "Counter 2",
			createdAt: new Date(),
		},
		{
			id: "3",
			tokenNumber: "T003",
			userId: "U003",
			userName: "Bob Johnson",
			slotId: "2",
			slotTiming: "9 AM - 10 AM",
			status: TOKEN_STATUS.SERVED,
			counterId: 3,
			counterName: "Counter 3",
			createdAt: new Date(),
			servedAt: new Date(),
		},
		{
			id: "4",
			tokenNumber: "T004",
			userId: "U004",
			userName: "Alice Brown",
			slotId: "2",
			slotTiming: "9 AM - 10 AM",
			status: TOKEN_STATUS.EXPIRED,
			createdAt: new Date(),
		},
		{
			id: "5",
			tokenNumber: "T005",
			userId: "U005",
			userName: "Charlie Wilson",
			slotId: "2",
			slotTiming: "9 AM - 10 AM",
			status: TOKEN_STATUS.ACTIVE,
			createdAt: new Date(),
		},
	]);

	const filteredTokens = selectedCounter
		? tokens.filter((token) => token.counterId === selectedCounter)
		: tokens;

	const getStatusBadge = (status: TokenStatus) => {
		const statusLabels: Record<TokenStatus, string> = {
			[TOKEN_STATUS.SERVING]: "Serving",
			[TOKEN_STATUS.SERVED]: "Served",
			[TOKEN_STATUS.ACTIVE]: "Active",
			[TOKEN_STATUS.EXPIRED]: "Expired",
		};

		const statusColors: Record<TokenStatus, string> = {
			[TOKEN_STATUS.SERVING]: "#e0f2fe", // Light blue
			[TOKEN_STATUS.ACTIVE]: "#fef9c3", // Light yellow
			[TOKEN_STATUS.SERVED]: "#dcfce7", // Light green
			[TOKEN_STATUS.EXPIRED]: "#fee2e2", // Light red
		};

		return (
			<span
				className={styles.statusBadge}
				style={{
					backgroundColor: statusColors[status],
					color: "black", // Always black text
				}}
			>
				{statusLabels[status]}
			</span>
		);
	};

	const handleStatusUpdate = (tokenId: string, newStatus: TokenStatus, counterId?: number) => {
		setTokens((prevTokens) =>
			prevTokens.map((token) => {
				if (token.id === tokenId) {
					const updatedToken = { ...token, status: newStatus };

					if (counterId) {
						const counter = COUNTERS.find((c) => c.id === counterId);
						updatedToken.counterId = counterId;
						updatedToken.counterName = counter?.name || `Counter ${counterId}`;
					}

					if (newStatus === TOKEN_STATUS.SERVED) {
						updatedToken.servedAt = new Date();
					}

					return updatedToken;
				}
				return token;
			})
		);

		console.log(
			`Updated token ${tokenId} to status: ${newStatus}`,
			counterId ? `with counter: ${counterId}` : ""
		);
	};

	const handleAssignCounter = (tokenId: string, counterId: string) => {
		if (!counterId) return;

		const counterNum = parseInt(counterId, 10); // FIXED: Added radix parameter
		handleStatusUpdate(tokenId, TOKEN_STATUS.SERVING, counterNum);
	};

	const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			action();
		}
	};

	return (
		<div className={styles.container}>
			{/* Counter Filter */}
			<div className={styles.counterFilter}>
				<button
					onClick={() => setSelectedCounter(null)}
					onKeyDown={(e) => handleKeyDown(e, () => setSelectedCounter(null))}
					className={`${styles.counterButton} ${selectedCounter === null ? styles.active : ""}`}
				>
					All Counters
				</button>
				{COUNTERS.map((counter) => (
					<button
						key={counter.id}
						onClick={() => setSelectedCounter(counter.id)}
						onKeyDown={(e) => handleKeyDown(e, () => setSelectedCounter(counter.id))}
						className={`${styles.counterButton} ${selectedCounter === counter.id ? styles.active : ""}`}
					>
						{counter.name}
					</button>
				))}
			</div>

			{/* Tokens Table */}
			<div className={styles.tableContainer}>
				<table className={styles.table}>
					<thead>
						<tr>
							<th className={styles.th}>Token No.</th>
							<th className={styles.th}>User</th>
							<th className={styles.th}>Slot</th>
							<th className={styles.th}>Counter</th>
							<th className={styles.th}>Status</th>
							<th className={styles.th}>Actions</th>
						</tr>
					</thead>
					<tbody>
						{filteredTokens.map((token) => (
							<tr key={token.id} className={styles.tr}>
								<td className={styles.td}>
									<div className={styles.tokenCell}>
										<span className={styles.tokenNumber}>{token.tokenNumber}</span>
										<span className={styles.tokenTime} suppressHydrationWarning>
											{mounted
												? token.createdAt.toLocaleTimeString([], {
														hour: "2-digit",
														minute: "2-digit",
													})
												: ""}
										</span>
									</div>
								</td>
								<td className={styles.td}>
									<div className={styles.userCell}>
										<div className={styles.userAvatar}>{token.userName.charAt(0)}</div>
										<div>
											<div className={styles.userName}>{token.userName}</div>
											<div className={styles.userId}>ID: {token.userId}</div>
										</div>
									</div>
								</td>
								<td className={styles.td}>
									<div className={styles.slotCell}>
										<span className={styles.slotTiming}>{token.slotTiming}</span>
									</div>
								</td>
								<td className={styles.td}>
									{token.counterName ? (
										<span className={styles.counterTag}>{token.counterName}</span>
									) : (
										<span className={styles.unassigned}>Unassigned</span>
									)}
								</td>
								<td className={styles.td}>{getStatusBadge(token.status)}</td>
								<td className={styles.td}>
									<div className={styles.actionButtons}>
										{token.status === TOKEN_STATUS.ACTIVE && (
											<button
												onClick={() => handleStatusUpdate(token.id, TOKEN_STATUS.SERVING)}
												onKeyDown={(e) =>
													handleKeyDown(e, () => handleStatusUpdate(token.id, TOKEN_STATUS.SERVING))
												}
												className={styles.actionButton}
											>
												Start Serving
											</button>
										)}
										{token.status === TOKEN_STATUS.SERVING && (
											<button
												onClick={() => handleStatusUpdate(token.id, TOKEN_STATUS.SERVED)}
												onKeyDown={(e) =>
													handleKeyDown(e, () => handleStatusUpdate(token.id, TOKEN_STATUS.SERVED))
												}
												className={`${styles.actionButton} ${styles.servedButton}`}
											>
												Mark Served
											</button>
										)}
										{!token.counterId && token.status !== TOKEN_STATUS.EXPIRED && (
											<select
												onChange={(e) => handleAssignCounter(token.id, e.target.value)}
												className={styles.counterSelect}
												defaultValue=""
											>
												<option value="">Assign Counter</option>
												{COUNTERS.map((counter) => (
													<option key={counter.id} value={counter.id}>
														{counter.name}
													</option>
												))}
											</select>
										)}
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{/* Summary Stats */}
			<div className={styles.summary}>
				<div className={styles.summaryItem}>
					<span className={styles.summaryLabel}>Total Tokens:</span>
					<span className={styles.summaryValue}>{tokens.length}</span>
				</div>
				<div className={styles.summaryItem}>
					<span className={styles.summaryLabel}>Serving:</span>
					<span className={styles.summaryValue}>
						{tokens.filter((t) => t.status === TOKEN_STATUS.SERVING).length}
					</span>
				</div>
				<div className={styles.summaryItem}>
					<span className={styles.summaryLabel}>Active:</span>
					<span className={styles.summaryValue}>
						{tokens.filter((t) => t.status === TOKEN_STATUS.ACTIVE).length}
					</span>
				</div>
				<div className={styles.summaryItem}>
					<span className={styles.summaryLabel}>Served:</span>
					<span className={styles.summaryValue}>
						{tokens.filter((t) => t.status === TOKEN_STATUS.SERVED).length}
					</span>
				</div>
			</div>
		</div>
	);
}
