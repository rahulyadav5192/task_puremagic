<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $q = $request->get('q');

        $list = Product::where('seller_id', auth()->id())
            ->when($q, fn($qry) => $qry->where('name', 'like', "%{$q}%"))
            ->latest()
            ->paginate(10);

        return Inertia::render('Seller/Products/Index', [
            'list' => $list,
            'filters' => ['q' => $q],
        ]);
    }

    public function create()
    {
        return Inertia::render('Seller/Products/Create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'desc' => 'required|string',
            'price' => 'required|numeric|min:0',
            'image' => 'nullable|image|max:2048',
        ]);

        $data['seller_id'] = auth()->id();

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('products', 'public');
        }

        Product::create($data);

        return redirect()->route('seller.products.index');
    }

    public function edit(Product $product)
    {
        if ($product->seller_id !== auth()->id()) {
            abort(403);
        }

        return Inertia::render('Seller/Products/Edit', [
            'prod' => $product,
        ]);
    }

    public function update(Request $request, Product $product)
    {
        if ($product->seller_id !== auth()->id()) {
            abort(403);
        }

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'desc' => 'required|string',
            'price' => 'required|numeric|min:0',
            'image' => 'nullable|image|max:2048',
        ], [
            'name.required' => 'The name field is required.',
            'desc.required' => 'The desc field is required.',
            'price.required' => 'The price field is required.',
        ]);

        if ($request->hasFile('image')) {
            if ($product->image) {
                Storage::disk('public')->delete($product->image);
            }
            $data['image'] = $request->file('image')->store('products', 'public');
        } else {
            unset($data['image']);
        }

        $product->update($data);

        return redirect()->route('seller.products.index');
    }

    public function destroy(Product $product)
    {
        if ($product->seller_id !== auth()->id()) {
            abort(403);
        }

        if ($product->image) {
            Storage::disk('public')->delete($product->image);
        }
        $product->delete();
        return redirect()->route('seller.products.index');
    }
}
