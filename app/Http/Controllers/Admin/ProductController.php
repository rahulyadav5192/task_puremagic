<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

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
            ->paginate(10);

        $sellers = User::where('role', 'seller')->get();

        return Inertia::render('Admin/Products/Index', [
            'list' => $list,
            'sellers' => $sellers,
            'filters' => [
                'q' => $q,
                'seller_id' => $s,
            ],
        ]);
    }

    public function create()
    {
        $sellers = User::where('role', 'seller')->get();
        return Inertia::render('Admin/Products/Create', [
            'sellers' => $sellers,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'desc' => 'required|string',
            'price' => 'required|numeric|min:0',
            'seller_id' => 'required|exists:users,id',
            'image' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = Str::random(40) . '.' . $image->getClientOriginalExtension();
            $imagePath = public_path('images/products');
            
            // Create directory if it doesn't exist
            if (!file_exists($imagePath)) {
                mkdir($imagePath, 0755, true);
            }
            
            $image->move($imagePath, $imageName);
            $data['image'] = 'images/products/' . $imageName;
        }

        Product::create($data);

        return redirect()->route('admin.products.index');
    }

    public function edit(Product $product)
    {
        $sellers = User::where('role', 'seller')->get();
        return Inertia::render('Admin/Products/Edit', [
            'prod' => $product->load('seller'),
            'sellers' => $sellers,
        ]);
    }

    public function update(Request $request, Product $product)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'desc' => 'required|string',
            'price' => 'required|numeric|min:0',
            'seller_id' => 'required|exists:users,id',
            'image' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($product->image && file_exists(public_path($product->image))) {
                unlink(public_path($product->image));
            }
            
            $image = $request->file('image');
            $imageName = Str::random(40) . '.' . $image->getClientOriginalExtension();
            $imagePath = public_path('images/products');
            
            // Create directory if it doesn't exist
            if (!file_exists($imagePath)) {
                mkdir($imagePath, 0755, true);
            }
            
            $image->move($imagePath, $imageName);
            $data['image'] = 'images/products/' . $imageName;
        } else {
            unset($data['image']);
        }

        $product->update($data);

        return redirect()->route('admin.products.index');
    }

    public function destroy(Product $product)
    {
        if ($product->image && file_exists(public_path($product->image))) {
            unlink(public_path($product->image));
        }
        $product->delete();
        return redirect()->route('admin.products.index');
    }
}
