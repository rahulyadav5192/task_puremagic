<?php

namespace App\Http\Middleware;

use App\Models\Cart;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        $user = $request->user();
        $cartCount = 0;

        if ($user) {
            $cartCount = Cart::where('user_id', $user->id)->sum('quantity');
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user,
            ],
            'cartCount' => $cartCount,
        ];
    }
}
