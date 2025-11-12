import FrontendLayout from '@/Layouts/FrontendLayout';
import { Head, Link, router } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Cart({ items, total }) {
    const updateQuantity = (cartId, quantity) => {
        router.put(route('cart.update', cartId), { quantity });
    };

    const removeItem = (cartId) => {
        router.delete(route('cart.destroy', cartId));
    };

    return (
        <FrontendLayout>
            <Head title="Shopping Cart" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

                    {items.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500 mb-4">Your cart is empty</p>
                            <Link href={route('home')} className="text-indigo-600 hover:text-indigo-800">
                                Continue Shopping
                            </Link>
                        </div>
                    ) : (
                        <div className="bg-white shadow rounded-lg overflow-hidden">
                            <div className="divide-y divide-gray-200">
                                {items.map((item) => (
                                    <div key={item.id} className="p-6 flex items-center gap-6">
                                        {item.product.image && (
                                            <img
                                                src={`/${item.product.image}`}
                                                alt={item.product.name}
                                                className="h-24 w-24 object-cover rounded"
                                            />
                                        )}
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-gray-900">{item.product.name}</h3>
                                            <p className="text-sm text-gray-500">by {item.product.seller?.name}</p>
                                            <p className="text-lg font-bold text-indigo-600 mt-2">${item.product.price}</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                    className="rounded-full bg-gray-200 p-1 hover:bg-gray-300"
                                                >
                                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                                    </svg>
                                                </button>
                                                <span className="w-8 text-center">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="rounded-full bg-gray-200 p-1 hover:bg-gray-300"
                                                >
                                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                    </svg>
                                                </button>
                                            </div>
                                            <p className="text-lg font-semibold text-gray-900 w-24 text-right">
                                                ${(item.product.price * item.quantity).toFixed(2)}
                                            </p>
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="p-6 bg-gray-50 border-t">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-xl font-semibold text-gray-900">Total:</span>
                                    <span className="text-2xl font-bold text-indigo-600">${total.toFixed(2)}</span>
                                </div>
                                <div className="flex gap-4">
                                    <Link href={route('home')} className="flex-1 text-center py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50">
                                        Continue Shopping
                                    </Link>
                                    <button className="flex-1 py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                                        Checkout
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </FrontendLayout>
    );
}

