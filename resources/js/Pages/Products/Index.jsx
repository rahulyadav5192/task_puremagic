import FrontendLayout from '@/Layouts/FrontendLayout';
import { Head, Link, router } from '@inertiajs/react';
import TextInput from '@/Components/TextInput';

export default function Index({ list, sellers, filters }) {
    const handleSearch = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        router.get(route('products.index'), Object.fromEntries(formData), { preserveState: true });
    };

    return (
        <FrontendLayout>
            <Head title="Products" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <form onSubmit={handleSearch} className="flex gap-4">
                            <TextInput
                                name="q"
                                placeholder="Search products..."
                                defaultValue={filters.q}
                                className="flex-1"
                            />
                            <select
                                name="seller_id"
                                defaultValue={filters.seller_id}
                                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            >
                                <option value="">All Sellers</option>
                                {sellers.map((s) => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                            </select>
                            <button
                                type="submit"
                                className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
                            >
                                Filter
                            </button>
                        </form>
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {list.data.map((p) => (
                            <Link
                                key={p.id}
                                href={route('products.show', p.id)}
                                className="overflow-hidden rounded-lg bg-white shadow transition hover:shadow-lg"
                            >
                                {p.image && (
                                    <img
                                        src={`/${p.image}`}
                                        alt={p.name}
                                        className="h-48 w-full object-cover"
                                    />
                                )}
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold text-gray-900">{p.name}</h3>
                                    <p className="mt-2 text-sm text-gray-600 line-clamp-2">{p.desc}</p>
                                    <div className="mt-4 flex items-center justify-between">
                                        <span className="text-xl font-bold text-indigo-600">${p.price}</span>
                                        <span className="text-sm text-gray-500">by {p.seller?.name}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {list.last_page > 1 && (
                        <div className="mt-6 flex justify-center gap-2">
                            {list.links.map((link, idx) => (
                                <Link
                                    key={idx}
                                    href={link.url || '#'}
                                    className={`px-3 py-2 rounded-md ${link.active ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'} ${!link.url && 'opacity-50 cursor-not-allowed'}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </FrontendLayout>
    );
}

