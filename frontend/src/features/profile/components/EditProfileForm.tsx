import { Save, ArrowLeft } from 'lucide-react';

interface Props {
    name: string;
    email: string;
    setName: (name: string) => void;
    setEmail: (email: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    onBack: () => void;
    isLoading?: boolean;
}

export function EditProfileForm({
    name,
    email,
    setName,
    setEmail,
    onSubmit,
    onBack,
    isLoading,
}: Props) {
    return (
        <div className="mx-auto max-w-xl p-4 space-y-6">
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={onBack}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    type="button"
                >
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
            </div>

            <form onSubmit={onSubmit} className="bg-white rounded-2xl border p-6 shadow-sm space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Full Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full rounded-xl border p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        required
                        disabled={isLoading}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Email Address</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-xl border p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        required
                        disabled={isLoading}
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 p-4 font-bold text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                    <Save size={20} />
                    {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
            </form>
        </div>
    );
}
