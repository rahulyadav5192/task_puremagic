import FrontendLayout from '@/Layouts/FrontendLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({ prod }) {
    return (
        <FrontendLayout>
            <Head title={prod.name} />

            <div className="py-12">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    <Link href={route('products.index')} className="mb-4 text-indigo-600 hover:text-indigo-800">
                        ← Back to Products
                    </Link>

                    <div className="overflow-hidden rounded-lg bg-white shadow-lg">
                        <div className="md:flex">
                            {prod.image && (
                                <div className="md:w-1/2">
                                    <img
                                        src={`/${prod.image}`}
                                        alt={prod.name}
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                            )}
                            <div className={`p-6 ${prod.image ? 'md:w-1/2' : 'w-full'}`}>
                                <h1 className="text-3xl font-bold text-gray-900">{prod.name}</h1>
                                <p className="mt-4 text-lg text-gray-600">{prod.desc}</p>
                                <div className="mt-6 flex items-center justify-between">
                                    <span className="text-3xl font-bold text-indigo-600">${prod.price}</span>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-500">Seller</p>
                                        <p className="font-semibold text-gray-900">{prod.seller?.name}</p>
                                        <p className="text-sm text-gray-500">{prod.seller?.email}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </FrontendLayout>
    );
}

