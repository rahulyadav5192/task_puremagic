import SidebarLayout from '@/Layouts/SidebarLayout';
import { Head, useForm } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';

export default function Edit({ u }) {
    const { data, setData, put, processing, errors } = useForm({
        name: u?.name || '',
        email: u?.email || '',
        password: '',
        password_confirmation: '',
        role: u?.role || 'buyer',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('admin.users.update', u?.id));
    };

    return (
        <SidebarLayout>
            <Head title="Edit User" />
            <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Edit User</h2>
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
                            <InputLabel htmlFor="email" value="Email" />
                            <TextInput
                                id="email"
                                name="email"
                                type="email"
                                value={data.email}
                                className="mt-1 block w-full"
                                onChange={(e) => setData('email', e.target.value)}
                            />
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <div className="mb-4">
                            <InputLabel htmlFor="role" value="Role" />
                            <select
                                id="role"
                                name="role"
                                value={data.role}
                                onChange={(e) => setData('role', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            >
                                <option value="buyer">Buyer</option>
                                <option value="seller">Seller</option>
                                <option value="admin">Admin</option>
                            </select>
                            <InputError message={errors.role} className="mt-2" />
                        </div>

                        <div className="mb-4">
                            <InputLabel htmlFor="password" value="Password (leave blank to keep current)" />
                            <TextInput
                                id="password"
                                name="password"
                                type="password"
                                value={data.password}
                                className="mt-1 block w-full"
                                onChange={(e) => setData('password', e.target.value)}
                            />
                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        <div className="mb-4">
                            <InputLabel htmlFor="password_confirmation" value="Confirm Password" />
                            <TextInput
                                id="password_confirmation"
                                name="password_confirmation"
                                type="password"
                                value={data.password_confirmation}
                                className="mt-1 block w-full"
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                            />
                            <InputError message={errors.password_confirmation} className="mt-2" />
                        </div>

                        <div className="flex items-center gap-4">
                            <PrimaryButton disabled={processing}>Update</PrimaryButton>
                            <a href={route('admin.users.index')} className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
                                Cancel
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </SidebarLayout>
    );
}

