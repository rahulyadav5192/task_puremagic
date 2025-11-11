import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import { Link, usePage, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function SidebarLayout({ children }) {
    const user = usePage().props.auth.user;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(() => {
        if (typeof window !== 'undefined') {
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme === 'dark') {
                document.documentElement.classList.add('dark');
                return true;
            } else {
                document.documentElement.classList.remove('dark');
                return false;
            }
        }
        return false;
    });

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, []);

    const toggleTheme = () => {
        const newDarkMode = !darkMode;
        setDarkMode(newDarkMode);
        if (newDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    const isAdmin = user?.role === 'admin';
    const isSeller = user?.role === 'seller';

    const menuItems = isAdmin
        ? [
              { name: 'Products', href: route('admin.products.index'), active: route().current('admin.products.*') },
              { name: 'Sellers', href: route('admin.sellers.index'), active: route().current('admin.sellers.*') },
          ]
        : [
              { name: 'Products', href: route('seller.products.index'), active: route().current('seller.products.*') },
          ];

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
            <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out dark:bg-gray-800 lg:translate-x-0 lg:static lg:inset-0`}>
                <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4 dark:border-gray-700">
                    <Link href="/" className="flex items-center">
                        <ApplicationLogo className="h-8 w-8 fill-current text-indigo-600" />
                        <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">eCommerce</span>
                    </Link>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <nav className="mt-8 px-4">
                    <div className="space-y-1">
                        {menuItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center rounded-lg px-4 py-3 text-sm font-medium transition ${
                                    item.active
                                        ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400'
                                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                                }`}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>
                </nav>

                <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 p-4 dark:border-gray-700 space-y-2">
                    <button
                        onClick={toggleTheme}
                        className="w-full flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                    >
                        {darkMode ? (
                            <>
                                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                                <span>Light Mode</span>
                            </>
                        ) : (
                            <>
                                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                </svg>
                                <span>Dark Mode</span>
                            </>
                        )}
                    </button>
                    <Dropdown>
                        <Dropdown.Trigger>
                            <div className="flex items-center rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 cursor-pointer">
                                <div className="flex-1">
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</div>
                                </div>
                                <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </Dropdown.Trigger>
                        <Dropdown.Content position="top">
                            <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
                            <Dropdown.Link href={route('logout')} method="post" as="button">Log Out</Dropdown.Link>
                        </Dropdown.Content>
                    </Dropdown>
                </div>
            </div>

            <div className="flex flex-1 flex-col overflow-hidden">
                <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 dark:border-gray-700 dark:bg-gray-800 lg:hidden">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <Link href="/" className="flex items-center">
                        <ApplicationLogo className="h-8 w-8 fill-current text-indigo-600" />
                    </Link>
                    <div className="w-6"></div>
                </header>

                <main className="flex-1 overflow-y-auto bg-gray-50 p-6 dark:bg-gray-900">{children}</main>
            </div>
        </div>
    );
}

