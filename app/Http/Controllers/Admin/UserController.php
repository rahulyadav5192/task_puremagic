<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $q = $request->get('q');
        $role = $request->get('role');

        $list = User::query()
            ->when($q, fn($qry) => $qry->where('name', 'like', "%{$q}%")->orWhere('email', 'like', "%{$q}%"))
            ->when($role, fn($qry) => $qry->where('role', $role))
            ->latest()
            ->paginate(10);

        return Inertia::render('Admin/Users/Index', [
            'list' => $list,
            'filters' => ['q' => $q, 'role' => $role],
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Users/Create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|in:buyer,seller,admin',
        ]);

        $data['password'] = Hash::make($data['password']);

        User::create($data);

        return redirect()->route('admin.users.index');
    }

    public function edit(User $user)
    {
        return Inertia::render('Admin/Users/Edit', [
            'u' => $user,
        ]);
    }

    public function update(Request $request, User $user)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:8|confirmed',
            'role' => 'required|in:buyer,seller,admin',
        ]);

        if ($data['password']) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        $user->update($data);

        return redirect()->route('admin.users.index');
    }

    public function destroy(User $user)
    {
        // Prevent deleting yourself
        if ($user->id === auth()->id()) {
            return redirect()->route('admin.users.index')
                ->withErrors(['error' => 'You cannot delete your own account.']);
        }

        $user->delete();
        return redirect()->route('admin.users.index');
    }
}
