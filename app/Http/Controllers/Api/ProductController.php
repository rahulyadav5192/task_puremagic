<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $list = Product::with('seller')
            ->when($request->q, fn($qry) => $qry->where('name', 'like', "%{$request->q}%"))
            ->when($request->seller_id, fn($qry) => $qry->where('seller_id', $request->seller_id))
            ->latest()
            ->get()
            ->map(function ($p) {
                return [
                    'id' => $p->id,
                    'name' => $p->name,
                    'desc' => $p->desc,
                    'price' => $p->price,
                    'image' => $p->image ? asset($p->image) : null,
                    'seller' => [
                        'name' => $p->seller->name,
                        'email' => $p->seller->email,
                    ],
                ];
            });

        return response()->json($list);
    }
}
