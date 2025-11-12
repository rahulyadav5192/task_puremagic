<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\User;
use App\Models\Cart;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index(Request $request)
    {
        $q = $request->get('q');
        $s = $request->get('seller_id');

        $list = Product::with('seller')
            ->when($q, fn($qry) => $qry->where('name', 'like', "%{$q}%"))
            ->when($s, fn($qry) => $qry->where('seller_id', $s))
            ->latest()
            ->paginate(12);

        // Add reviews count and cart user count for each product
        $list->getCollection()->transform(function ($product) {
            $product->reviews_count = DB::table('reviews')
                ->where('product_id', $product->id)
                ->count();
            $product->cart_users_count = DB::table('carts')
                ->where('product_id', $product->id)
                ->selectRaw('count(distinct user_id) as count')
                ->value('count') ?? 0;
            return $product;
        });

        $sellers = User::where('role', 'seller')->get();

        return Inertia::render('Home', [
            'list' => $list,
            'sellers' => $sellers,
            'filters' => [
                'q' => $q,
                'seller_id' => $s,
            ],
        ]);
    }
}
