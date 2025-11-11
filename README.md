# Multi-Vendor eCommerce System

Laravel 11 + React + Inertia multi-vendor eCommerce platform with role-based access control.

## Tech Stack

- **Backend**: Laravel 11
- **Frontend**: React.js + Inertia.js
- **UI**: Tailwind CSS
- **Authentication**: Laravel Breeze (Inertia + React)
- **Database**: MySQL

## Installation

### Prerequisites

- PHP >= 8.2
- Composer
- Node.js >= 18.x and npm
- MySQL

### Setup Steps

1. **Clone the repository and install dependencies:**
```bash
composer install
npm install
```

2. **Configure environment:**
```bash
cp .env.example .env
php artisan key:generate
```

Update `.env` with your database credentials:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

3. **Run migrations and seed database:**
```bash
php artisan migrate
php artisan db:seed
```

4. **Create storage symlink for file uploads:**
```bash
php artisan storage:link
```

5. **Start development servers:**
```bash
# Terminal 1 - Laravel server
php artisan serve

# Terminal 2 - Vite dev server
npm run dev
```

6. **Access the application:**
Visit `http://localhost:8000` in your browser.

## Default Login Credentials

### Admin
- **Email**: `admin@example.com`
- **Password**: `admin@123`
- **Access**: Full system access - manage all products and sellers

### Seller 1
- **Email**: `seller1@example.com`
- **Password**: `Seller@123`
- **Access**: Manage own products only

### Seller 2
- **Email**: `seller2@example.com`
- **Password**: `Seller@123`
- **Access**: Manage own products only

### Buyer
- Register a new account as "Buyer" or use any test buyer account
- **Email**: `rahul@gmail.com`
- **Password**: `Rahul@123`
- **Access**: Browse products, add to cart, view cart

## Project Structure

```
app/
├── Http/
│   ├── Controllers/
│   │   ├── Admin/          # Admin controllers
│   │   │   ├── ProductController.php
│   │   │   └── SellerController.php
│   │   ├── Seller/         # Seller controllers
│   │   │   └── ProductController.php
│   │   ├── Frontend/       # Public frontend controllers
│   │   │   └── ProductController.php
│   │   ├── Api/            # API controllers
│   │   │   └── ProductController.php
│   │   ├── Auth/           # Authentication controllers
│   │   ├── CartController.php
│   │   ├── HomeController.php
│   │   └── ProfileController.php
│   └── Middleware/
│       ├── Admin.php       # Admin access middleware
│       └── Seller.php      # Seller access middleware
resources/
├── js/
│   ├── Pages/
│   │   ├── Admin/          # Admin pages
│   │   ├── Seller/         # Seller pages
│   │   ├── Products/       # Public product pages
│   │   ├── Auth/           # Login/Register pages
│   │   ├── Home.jsx        # Home page
│   │   └── Cart.jsx        # Cart page
│   ├── Layouts/
│   │   ├── SidebarLayout.jsx    # Admin/Seller layout
│   │   └── FrontendLayout.jsx   # Public frontend layout
│   └── Components/         # Reusable React components
routes/
├── web.php                 # Web routes
├── api.php                 # API routes
└── auth.php                # Authentication routes
```

## Routing Details

### Public Routes (No Authentication Required)

| Route | Method | Controller | Description |
|-------|--------|------------|-------------|
| `/` | GET | HomeController@index | Home page with products listing |
| `/products` | GET | FrontendProductController@index | Public products listing with search/filter |
| `/products/{product}` | GET | FrontendProductController@show | Product detail page |
| `/login` | GET | AuthenticatedSessionController@create | Login page |
| `/register` | GET | RegisteredUserController@create | Registration page |
| `/api/products` | GET | Api\ProductController@index | JSON API endpoint for products |

### Authentication Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/login` | POST | User login |
| `/register` | POST | User registration (buyer/seller) |
| `/logout` | POST | User logout |
| `/forgot-password` | GET/POST | Password reset request |
| `/reset-password/{token}` | GET/POST | Password reset |

### Authenticated Routes (All Users)

| Route | Method | Controller | Description |
|-------|--------|------------|-------------|
| `/dashboard` | GET | Redirect based on role | Dashboard redirect (admin→admin/products, seller→seller/products, buyer→home) |
| `/profile` | GET | ProfileController@edit | Edit profile page |
| `/profile` | PATCH | ProfileController@update | Update profile |
| `/profile` | DELETE | ProfileController@destroy | Delete account |
| `/cart` | GET | CartController@index | View cart |
| `/cart` | POST | CartController@store | Add item to cart |
| `/cart/{cart}` | PUT | CartController@update | Update cart item quantity |
| `/cart/{cart}` | DELETE | CartController@destroy | Remove item from cart |

### Admin Routes (Admin Middleware)

| Route | Method | Controller | Description |
|-------|--------|------------|-------------|
| `/admin/products` | GET | Admin\ProductController@index | List all products |
| `/admin/products/create` | GET | Admin\ProductController@create | Create product form |
| `/admin/products` | POST | Admin\ProductController@store | Store new product |
| `/admin/products/{product}/edit` | GET | Admin\ProductController@edit | Edit product form |
| `/admin/products/{product}` | PUT | Admin\ProductController@update | Update product |
| `/admin/products/{product}` | DELETE | Admin\ProductController@destroy | Delete product |
| `/admin/sellers` | GET | Admin\SellerController@index | List all sellers |
| `/admin/sellers/create` | GET | Admin\SellerController@create | Create seller form |
| `/admin/sellers` | POST | Admin\SellerController@store | Store new seller |
| `/admin/sellers/{seller}/edit` | GET | Admin\SellerController@edit | Edit seller form |
| `/admin/sellers/{seller}` | PUT | Admin\SellerController@update | Update seller |
| `/admin/sellers/{seller}` | DELETE | Admin\SellerController@destroy | Delete seller |

### Seller Routes (Seller Middleware)

| Route | Method | Controller | Description |
|-------|--------|------------|-------------|
| `/seller/products` | GET | Seller\ProductController@index | List own products |
| `/seller/products/create` | GET | Seller\ProductController@create | Create product form |
| `/seller/products` | POST | Seller\ProductController@store | Store new product |
| `/seller/products/{product}/edit` | GET | Seller\ProductController@edit | Edit product form |
| `/seller/products/{product}` | PUT | Seller\ProductController@update | Update product |
| `/seller/products/{product}` | DELETE | Seller\ProductController@destroy | Delete product |

## Application Flows

### 1. User Registration Flow

```
User visits /register
  ↓
Selects role (Buyer or Seller)
  ↓
Fills registration form
  ↓
System creates user with selected role
  ↓
Auto-login after registration
  ↓
Redirect based on role:
  - Buyer → / (Home page)
  - Seller → /dashboard → /seller/products
```

### 2. User Login Flow

```
User visits /login
  ↓
Enters email and password
  ↓
System authenticates credentials
  ↓
Redirect based on role:
  - Buyer → / (Home page)
  - Admin → /dashboard → /admin/products
  - Seller → /dashboard → /seller/products
```

### 3. Buyer Flow

```
Buyer logs in
  ↓
Lands on home page (/)
  ↓
Browse products (search/filter by seller)
  ↓
Click "Add to Cart" on product
  ↓
Product added to cart (cart count updates in header)
  ↓
Click cart icon in header
  ↓
View cart page (/cart)
  ↓
Update quantities or remove items
  ↓
(Checkout functionality can be added)
```

### 4. Seller Flow

```
Seller logs in
  ↓
Redirected to /seller/products
  ↓
View own products list
  ↓
Create new product (/seller/products/create)
  - Fill product details
  - Upload image (optional)
  - Save product
  ↓
Edit product (/seller/products/{id}/edit)
  - Update product details
  - Change image (optional, keeps old if not changed)
  - Save changes
  ↓
Delete product
  - Soft delete (can be restored)
```

### 5. Admin Flow

```
Admin logs in
  ↓
Redirected to /admin/products
  ↓
Manage Products:
  - View all products from all sellers
  - Create product and assign to seller
  - Edit any product
  - Delete any product
  ↓
Manage Sellers:
  - View all sellers (/admin/sellers)
  - Create new seller account
  - Edit seller details
  - Delete seller account
```

### 6. Product Management Flow

```
Create Product:
  - Admin/Seller navigates to create form
  - Fills: name, description, price
  - Admin: selects seller
  - Seller: auto-assigned to logged-in seller
  - Uploads image (optional)
  - Saves product
  ↓
Edit Product:
  - Navigate to edit form
  - Update fields
  - Change image (optional)
  - If no new image selected, old image preserved
  - Save changes
  ↓
Delete Product:
  - Click delete button
  - Confirm deletion
  - Product soft deleted (deleted_at set)
```

### 7. Cart Flow

```
Add to Cart:
  - Buyer clicks "Add to Cart" on product
  - System checks if product already in cart
  - If exists: increment quantity
  - If new: create cart entry
  - Cart count updates in header
  ↓
View Cart:
  - Click cart icon in header
  - View all cart items with quantities
  - See total price
  ↓
Update Cart:
  - Change quantity of item
  - Remove item from cart
  - Cart updates in real-time
```

### 8. Public Product Browsing Flow

```
Visit Home Page (/):
  - View hero section
  - Browse products grid
  - Search products by name
  - Filter by seller
  - Add products to cart (if logged in)
  - Click "Review" to scroll to testimonials
  ↓
Visit Products Page (/products):
  - View all products
  - Search and filter
  - Click product to view details
  ↓
Product Detail Page (/products/{id}):
  - View full product information
  - See seller details
  - Add to cart (if logged in)
```

## Features

### Role-Based Access Control
- **Admin**: Full system access, manage all products and sellers
- **Seller**: Manage only their own products
- **Buyer**: Browse products, add to cart

### Product Management
- CRUD operations for products
- Image upload with storage
- Soft deletes (products can be restored)
- Search and filter functionality
- Product assignment (admin can assign products to sellers)

### Cart System
- Add products to cart
- Update quantities
- Remove items
- Real-time cart count in header
- Cart persists across sessions

### User Interface
- Modern, responsive design
- Dark mode toggle (admin/seller dashboards)
- Smooth scrolling navigation
- Real-time search with debouncing
- Image previews with rounded corners
- Pagination (hidden when single page)

### API Endpoint
- `GET /api/products` - Returns JSON with product info, seller name, and email

## Middleware

- **`auth`**: Requires user to be authenticated
- **`admin`**: Requires user role to be 'admin'
- **`seller`**: Requires user role to be 'seller'
- **`guest`**: Requires user to NOT be authenticated (for login/register pages)

## Database Structure

### Users Table
- `id`, `name`, `email`, `password`, `role` (buyer/seller/admin)
- Relationships: `hasMany` Products (as seller)

### Products Table
- `id`, `name`, `desc`, `price`, `seller_id`, `image`, `deleted_at`
- Relationships: `belongsTo` User (seller)
- Soft deletes enabled

### Carts Table
- `id`, `user_id`, `product_id`, `quantity`, `timestamps`
- Relationships: `belongsTo` User, `belongsTo` Product

## Development Notes

- Uses Inertia.js for SPA-like experience without API
- React components in `resources/js/Pages/`
- Tailwind CSS for styling
- Laravel Storage for file uploads (public disk)
- Soft deletes for products (can be restored)
- Cart count shared globally via HandleInertiaRequests middleware

## Troubleshooting

### Images not displaying
- Run `php artisan storage:link` to create symlink
- Check file permissions on `storage/app/public`

### Routes not working
- Clear route cache: `php artisan route:clear`
- Clear config cache: `php artisan config:clear`

### Frontend not updating
- Clear Vite cache: `rm -rf node_modules/.vite`
- Restart dev server: `npm run dev`

## License

This project is open-sourced software.
