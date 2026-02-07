export function LandingInfo() {
	return (
		<section className="bg-white py-28">
			<div className="container mx-auto px-4">
				<h2 className="text-3xl font-semibold text-center text-blue-600 mb-16">
					Why Smart Cafeteria?
				</h2>

				<div className="grid gap-10 md:grid-cols-3">
					<div className="border rounded-2xl p-8 text-center">
						<h3 className="text-lg font-semibold text-blue-600 mb-3">Pre-book Meals</h3>
						<p className="text-gray-600 text-sm leading-relaxed">
							Plan your meals in advance and skip long queues. Smart pre-booking ensures
							availability and saves your valuable time.
						</p>
					</div>

					<div className="border rounded-2xl p-8 text-center">
						<h3 className="text-lg font-semibold text-blue-600 mb-3">Reduce Food Wastage</h3>
						<p className="text-gray-600 text-sm leading-relaxed">
							Demand forecasting helps the cafeteria prepare the right quantity of food, minimizing
							waste and promoting sustainability.
						</p>
					</div>

					<div className="border rounded-2xl p-8 text-center">
						<h3 className="text-lg font-semibold text-blue-600 mb-3">Efficient Operations</h3>
						<p className="text-gray-600 text-sm leading-relaxed">
							Smooth coordination between students, staff, and administrators results in faster
							service and better management.
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}
