import FrontendLayout from '@/Layouts/FrontendLayout';
import { Head, Link, router } from '@inertiajs/react';
import TextInput from '@/Components/TextInput';
import { useState, useEffect, useRef } from 'react';

export default function Home({ list, sellers, filters }) {
    const [addingToCart, setAddingToCart] = useState({});
    const [addedToCart, setAddedToCart] = useState({});
    const [searchQuery, setSearchQuery] = useState(filters.q || '');
    const [selectedSeller, setSelectedSeller] = useState(filters.seller_id || '');
    const searchTimeoutRef = useRef(null);

    useEffect(() => {
        if (window.location.hash === '#testimonials') {
            setTimeout(() => {
                const element = document.getElementById('testimonials');
                if (element) {
                    const offset = 80;
                    const elementPosition = element.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - offset;
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }, 200);
        }
    }, []);

    useEffect(() => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        searchTimeoutRef.current = setTimeout(() => {
            const scrollPosition = window.scrollY;
            router.get(route('home'), {
                q: searchQuery || null,
                seller_id: selectedSeller || null,
            }, {
                preserveState: true,
                preserveScroll: true,
                replace: true,
                onSuccess: () => {
                    requestAnimationFrame(() => {
                        window.scrollTo(0, scrollPosition);
                    });
                },
            });
        }, 300);

        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, [searchQuery, selectedSeller]);

    const addToCart = (productId) => {
        setAddingToCart({ ...addingToCart, [productId]: true });
        router.post(
            route('cart.store'),
            { product_id: productId, quantity: 1 },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setAddingToCart({ ...addingToCart, [productId]: false });
                    setAddedToCart({ ...addedToCart, [productId]: true });
                    setTimeout(() => {
                        setAddedToCart({ ...addedToCart, [productId]: false });
                    }, 2000);
                },
                onFinish: () => {
                    setAddingToCart({ ...addingToCart, [productId]: false });
                },
            }
        );
    };

    return (
        <FrontendLayout>
            <Head title="Home" />

            <div className="relative overflow-hidden py-40">
                <div className="absolute inset-0">
                    <img
                        src="/heroimg.webp"
                        alt="Hero"
                        className="h-full w-full object-cover"
                    />
                </div>
                <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center py-20">
                        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl drop-shadow-lg">
                            Welcome to Our Store
                        </h1>
                        <p className="mt-6 text-lg leading-8 text-white drop-shadow-md">
                            Discover amazing products from trusted sellers
                        </p>
                    </div>
                </div>
            </div>

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <div className="flex gap-4">
                            <TextInput
                                name="q"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="flex-1"
                            />
                            <select
                                name="seller_id"
                                value={selectedSeller}
                                onChange={(e) => setSelectedSeller(e.target.value)}
                                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            >
                                <option value="">All Sellers</option>
                                {sellers.map((s) => (
                                    <option key={s.id} value={s.id}>
                                        {s.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {list.data.map((p) => (
                            <div
                                key={p.id}
                                className="group relative overflow-hidden rounded-lg bg-white shadow-md transition hover:shadow-xl"
                            >
                                {p.image && (
                                    <div className="aspect-h-1 aspect-w-1 overflow-hidden bg-gray-200">
                                        <img
                                            src={`/storage/${p.image}`}
                                            alt={p.name}
                                            className="h-64 w-full object-cover transition group-hover:scale-105"
                                        />
                                    </div>
                                )}
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold text-gray-900">{p.name}</h3>
                                    <p className="mt-2 text-sm text-gray-600 line-clamp-2">{p.desc}</p>
                                    <div className="mt-4 flex items-center justify-between">
                                        <span className="text-2xl font-bold text-indigo-600">${p.price}</span>
                                        <button
                                            onClick={() => addToCart(p.id)}
                                            disabled={addingToCart[p.id] || addedToCart[p.id]}
                                            className={`rounded-full p-2 text-white transition-all duration-300 ${
                                                addedToCart[p.id]
                                                    ? 'bg-green-500 scale-110'
                                                    : 'bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50'
                                            }`}
                                        >
                                            {addingToCart[p.id] ? (
                                                <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                            ) : addedToCart[p.id] ? (
                                                <svg className="h-5 w-5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            ) : (
                                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                    <p className="mt-2 text-xs text-gray-500">by {p.seller?.name}</p>
                                </div>
                            </div>
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

            <div id="testimonials" className="bg-gray-50 py-16 scroll-mt-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900">What Our Customers Say</h2>
                        <p className="mt-4 text-lg text-gray-600">Don't just take our word for it</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <div className="flex items-center mb-4">
                                <div className="flex text-yellow-400">
                                    {[...Array(5)].map((_, i) => (
                                        <svg key={i} className="h-5 w-5 fill-current" viewBox="0 0 20 20">
                                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                                        </svg>
                                    ))}
                                </div>
                            </div>
                            <p className="text-gray-700 mb-4">
                                "Amazing shopping experience! Found exactly what I was looking for and the quality exceeded my expectations."
                            </p>
                            <div className="flex items-center">
                                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                    <span className="text-indigo-600 font-semibold">JD</span>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-semibold text-gray-900">John Doe</p>
                                    <p className="text-sm text-gray-500">Verified Buyer</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <div className="flex items-center mb-4">
                                <div className="flex text-yellow-400">
                                    {[...Array(5)].map((_, i) => (
                                        <svg key={i} className="h-5 w-5 fill-current" viewBox="0 0 20 20">
                                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                                        </svg>
                                    ))}
                                </div>
                            </div>
                            <p className="text-gray-700 mb-4">
                                "Fast shipping and excellent customer service. The products are top-notch and the sellers are reliable."
                            </p>
                            <div className="flex items-center">
                                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                    <span className="text-indigo-600 font-semibold">SM</span>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-semibold text-gray-900">Sarah Miller</p>
                                    <p className="text-sm text-gray-500">Verified Buyer</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <div className="flex items-center mb-4">
                                <div className="flex text-yellow-400">
                                    {[...Array(5)].map((_, i) => (
                                        <svg key={i} className="h-5 w-5 fill-current" viewBox="0 0 20 20">
                                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                                        </svg>
                                    ))}
                                </div>
                            </div>
                            <p className="text-gray-700 mb-4">
                                "Great platform with a wide variety of products. Easy to navigate and secure checkout process."
                            </p>
                            <div className="flex items-center">
                                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                    <span className="text-indigo-600 font-semibold">MJ</span>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-semibold text-gray-900">Mike Johnson</p>
                                    <p className="text-sm text-gray-500">Verified Buyer</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </FrontendLayout>
    );
}

