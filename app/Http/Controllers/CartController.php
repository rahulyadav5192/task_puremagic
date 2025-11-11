<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CartController extends Controller
{
    public function index()
    {
        $items = Cart::with('product.seller')
            ->where('user_id', auth()->id())
            ->get();

        $total = $items->sum(fn($item) => $item->product->price * $item->quantity);
        $cartCount = $items->sum('quantity');

        return Inertia::render('Cart', [
            'items' => $items,
            'total' => $total,
            'cartCount' => $cartCount,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'nullable|integer|min:1',
        ]);

        $prod = Product::findOrFail($data['product_id']);
        $qty = $data['quantity'] ?? 1;

        $cart = Cart::where('user_id', auth()->id())
            ->where('product_id', $prod->id)
            ->first();

        if ($cart) {
            $cart->quantity += $qty;
            $cart->save();
        } else {
            Cart::create([
                'user_id' => auth()->id(),
                'product_id' => $prod->id,
                'quantity' => $qty,
            ]);
        }

        return redirect()->back();
    }

    public function update(Request $request, Cart $cart)
    {
        if ($cart->user_id !== auth()->id()) {
            abort(403);
        }

        $data = $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        $cart->update($data);

        return redirect()->back();
    }

    public function destroy(Cart $cart)
    {
        if ($cart->user_id !== auth()->id()) {
            abort(403);
        }

        $cart->delete();

        return redirect()->back();
    }
}
