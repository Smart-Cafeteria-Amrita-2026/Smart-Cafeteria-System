interface Props {
	onBookings: () => void;
	onTransactions: () => void;
	onLogout: () => void;
}

export function ProfileActions({ onBookings, onTransactions, onLogout }: Props) {
	return (
		<div className="mt-6 space-y-3">
			<button onClick={onBookings} className="w-full btn-primary">
				My Bookings
			</button>

			<button onClick={onTransactions} className="w-full btn-secondary">
				Transactions
			</button>

			<button onClick={onLogout} className="w-full btn-danger">
				Logout
			</button>
		</div>
	);
}
