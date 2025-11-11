<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::create([
            'name' => 'Admin',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        $s1 = User::create([
            'name' => 'Seller One',
            'email' => 'seller1@example.com',
            'password' => Hash::make('password'),
            'role' => 'seller',
        ]);

        $s2 = User::create([
            'name' => 'Seller Two',
            'email' => 'seller2@example.com',
            'password' => Hash::make('password'),
            'role' => 'seller',
        ]);

        $prods = [
            ['name' => 'Laptop', 'desc' => 'High performance laptop', 'price' => 999.99, 'seller_id' => $s1->id],
            ['name' => 'Mouse', 'desc' => 'Wireless mouse', 'price' => 29.99, 'seller_id' => $s1->id],
            ['name' => 'Keyboard', 'desc' => 'Mechanical keyboard', 'price' => 79.99, 'seller_id' => $s1->id],
            ['name' => 'Monitor', 'desc' => '27 inch 4K monitor', 'price' => 399.99, 'seller_id' => $s1->id],
            ['name' => 'Headphones', 'desc' => 'Noise cancelling headphones', 'price' => 199.99, 'seller_id' => $s1->id],
            ['name' => 'Phone', 'desc' => 'Smartphone', 'price' => 699.99, 'seller_id' => $s2->id],
            ['name' => 'Tablet', 'desc' => '10 inch tablet', 'price' => 449.99, 'seller_id' => $s2->id],
            ['name' => 'Watch', 'desc' => 'Smart watch', 'price' => 299.99, 'seller_id' => $s2->id],
            ['name' => 'Speaker', 'desc' => 'Bluetooth speaker', 'price' => 89.99, 'seller_id' => $s2->id],
            ['name' => 'Camera', 'desc' => 'Digital camera', 'price' => 599.99, 'seller_id' => $s2->id],
        ];

        foreach ($prods as $p) {
            Product::create($p);
        }
    }
}
