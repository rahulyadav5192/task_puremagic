import SidebarLayout from '@/Layouts/SidebarLayout';
import { Head, Link, router } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

export default function Index({ list, filters }) {
    const handleSearch = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        router.get(route('admin.users.index'), Object.fromEntries(formData), { preserveState: true });
    };

    const handleDelete = (id) => {
        if (confirm('Delete this user?')) {
            router.delete(route('admin.users.destroy', id));
        }
    };

    const getRoleBadgeColor = (role) => {
        switch (role) {
            case 'admin':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            case 'seller':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
            case 'buyer':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
        }
    };

    return (
        <SidebarLayout>
            <Head title="Users" />
            <div>
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Users</h2>
                    <Link href={route('admin.users.create')}>
                        <PrimaryButton>New User</PrimaryButton>
                    </Link>
                </div>

                <div className="bg-white shadow rounded-lg overflow-hidden dark:bg-gray-800">
                    <div className="p-6">
                        <form onSubmit={handleSearch} className="mb-6">
                            <div className="flex gap-4">
                                <TextInput
                                    name="q"
                                    placeholder="Search by name or email..."
                                    defaultValue={filters.q}
                                    className="flex-1"
                                />
                                <select
                                    name="role"
                                    defaultValue={filters.role || ''}
                                    className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                >
                                    <option value="">All Roles</option>
                                    <option value="buyer">Buyer</option>
                                    <option value="seller">Seller</option>
                                    <option value="admin">Admin</option>
                                </select>
                                <PrimaryButton type="submit">Search</PrimaryButton>
                            </div>
                        </form>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">Email</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">Role</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                                    {list.data.map((u) => (
                                        <tr key={u.id}>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{u.name}</td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{u.email}</td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(u.role)}`}>
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                                                <Link href={route('admin.users.edit', u.id)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400">
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(u.id)}
                                                    className="ml-4 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                            <div className="text-sm text-gray-700 dark:text-gray-300">
                                Showing {list.from} to {list.to} of {list.total} results
                            </div>
                            <div className="flex gap-2">
                                {list.links.map((link, idx) => (
                                    <Link
                                        key={idx}
                                        href={link.url || '#'}
                                        className={`px-3 py-2 rounded-md ${link.active ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'} ${!link.url && 'opacity-50 cursor-not-allowed'}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </SidebarLayout>
    );
}

