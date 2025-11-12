import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link, usePage, router } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';

export default function FrontendLayout({ children }) {
    const page = usePage();
    const user = page.props.auth?.user;
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const menuRef = useRef(null);
    
    useEffect(() => {
        if (page.props.cartCount !== undefined) {
            setCartCount(page.props.cartCount);
        }
    }, [page.props.cartCount]);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowUserMenu(false);
            }
        };

        if (showUserMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showUserMenu]);

    const handleLogout = (e) => {
        e.preventDefault();
        router.post(route('logout'));
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <nav className={`sticky top-0 z-50 transition-all duration-300 ${
                scrolled 
                    ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100' 
                    : 'bg-white/80 backdrop-blur-sm shadow-sm'
            }`}>
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-20 justify-between items-center">
                        <div className="flex items-center space-x-8">
                            <Link href="/" className="flex items-center group">
                                <ApplicationLogo className="block h-10 w-auto fill-current transition-colors" style={{ color: '#793011' }} />
                                <span className="ml-2 text-xl font-bold" style={{ color: '#793011' }}>
                                    PureMagic
                                </span>
                            </Link>
                            <div className="hidden md:flex items-center space-x-1">
                                <Link 
                                    href={route('home')} 
                                    onClick={(e) => {
                                        const currentRoute = page.url;
                                        if (currentRoute === '/' || currentRoute === route('home')) {
                                            e.preventDefault();
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                        }
                                    }}
                                    className="relative px-4 py-2 text-sm font-semibold text-gray-700 transition-all duration-200 rounded-lg group"
                                    style={{ '--hover-color': '#793011' }}
                                    onMouseEnter={(e) => {
                                        e.target.style.color = '#793011';
                                        e.target.style.backgroundColor = 'rgba(121, 48, 17, 0.1)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.color = '';
                                        e.target.style.backgroundColor = '';
                                    }}
                                >
                                    <span className="relative z-10">Home</span>
                                </Link>
                                <Link 
                                    href={route('products.index')} 
                                    className="relative px-4 py-2 text-sm font-semibold text-gray-700 transition-all duration-200 rounded-lg group"
                                    onMouseEnter={(e) => {
                                        e.target.style.color = '#793011';
                                        e.target.style.backgroundColor = 'rgba(121, 48, 17, 0.1)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.color = '';
                                        e.target.style.backgroundColor = '';
                                    }}
                                >
                                    <span className="relative z-10">Products</span>
                                </Link>
                                <a 
                                    href="#testimonials" 
                                    onClick={(e) => {
                                        e.preventDefault();
                                        const element = document.getElementById('testimonials');
                                        if (element) {
                                            element.scrollIntoView({ behavior: 'smooth' });
                                        } else {
                                            const homeUrl = route('home');
                                            window.location.hash = 'testimonials';
                                            router.visit(homeUrl, {
                                                preserveScroll: false,
                                                onSuccess: () => {
                                                    setTimeout(() => {
                                                        const testimonialsElement = document.getElementById('testimonials');
                                                        if (testimonialsElement) {
                                                            const offset = 80;
                                                            const elementPosition = testimonialsElement.getBoundingClientRect().top;
                                                            const offsetPosition = elementPosition + window.pageYOffset - offset;
                                                            window.scrollTo({
                                                                top: offsetPosition,
                                                                behavior: 'smooth'
                                                            });
                                                        }
                                                    }, 200);
                                                }
                                            });
                                        }
                                    }}
                                    className="relative px-4 py-2 text-sm font-semibold text-gray-700 transition-all duration-200 rounded-lg group"
                                    onMouseEnter={(e) => {
                                        e.target.style.color = '#793011';
                                        e.target.style.backgroundColor = 'rgba(121, 48, 17, 0.1)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.color = '';
                                        e.target.style.backgroundColor = '';
                                    }}
                                >
                                    <span className="relative z-10">Review</span>
                                </a>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            {/* Mobile menu button */}
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    {mobileMenuOpen ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    )}
                                </svg>
                            </button>
                            {user && (
                                <>
                                    {user.role === 'buyer' && (
                                        <>
                                            <Link 
                                                href={route('cart.index')} 
                                                className="relative p-2.5 text-gray-700 transition-all duration-200 rounded-lg group"
                                                onMouseEnter={(e) => {
                                                    e.target.style.color = '#793011';
                                                    e.target.style.backgroundColor = 'rgba(121, 48, 17, 0.1)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.target.style.color = '';
                                                    e.target.style.backgroundColor = '';
                                                }}
                                            >
                                                <svg className="h-6 w-6 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#793011' }}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                                </svg>
                                                {cartCount > 0 && (
                                                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold text-white shadow-lg animate-pulse" style={{ backgroundColor: '#793011' }}>
                                                        {cartCount}
                                                    </span>
                                                )}
                                            </Link>
                                            <div className="relative" ref={menuRef}>
                                                <button
                                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                                    className="flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                                                    style={{ backgroundColor: 'rgba(121, 48, 17, 0.1)', color: '#793011' }}
                                                    onMouseEnter={(e) => {
                                                        e.target.style.backgroundColor = 'rgba(121, 48, 17, 0.2)';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.target.style.backgroundColor = 'rgba(121, 48, 17, 0.1)';
                                                    }}
                                                >
                                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#793011' }}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                </button>
                                                {showUserMenu && (
                                                    <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                                        <div className="py-2">
                                                            <div className="px-4 py-3 border-b border-gray-100" style={{ backgroundColor: 'rgba(121, 48, 17, 0.1)' }}>
                                                                <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                                                                <p className="text-xs text-gray-500 mt-0.5">{user.email}</p>
                                                            </div>
                                                            <button
                                                                onClick={handleLogout}
                                                                className="block w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:text-red-600 transition-all duration-200"
                                                            >
                                                                <span className="flex items-center">
                                                                    <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                                    </svg>
                                                                    Logout
                                                                </span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    )}
                                    {(user.role === 'admin' || user.role === 'seller') && (
                                        <>
                                            <Link 
                                                href={route('cart.index')} 
                                                className="relative p-2.5 text-gray-700 transition-all duration-200 rounded-lg group"
                                                onMouseEnter={(e) => {
                                                    e.target.style.color = '#793011';
                                                    e.target.style.backgroundColor = 'rgba(121, 48, 17, 0.1)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.target.style.color = '';
                                                    e.target.style.backgroundColor = '';
                                                }}
                                            >
                                                <svg className="h-6 w-6 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#793011' }}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                                </svg>
                                                {cartCount > 0 && (
                                                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold text-white shadow-lg animate-pulse" style={{ backgroundColor: '#793011' }}>
                                                        {cartCount}
                                                    </span>
                                                )}
                                            </Link>
                                            <Link 
                                                href={route('dashboard')} 
                                                className="flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                                                style={{ backgroundColor: 'rgba(121, 48, 17, 0.1)', color: '#793011' }}
                                                onMouseEnter={(e) => {
                                                    e.target.style.backgroundColor = 'rgba(121, 48, 17, 0.2)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.target.style.backgroundColor = 'rgba(121, 48, 17, 0.1)';
                                                }}
                                                title="Dashboard"
                                            >
                                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#793011' }}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                                </svg>
                                            </Link>
                                        </>
                                    )}
                                </>
                            )}
                            {!user && (
                                <>
                                    <Link 
                                        href={route('login')} 
                                        className="hidden sm:block px-4 py-2 text-sm font-semibold text-gray-700 transition-colors rounded-lg"
                                        onMouseEnter={(e) => {
                                            e.target.style.color = '#793011';
                                            e.target.style.backgroundColor = 'rgba(121, 48, 17, 0.1)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.color = '';
                                            e.target.style.backgroundColor = '';
                                        }}
                                    >
                                        Login
                                    </Link>
                                    <Link 
                                        href={route('register')} 
                                        className="px-5 py-2.5 text-white rounded-lg font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                                        style={{ backgroundColor: '#793011' }}
                                        onMouseEnter={(e) => {
                                            e.target.style.backgroundColor = '#5a2409';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.backgroundColor = '#793011';
                                        }}
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                    
                    {/* Mobile menu */}
                    {mobileMenuOpen && (
                        <div className="md:hidden border-t border-gray-200 py-4 animate-in slide-in-from-top duration-200">
                            <div className="flex flex-col space-y-2">
                                <Link 
                                    href={route('home')} 
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="px-4 py-2 text-sm font-semibold text-gray-700 rounded-lg transition-colors"
                                    onMouseEnter={(e) => {
                                        e.target.style.color = '#793011';
                                        e.target.style.backgroundColor = 'rgba(121, 48, 17, 0.1)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.color = '';
                                        e.target.style.backgroundColor = '';
                                    }}
                                >
                                    Home
                                </Link>
                                <Link 
                                    href={route('products.index')} 
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="px-4 py-2 text-sm font-semibold text-gray-700 rounded-lg transition-colors"
                                    onMouseEnter={(e) => {
                                        e.target.style.color = '#793011';
                                        e.target.style.backgroundColor = 'rgba(121, 48, 17, 0.1)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.color = '';
                                        e.target.style.backgroundColor = '';
                                    }}
                                >
                                    Products
                                </Link>
                                <a 
                                    href="#testimonials" 
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setMobileMenuOpen(false);
                                        const element = document.getElementById('testimonials');
                                        if (element) {
                                            element.scrollIntoView({ behavior: 'smooth' });
                                        } else {
                                            const homeUrl = route('home');
                                            window.location.hash = 'testimonials';
                                            router.visit(homeUrl, {
                                                preserveScroll: false,
                                                onSuccess: () => {
                                                    setTimeout(() => {
                                                        const testimonialsElement = document.getElementById('testimonials');
                                                        if (testimonialsElement) {
                                                            const offset = 80;
                                                            const elementPosition = testimonialsElement.getBoundingClientRect().top;
                                                            const offsetPosition = elementPosition + window.pageYOffset - offset;
                                                            window.scrollTo({
                                                                top: offsetPosition,
                                                                behavior: 'smooth'
                                                            });
                                                        }
                                                    }, 200);
                                                }
                                            });
                                        }
                                    }}
                                    className="px-4 py-2 text-sm font-semibold text-gray-700 rounded-lg transition-colors"
                                    onMouseEnter={(e) => {
                                        e.target.style.color = '#793011';
                                        e.target.style.backgroundColor = 'rgba(121, 48, 17, 0.1)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.color = '';
                                        e.target.style.backgroundColor = '';
                                    }}
                                >
                                    Review
                                </a>
                                {!user && (
                                    <>
                                        <Link 
                                            href={route('login')} 
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="px-4 py-2 text-sm font-semibold text-gray-700 rounded-lg transition-colors"
                                            onMouseEnter={(e) => {
                                                e.target.style.color = '#793011';
                                                e.target.style.backgroundColor = 'rgba(121, 48, 17, 0.1)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.color = '';
                                                e.target.style.backgroundColor = '';
                                            }}
                                        >
                                            Login
                                        </Link>
                                        <Link 
                                            href={route('register')} 
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="px-4 py-2 text-sm font-semibold text-white rounded-lg transition-all"
                                            style={{ backgroundColor: '#793011' }}
                                            onMouseEnter={(e) => {
                                                e.target.style.backgroundColor = '#5a2409';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.backgroundColor = '#793011';
                                            }}
                                        >
                                            Register
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </nav>
            <main className="flex-1">{children}</main>
            <footer className="bg-gray-900 text-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="text-lg font-semibold mb-4">About Us</h3>
                            <p className="text-gray-400 text-sm">
                                Your trusted marketplace for quality products from verified sellers.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                            <ul className="space-y-2 text-sm">
                                <li>
                                    <Link href={route('home')} className="text-gray-400 hover:text-white transition-colors">
                                        Home
                                    </Link>
                                </li>
                                <li>
                                    <Link href={route('products.index')} className="text-gray-400 hover:text-white transition-colors">
                                        Products
                                    </Link>
                                </li>
                                <li>
                                    <a 
                                        href="#testimonials" 
                                        onClick={(e) => {
                                            e.preventDefault();
                                            const element = document.getElementById('testimonials');
                                            if (element) {
                                                element.scrollIntoView({ behavior: 'smooth' });
                                            }
                                        }}
                                        className="text-gray-400 hover:text-white transition-colors"
                                    >
                                        Review
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
                            <ul className="space-y-2 text-sm">
                                <li>
                                    <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                                        FAQ
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                                        Shipping
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                                        Returns
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                                        Privacy Policy
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Connect</h3>
                            <div className="flex space-x-4">
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                    </svg>
                                </a>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                                    </svg>
                                </a>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.057-1.266-.07-1.646-.07-4.85 0-3.204.015-3.586.07-4.86.061-1.17.255-1.816.42-2.236.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
                        <p>&copy; {new Date().getFullYear()} Your Store. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

