import SidebarLayout from '@/Layouts/SidebarLayout';
import { Head, useForm, router } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';

export default function Edit({ prod, sellers }) {
    const form = useForm({
        name: prod.name || '',
        desc: prod.desc || '',
        price: prod.price || 0,
        seller_id: prod.seller_id || '',
        image: null,
    });

    const submit = (e) => {
        e.preventDefault();
        
        if (form.data.image) {
            const formData = new FormData();
            formData.append('_method', 'PUT');
            formData.append('name', form.data.name);
            formData.append('desc', form.data.desc);
            formData.append('price', form.data.price);
            formData.append('seller_id', form.data.seller_id);
            formData.append('image', form.data.image);
            
            router.post(route('admin.products.update', prod.id), formData, {
                preserveScroll: true,
                forceFormData: true,
            });
        } else {
            form.put(route('admin.products.update', prod.id), {
                preserveScroll: true,
            });
        }
    };

    return (
        <SidebarLayout>
            <Head title="Edit Product" />
            <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Edit Product</h2>
                <div className="bg-white shadow rounded-lg overflow-hidden dark:bg-gray-800">
                    <form onSubmit={submit} className="p-6">
                            <div className="mb-4">
                                <InputLabel htmlFor="name" value="Name" />
                                <TextInput
                                    id="name"
                                    name="name"
                                    value={form.data.name}
                                    className="mt-1 block w-full"
                                    onChange={(e) => form.setData('name', e.target.value)}
                                />
                                <InputError message={form.errors.name} className="mt-2" />
                            </div>

                            <div className="mb-4">
                                <InputLabel htmlFor="desc" value="Description" />
                                <textarea
                                    id="desc"
                                    name="desc"
                                    value={form.data.desc}
                                    className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-indigo-600 dark:focus:ring-indigo-600"
                                    rows="4"
                                    onChange={(e) => form.setData('desc', e.target.value)}
                                />
                                <InputError message={form.errors.desc} className="mt-2" />
                            </div>

                            <div className="mb-4">
                                <InputLabel htmlFor="price" value="Price" />
                                <TextInput
                                    id="price"
                                    name="price"
                                    type="number"
                                    step="0.01"
                                    value={form.data.price}
                                    className="mt-1 block w-full"
                                    onChange={(e) => form.setData('price', e.target.value)}
                                />
                                <InputError message={form.errors.price} className="mt-2" />
                            </div>

                            <div className="mb-4">
                                <InputLabel htmlFor="seller_id" value="Seller" />
                                <select
                                    id="seller_id"
                                    name="seller_id"
                                    value={form.data.seller_id}
                                    className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-indigo-600 dark:focus:ring-indigo-600"
                                    onChange={(e) => form.setData('seller_id', e.target.value)}
                                >
                                    <option value="">Select Seller</option>
                                    {sellers.map((s) => (
                                        <option key={s.id} value={s.id}>{s.name}</option>
                                    ))}
                                </select>
                                <InputError message={form.errors.seller_id} className="mt-2" />
                            </div>

                            <div className="mb-4">
                                <InputLabel htmlFor="image" value="Image" />
                                {prod.image && (
                                    <div className="mb-2">
                                        <img src={`/storage/${prod.image}`} alt={prod.name} className="h-32 w-32 object-cover rounded" />
                                    </div>
                                )}
                                <input
                                    id="image"
                                    name="image"
                                    type="file"
                                    accept="image/*"
                                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100"
                                    onChange={(e) => form.setData('image', e.target.files[0])}
                                />
                                <InputError message={form.errors.image} className="mt-2" />
                            </div>

                            <div className="flex items-center gap-4">
                                <PrimaryButton disabled={form.processing}>Update</PrimaryButton>
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

