import { User } from 'lucide-react';

interface Props {
    name: string;
    email: string;
}

export function ProfileHeader({ name, email }: Props) {
    return (
        <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border">
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 h-32 w-32 rounded-full bg-blue-50 opacity-50" />

            <div className="relative flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-200">
                    <User size={32} />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-900">{name}</h2>
                    <p className="text-sm font-medium text-gray-500">{email}</p>
                </div>
            </div>
        </div>
    );
}
