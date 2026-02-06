"use client";

import { useState } from "react";
import Navbar from "@/src/components/Navigation/Navbar";
import Image from "next/image";
import {
	User,
	Mail,
	Phone,
	Calendar,
	MapPin,
	Settings,
	Bell,
	Shield,
	CreditCard,
	LogOut,
	Edit2,
	Save,
	X,
	Briefcase,
	Users,
	Award,
	Clock,
	CheckCircle,
	Building,
	UserPlus,
	Camera,
} from "lucide-react";
import styles from "./page.module.css";

export default function ProfilePage() {
	const [activeTab, setActiveTab] = useState("profile");
	const [isEditing, setIsEditing] = useState(false);
	const [isUploading, setIsUploading] = useState(false);

	const [userData, setUserData] = useState({
		name: "John Doe",
		email: "john.doe@company.com",
		phone: "+1 (555) 123-4567",
		role: "Staff Manager",
		department: "Canteen Operations",
		joinDate: "2023-01-15",
		location: "New York, NY",
		employeeId: "EMP202315",
		bio: "Experienced canteen manager with 5+ years of experience in food service operations. Passionate about creating efficient systems and delivering excellent customer service.",
		skills: ["Team Management", "Inventory Control", "Customer Service", "Food Safety"],
	});

	const [editData, setEditData] = useState({ ...userData });
	const [profileImage, setProfileImage] = useState<string | null>(null);

	const tabs = [
		{ id: "profile", label: "Profile", icon: <User size={20} />, color: "var(--color-primary)" },
		{
			id: "settings",
			label: "Settings",
			icon: <Settings size={20} />,
			color: "var(--color-success)",
		},
		{
			id: "security",
			label: "Security",
			icon: <Shield size={20} />,
			color: "var(--color-warning)",
		},
		{
			id: "notifications",
			label: "Notifications",
			icon: <Bell size={20} />,
			color: "var(--color-info)",
		},
	];

	const stats = [
		{
			label: "Total Bookings",
			value: "1,247",
			icon: <Users size={20} />,
			color: "var(--color-primary)",
		},
		{
			label: "Satisfaction Rate",
			value: "98%",
			icon: <Award size={20} />,
			color: "var(--color-success)",
		},
		{
			label: "Avg. Response Time",
			value: "2.4m",
			icon: <Clock size={20} />,
			color: "var(--color-warning)",
		},
		{
			label: "Tasks Completed",
			value: "89%",
			icon: <CheckCircle size={20} />,
			color: "var(--color-info)",
		},
	];

	const handleEdit = () => {
		setEditData({ ...userData });
		setIsEditing(true);
	};

	const handleSave = () => {
		setUserData({ ...editData });
		setIsEditing(false);
	};

	const handleCancel = () => {
		setIsEditing(false);
	};

	const handleInputChange = (field: string, value: string) => {
		setEditData((prev) => ({ ...prev, [field]: value }));
	};

	const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setIsUploading(true);
			// Simulate upload
			setTimeout(() => {
				const reader = new FileReader();
				reader.onloadend = () => {
					setProfileImage(reader.result as string);
					setIsUploading(false);
				};
				reader.readAsDataURL(file);
			}, 1000);
		}
	};

	const handleRemoveSkill = (skillToRemove: string) => {
		setEditData((prev) => ({
			...prev,
			skills: prev.skills.filter((skill) => skill !== skillToRemove),
		}));
	};

	const handleAddSkill = () => {
		const newSkill = prompt("Enter new skill:");
		if (newSkill && !editData.skills.includes(newSkill)) {
			setEditData((prev) => ({
				...prev,
				skills: [...prev.skills, newSkill],
			}));
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			action();
		}
	};

	const renderProfileContent = () => {
		if (isEditing) {
			return (
				<div className={styles.profileSection}>
					<div className={styles.sectionHeader}>
						<h2 className={styles.sectionTitle}>Edit Profile</h2>
						<div className={styles.editActions}>
							<button
								onClick={handleCancel}
								onKeyDown={(e) => handleKeyDown(e, handleCancel)}
								className={styles.cancelButton}
							>
								<X size={18} />
								Cancel
							</button>
							<button
								onClick={handleSave}
								onKeyDown={(e) => handleKeyDown(e, handleSave)}
								className={styles.saveButton}
							>
								<Save size={18} />
								Save Changes
							</button>
						</div>
					</div>

					<div className={styles.editForm}>
						{/* Profile Image Upload */}
						<div className={styles.imageUploadSection}>
							<div className={styles.avatarContainer}>
								<div className={styles.avatarPreview}>
									{profileImage ? (
										<Image
											src={profileImage}
											alt="Profile"
											width={96}
											height={96}
											className={styles.avatarImage}
										/>
									) : (
										<User size={48} />
									)}
									{isUploading && <div className={styles.uploadingOverlay}>Uploading...</div>}
								</div>
								<label
									htmlFor="profileImageUpload"
									className={styles.uploadButton}
									onKeyDown={(e) =>
										handleKeyDown(e, () => {
											const input = document.getElementById(
												"profileImageUpload"
											) as HTMLInputElement;
											input?.click();
										})
									}
								>
									<Camera size={20} />
									Change Photo
								</label>
								<input
									id="profileImageUpload"
									type="file"
									accept="image/*"
									onChange={handleImageUpload}
									className={styles.fileInput}
								/>
							</div>
						</div>

						{/* Form Grid */}
						<div className={styles.formGrid}>
							<div className={styles.formGroup}>
								<label htmlFor="fullName" className={styles.formLabel}>
									Full Name
								</label>
								<input
									id="fullName"
									type="text"
									value={editData.name}
									onChange={(e) => handleInputChange("name", e.target.value)}
									className={styles.formInput}
								/>
							</div>
							<div className={styles.formGroup}>
								<label htmlFor="email" className={styles.formLabel}>
									Email
								</label>
								<input
									id="email"
									type="email"
									value={editData.email}
									onChange={(e) => handleInputChange("email", e.target.value)}
									className={styles.formInput}
								/>
							</div>
							<div className={styles.formGroup}>
								<label htmlFor="phone" className={styles.formLabel}>
									Phone
								</label>
								<input
									id="phone"
									type="tel"
									value={editData.phone}
									onChange={(e) => handleInputChange("phone", e.target.value)}
									className={styles.formInput}
								/>
							</div>
							<div className={styles.formGroup}>
								<label htmlFor="location" className={styles.formLabel}>
									Location
								</label>
								<input
									id="location"
									type="text"
									value={editData.location}
									onChange={(e) => handleInputChange("location", e.target.value)}
									className={styles.formInput}
								/>
							</div>
							<div className={styles.formGroup}>
								<label htmlFor="role" className={styles.formLabel}>
									Role
								</label>
								<select
									id="role"
									value={editData.role}
									onChange={(e) => handleInputChange("role", e.target.value)}
									className={styles.formSelect}
								>
									<option value="Staff Manager">Staff Manager</option>
									<option value="Supervisor">Supervisor</option>
									<option value="Canteen Staff">Canteen Staff</option>
									<option value="Operations Head">Operations Head</option>
								</select>
							</div>
							<div className={styles.formGroup}>
								<label htmlFor="department" className={styles.formLabel}>
									Department
								</label>
								<select
									id="department"
									value={editData.department}
									onChange={(e) => handleInputChange("department", e.target.value)}
									className={styles.formSelect}
								>
									<option value="Canteen Operations">Canteen Operations</option>
									<option value="Food Service">Food Service</option>
									<option value="Administration">Administration</option>
									<option value="Management">Management</option>
								</select>
							</div>
							<div className={`${styles.formGroup} ${styles.fullWidth}`}>
								<label htmlFor="bio" className={styles.formLabel}>
									Bio
								</label>
								<textarea
									id="bio"
									value={editData.bio}
									onChange={(e) => handleInputChange("bio", e.target.value)}
									className={styles.formTextarea}
									rows={4}
								/>
							</div>

							{/* Skills Section */}
							<div className={`${styles.formGroup} ${styles.fullWidth}`}>
								<div className={styles.skillsHeader}>
									<label htmlFor="skillInput" className={styles.formLabel}>
										Skills
									</label>
									<button
										id="skillInput"
										type="button"
										onClick={handleAddSkill}
										onKeyDown={(e) => handleKeyDown(e, handleAddSkill)}
										className={styles.addSkillButton}
									>
										<UserPlus size={16} />
										Add Skill
									</button>
								</div>
								<div className={styles.skillsContainer}>
									{editData.skills.map((skill, index) => (
										<span key={index} className={styles.skillTag}>
											{skill}
											<button
												type="button"
												onClick={() => handleRemoveSkill(skill)}
												onKeyDown={(e) => {
													if (e.key === "Enter" || e.key === " ") {
														e.stopPropagation();
														handleRemoveSkill(skill);
													}
												}}
												className={styles.removeSkillButton}
												aria-label={`Remove skill ${skill}`}
											>
												×
											</button>
										</span>
									))}
								</div>
							</div>
						</div>
					</div>
				</div>
			);
		}

		return (
			<div className={styles.profileSection}>
				<div className={styles.sectionHeader}>
					<h2 className={styles.sectionTitle}>Personal Information</h2>
					<button
						onClick={handleEdit}
						onKeyDown={(e) => handleKeyDown(e, handleEdit)}
						className={styles.editProfileButton}
					>
						<Edit2 size={18} />
						Edit Profile
					</button>
				</div>

				<div className={styles.infoGrid}>
					<div className={`${styles.infoCard} ${styles.primaryCard}`}>
						<User className={styles.infoIcon} />
						<div className={styles.infoContent}>
							<label htmlFor="displayName" className={styles.infoLabel}>
								Full Name
							</label>
							<p id="displayName" className={styles.infoValue}>
								{userData.name}
							</p>
						</div>
					</div>
					<div className={`${styles.infoCard} ${styles.successCard}`}>
						<Mail className={styles.infoIcon} />
						<div className={styles.infoContent}>
							<label htmlFor="displayEmail" className={styles.infoLabel}>
								Email
							</label>
							<p id="displayEmail" className={styles.infoValue}>
								{userData.email}
							</p>
						</div>
					</div>
					<div className={`${styles.infoCard} ${styles.warningCard}`}>
						<Phone className={styles.infoIcon} />
						<div className={styles.infoContent}>
							<label htmlFor="displayPhone" className={styles.infoLabel}>
								Phone
							</label>
							<p id="displayPhone" className={styles.infoValue}>
								{userData.phone}
							</p>
						</div>
					</div>
					<div className={`${styles.infoCard} ${styles.infoCardStyle}`}>
						<MapPin className={styles.infoIcon} />
						<div className={styles.infoContent}>
							<label htmlFor="displayLocation" className={styles.infoLabel}>
								Location
							</label>
							<p id="displayLocation" className={styles.infoValue}>
								{userData.location}
							</p>
						</div>
					</div>
					<div className={`${styles.infoCard} ${styles.primaryCard}`}>
						<Building className={styles.infoIcon} />
						<div className={styles.infoContent}>
							<label htmlFor="displayEmployeeId" className={styles.infoLabel}>
								Employee ID
							</label>
							<p id="displayEmployeeId" className={styles.infoValue}>
								{userData.employeeId}
							</p>
						</div>
					</div>
					<div className={`${styles.infoCard} ${styles.successCard}`}>
						<Calendar className={styles.infoIcon} />
						<div className={styles.infoContent}>
							<label htmlFor="displayJoinDate" className={styles.infoLabel}>
								Join Date
							</label>
							<p id="displayJoinDate" className={styles.infoValue}>
								{userData.joinDate}
							</p>
						</div>
					</div>
				</div>

				{/* Bio Section */}
				<div className={styles.bioSection}>
					<h3 className={styles.sectionSubtitle}>About</h3>
					<p className={styles.bioText}>{userData.bio}</p>
				</div>

				{/* Skills Section */}
				<div className={styles.skillsSection}>
					<h3 className={styles.sectionSubtitle}>Skills & Expertise</h3>
					<div className={styles.skillsGrid}>
						{userData.skills.map((skill, index) => (
							<span key={index} className={styles.skillBadge}>
								{skill}
							</span>
						))}
					</div>
				</div>

				<div className={styles.sectionDivider} />

				<div className={styles.workSection}>
					<h2 className={styles.sectionTitle}>Work Information</h2>
					<div className={styles.workGrid}>
						<div className={styles.workCard}>
							<Briefcase className={styles.workIcon} />
							<div className={styles.workContent}>
								<label htmlFor="displayDepartment" className={styles.workLabel}>
									Department
								</label>
								<p id="displayDepartment" className={styles.workValue}>
									{userData.department}
								</p>
							</div>
						</div>
						<div className={styles.workCard}>
							<User className={styles.workIcon} />
							<div className={styles.workContent}>
								<label htmlFor="displayRole" className={styles.workLabel}>
									Role
								</label>
								<p id="displayRole" className={styles.workValue}>
									{userData.role}
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	};

	const renderTabContent = () => {
		switch (activeTab) {
			case "profile":
				return renderProfileContent();
			case "settings":
				return (
					<div className={styles.settingsSection}>
						<h2 className={styles.sectionTitle}>Account Settings</h2>
						<p>Settings content here...</p>
					</div>
				);
			case "security":
				return (
					<div className={styles.settingsSection}>
						<h2 className={styles.sectionTitle}>Security Settings</h2>
						<p>Security content here...</p>
					</div>
				);
			case "notifications":
				return (
					<div className={styles.settingsSection}>
						<h2 className={styles.sectionTitle}>Notification Preferences</h2>
						<p>Notification settings here...</p>
					</div>
				);
			default:
				return renderProfileContent();
		}
	};

	return (
		<div className={styles.container}>
			<Navbar />
			<div className={styles.content}>
				<div className={styles.header}>
					<h1 className={styles.title}>My Profile</h1>
					<p className={styles.subtitle}>Manage your account settings and preferences</p>
				</div>

				<div className={styles.profileLayout}>
					{/* Sidebar */}
					<div className={styles.sidebar}>
						<div className={styles.profileCard}>
							<div className={styles.avatarContainer}>
								<div className={styles.avatarLarge}>
									{profileImage ? (
										<Image
											src={profileImage}
											alt="Profile"
											width={96}
											height={96}
											className={styles.avatarImage}
										/>
									) : (
										<User size={48} />
									)}
								</div>
								<div className={styles.onlineIndicator} />
							</div>
							<h3 className={styles.userName}>{userData.name}</h3>
							<p className={styles.userRole}>{userData.role}</p>
							<p className={styles.userDepartment}>
								<Building size={14} />
								{userData.department}
							</p>

							{/* Stat cards - non-interactive */}
							<div className={styles.userStatsGrid}>
								{stats.map((stat, index) => (
									<div key={index} className={styles.statCard}>
										<div
											className={styles.statIconWrapper}
											style={{ backgroundColor: `${stat.color}15` }}
										>
											{stat.icon}
										</div>
										<div className={styles.statContent}>
											<span className={styles.statNumber}>{stat.value}</span>
											<span className={styles.statLabel}>{stat.label}</span>
										</div>
									</div>
								))}
							</div>
						</div>

						<nav className={styles.tabNavigation}>
							{tabs.map((tab) => (
								<button
									key={tab.id}
									onClick={() => setActiveTab(tab.id)}
									onKeyDown={(e) => handleKeyDown(e, () => setActiveTab(tab.id))}
									className={`${styles.tabButton} ${activeTab === tab.id ? styles.activeTab : ""}`}
									style={
										{
											"--tab-color": tab.color,
										} as React.CSSProperties
									}
								>
									<span className={styles.tabIcon}>{tab.icon}</span>
									<span className={styles.tabLabel}>{tab.label}</span>
									{activeTab === tab.id && <div className={styles.tabIndicator} />}
								</button>
							))}
						</nav>

						<button
							className={styles.logoutButton}
							onClick={() => {}}
							onKeyDown={(e) => handleKeyDown(e, () => {})}
						>
							<LogOut size={18} />
							<span>Logout</span>
						</button>
					</div>

					{/* Main Content */}
					<div className={styles.mainContent}>{renderTabContent()}</div>
				</div>
			</div>
		</div>
	);
}
