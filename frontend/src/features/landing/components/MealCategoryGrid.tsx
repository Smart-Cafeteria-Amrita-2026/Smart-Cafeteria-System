import Image from 'next/image';
import Link from 'next/link';

const meals = [
    {
        id: 'breakfast',
        title: 'Breakfast',
        caption: 'Start your day fresh & energized',
        image: '/assets/meals/breakfast.jpg',
        href: '/slots?type=breakfast',
    },
    {
        id: 'lunch',
        title: 'Lunch',
        caption: 'Hearty meals to power your day',
        image: '/assets/meals/lunch.jpg',
        href: '/slots?type=lunch',
    },
    {
        id: 'snacks',
        title: 'Snacks',
        caption: 'Quick bites for short breaks',
        image: '/assets/meals/snacks.jpg',
        href: '/slots?type=snacks',
    },
    {
        id: 'dinner',
        title: 'Dinner',
        caption: 'End your day with comfort food',
        image: '/assets/meals/dinner.jpg',
        href: '/slots?type=dinner',
    },
];

export function MealCategoryGrid() {
    return (
        <section className="bg-blue-600 py-24">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-semibold text-center text-white mb-14">
                    Explore Meals
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                    {meals.map((meal) => (
                        <Link
                            key={meal.id}
                            href={meal.href}
                            className="bg-white rounded-2xl p-6 text-center hover:scale-[1.03] transition"
                        >
                            <div className="relative h-32 w-full mb-4">
                                <Image
                                    src={meal.image}
                                    alt={meal.title}
                                    fill
                                    className="object-contain"
                                />
                            </div>

                            <h3 className="text-lg font-semibold text-blue-600">
                                {meal.title}
                            </h3>

                            <p className="mt-2 text-sm text-gray-600">
                                {meal.caption}
                            </p>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
