<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;

class SellerController extends Controller
{
    public function index(Request $request)
    {
        $q = $request->get('q');

        $list = User::where('role', 'seller')
            ->when($q, fn($qry) => $qry->where('name', 'like', "%{$q}%")->orWhere('email', 'like', "%{$q}%"))
            ->latest()
            ->paginate(10);

        return Inertia::render('Admin/Sellers/Index', [
            'list' => $list,
            'filters' => ['q' => $q],
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Sellers/Create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $data['password'] = Hash::make($data['password']);
        $data['role'] = 'seller';

        User::create($data);

        return redirect()->route('admin.sellers.index');
    }

    public function edit(User $seller)
    {
        return Inertia::render('Admin/Sellers/Edit', [
            'v' => $seller,
        ]);
    }

    public function update(Request $request, User $seller)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $seller->id,
            'password' => 'nullable|string|min:8|confirmed',
        ]);

        if ($data['password']) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        $seller->update($data);

        return redirect()->route('admin.sellers.index');
    }

    public function destroy(User $seller)
    {
        $seller->delete();
        return redirect()->route('admin.sellers.index');
    }
}
