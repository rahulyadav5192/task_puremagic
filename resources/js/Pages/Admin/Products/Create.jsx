import SidebarLayout from '@/Layouts/SidebarLayout';
import { Head, useForm } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';

export default function Create({ sellers }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        desc: '',
        price: '',
        seller_id: '',
        image: null,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.products.store'));
    };

    return (
        <SidebarLayout>
            <Head title="New Product" />
            <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">New Product</h2>
                <div className="bg-white shadow rounded-lg overflow-hidden dark:bg-gray-800">
                    <form onSubmit={submit} className="p-6">
                            <div className="mb-4">
                                <InputLabel htmlFor="name" value="Name" />
                                <TextInput
                                    id="name"
                                    name="name"
                                    value={data.name}
                                    className="mt-1 block w-full"
                                    onChange={(e) => setData('name', e.target.value)}
                                />
                                <InputError message={errors.name} className="mt-2" />
                            </div>

                            <div className="mb-4">
                                <InputLabel htmlFor="desc" value="Description" />
                                <textarea
                                    id="desc"
                                    name="desc"
                                    value={data.desc}
                                    className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-indigo-600 dark:focus:ring-indigo-600"
                                    rows="4"
                                    onChange={(e) => setData('desc', e.target.value)}
                                />
                                <InputError message={errors.desc} className="mt-2" />
                            </div>

                            <div className="mb-4">
                                <InputLabel htmlFor="price" value="Price" />
                                <TextInput
                                    id="price"
                                    name="price"
                                    type="number"
                                    step="0.01"
                                    value={data.price}
                                    className="mt-1 block w-full"
                                    onChange={(e) => setData('price', e.target.value)}
                                />
                                <InputError message={errors.price} className="mt-2" />
                            </div>

                            <div className="mb-4">
                                <InputLabel htmlFor="seller_id" value="Seller" />
                                <select
                                    id="seller_id"
                                    name="seller_id"
                                    value={data.seller_id}
                                    className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-indigo-600 dark:focus:ring-indigo-600"
                                    onChange={(e) => setData('seller_id', e.target.value)}
                                >
                                    <option value="">Select Seller</option>
                                    {sellers.map((s) => (
                                        <option key={s.id} value={s.id}>{s.name}</option>
                                    ))}
                                </select>
                                <InputError message={errors.seller_id} className="mt-2" />
                            </div>

                            <div className="mb-4">
                                <InputLabel htmlFor="image" value="Image" />
                                <input
                                    id="image"
                                    name="image"
                                    type="file"
                                    accept="image/*"
                                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100"
                                    onChange={(e) => setData('image', e.target.files[0])}
                                />
                                <InputError message={errors.image} className="mt-2" />
                            </div>

                            <div className="flex items-center gap-4">
                                <PrimaryButton disabled={processing}>Create</PrimaryButton>
                                <a href={route('admin.products.index')} className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
                                    Cancel
                                </a>
                            </div>
                        </form>
                    </div>
                </div>
        </SidebarLayout>
    );
}

