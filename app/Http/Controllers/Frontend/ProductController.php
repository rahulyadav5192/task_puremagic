<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $q = $request->get('q');
        $s = $request->get('seller_id');

        $list = Product::with('seller')
            ->when($q, fn($qry) => $qry->where('name', 'like', "%{$q}%"))
            ->when($s, fn($qry) => $qry->where('seller_id', $s))
            ->latest()
            ->paginate(15);

        $sellers = User::where('role', 'seller')->get();

        return Inertia::render('Products/Index', [
            'list' => $list,
            'sellers' => $sellers,
            'filters' => [
                'q' => $q,
                'seller_id' => $s,
            ],
        ]);
    }

    public function show(Product $product)
    {
        $product->load('seller');
        return Inertia::render('Products/Show', [
            'prod' => $product,
        ]);
    }
}
