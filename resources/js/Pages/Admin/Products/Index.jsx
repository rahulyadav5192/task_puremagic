import SidebarLayout from '@/Layouts/SidebarLayout';
import { Head, Link, router } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

export default function Index({ list, sellers, filters }) {
    const handleSearch = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        router.get(route('admin.products.index'), Object.fromEntries(formData), { preserveState: true });
    };

    const handleDelete = (id) => {
        if (confirm('Delete this product?')) {
            router.delete(route('admin.products.destroy', id));
        }
    };

    return (
        <SidebarLayout>
            <Head title="Products" />
            <div>
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Products</h2>
                    <Link href={route('admin.products.create')}>
                        <PrimaryButton>New Product</PrimaryButton>
                    </Link>
                </div>

                <div className="bg-white shadow rounded-lg overflow-hidden dark:bg-gray-800">
                    <div className="p-6">
                        <form onSubmit={handleSearch} className="mb-6 flex gap-4">
                            <TextInput name="q" placeholder="Search..." defaultValue={filters.q} className="flex-1" />
                            <select name="seller_id" defaultValue={filters.seller_id} className="rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-indigo-600 dark:focus:ring-indigo-600">
                                <option value="">All Sellers</option>
                                {sellers.map((s) => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                            </select>
                            <PrimaryButton type="submit">Filter</PrimaryButton>
                        </form>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">Image</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">Price</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">Seller</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                                    {list.data.map((p) => (
                                        <tr key={p.id}>
                                            <td className="whitespace-nowrap px-6 py-4">
                                                {p.image ? (
                                                    <img
                                                        src={`/${p.image}`}
                                                        alt={p.name}
                                                        className="h-16 w-16 rounded-lg object-cover"
                                                    />
                                                ) : (
                                                    <div className="h-16 w-16 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                                        <span className="text-xs text-gray-400">No image</span>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{p.name}</td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-gray-100">${p.price}</td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{p.seller?.name}</td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                                                <Link href={route('admin.products.edit', p.id)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400">
                                                    Edit
                                                </Link>
                                                <button onClick={() => handleDelete(p.id)} className="ml-4 text-red-600 hover:text-red-900 dark:text-red-400">
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
