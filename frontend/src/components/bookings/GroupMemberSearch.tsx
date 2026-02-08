"use client";

import { useState, useRef, useEffect } from "react";
import { useSearchUsers } from "@/src/hooks/useBooking";
import { useBookingStore } from "@/src/stores/booking.store";
import type { UserSearchResult } from "@/src/types/booking.types";
import { Search, Trash2, Users, X, Loader2 } from "lucide-react";

export function GroupMemberSearch() {
	const [searchQuery, setSearchQuery] = useState("");
	const [debouncedQuery, setDebouncedQuery] = useState("");
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	const { groupMembers, addGroupMember, removeGroupMember } = useBookingStore();
	const { data: searchResults, isLoading, isFetching } = useSearchUsers(debouncedQuery);

	// Debounce the search input (300ms)
	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedQuery(searchQuery.trim());
		}, 300);
		return () => clearTimeout(timer);
	}, [searchQuery]);

	// Open dropdown when there are results
	useEffect(() => {
		if (debouncedQuery.length >= 2 && searchResults && searchResults.length > 0) {
			setIsDropdownOpen(true);
		}
	}, [debouncedQuery, searchResults]);

	// Close dropdown on outside click
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setIsDropdownOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const handleSelectUser = (user: UserSearchResult) => {
		addGroupMember(user);
		setSearchQuery("");
		setDebouncedQuery("");
		setIsDropdownOpen(false);
		inputRef.current?.focus();
	};

	const isAlreadyAdded = (userId: string) => groupMembers.some((m) => m.id === userId);

	// Filter out already-added members from search results
	const filteredResults = searchResults?.filter((user) => !isAlreadyAdded(user.id)) ?? [];

	return (
		<div className="rounded-2xl border bg-white p-6 shadow-sm space-y-4">
			<div className="flex items-center gap-3 border-b pb-3">
				<div className="bg-blue-50 p-2 rounded-xl">
					<Users size={20} className="text-blue-600" />
				</div>
				<div>
					<h3 className="text-lg font-bold text-gray-800">Add Members</h3>
					<p className="text-xs text-gray-400">Search by email to add group members</p>
				</div>
			</div>

			{/* Search Input */}
			<div className="relative" ref={dropdownRef}>
				<div className="relative">
					<Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
					<input
						ref={inputRef}
						type="text"
						placeholder="Search by email..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						onFocus={() => {
							if (filteredResults.length > 0) setIsDropdownOpen(true);
						}}
						className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-10 py-3 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
					/>
					{searchQuery && (
						<button
							onClick={() => {
								setSearchQuery("");
								setDebouncedQuery("");
								setIsDropdownOpen(false);
							}}
							className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
						>
							<X size={16} />
						</button>
					)}
				</div>

				{/* Loading indicator */}
				{isFetching && debouncedQuery.length >= 2 && (
					<div className="absolute right-10 top-1/2 -translate-y-1/2">
						<Loader2 size={16} className="animate-spin text-blue-500" />
					</div>
				)}

				{/* Search Results Dropdown */}
				{isDropdownOpen && debouncedQuery.length >= 2 && (
					<div className="absolute z-50 mt-1 w-full rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden max-h-60 overflow-y-auto">
						{isLoading ? (
							<div className="p-4 text-center text-sm text-gray-400">
								<Loader2 size={16} className="animate-spin inline mr-2" />
								Searching...
							</div>
						) : filteredResults.length > 0 ? (
							filteredResults.map((user) => (
								<button
									key={user.id}
									onClick={() => handleSelectUser(user)}
									className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-blue-50 transition-colors border-b last:border-0"
								>
									<div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold text-sm">
										{user.first_name[0]}
										{user.last_name[0]}
									</div>
									<div className="flex-1 min-w-0">
										<p className="text-sm font-semibold text-gray-900 truncate">
											{user.first_name} {user.last_name}
										</p>
										<p className="text-xs text-gray-500 truncate">{user.email}</p>
									</div>
									<span className="text-xs text-gray-400 font-mono">{user.college_id}</span>
								</button>
							))
						) : (
							<div className="p-4 text-center text-sm text-gray-400">
								No users found for &quot;{debouncedQuery}&quot;
							</div>
						)}
					</div>
				)}
			</div>

			{/* Selected Members */}
			{groupMembers.length > 0 && (
				<div className="space-y-2">
					<p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
						Selected Members ({groupMembers.length})
					</p>
					<div className="space-y-2">
						{groupMembers.map((member) => (
							<div
								key={member.id}
								className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 group hover:border-red-100 hover:bg-red-50/30 transition-colors"
							>
								<div className="flex items-center gap-3">
									<div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold text-xs">
										{member.first_name[0]}
										{member.last_name[0]}
									</div>
									<div>
										<p className="text-sm font-semibold text-gray-900">
											{member.first_name} {member.last_name}
										</p>
										<p className="text-xs text-gray-500">{member.email}</p>
									</div>
								</div>
								<button
									onClick={() => removeGroupMember(member.id)}
									className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-100 transition-colors"
									title="Remove member"
								>
									<Trash2 size={16} />
								</button>
							</div>
						))}
					</div>
				</div>
			)}

			{groupMembers.length === 0 && (
				<p className="text-center text-xs text-gray-400 py-2">
					No members added yet. Search by email to add group members.
				</p>
			)}

			<p className="text-[10px] text-gray-400">
				Members will receive a payment request on their dashboard. Max 5 additional members.
			</p>
		</div>
	);
}
