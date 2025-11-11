<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
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
