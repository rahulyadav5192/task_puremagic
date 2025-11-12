<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Review;
use App\Models\User;
use Illuminate\Database\Seeder;

class ReviewSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = Product::all();
        $buyers = User::where('role', 'buyer')->get();

        // If no buyers exist, create some
        if ($buyers->isEmpty()) {
            $buyers = collect([
                User::create([
                    'name' => 'John Doe',
                    'email' => 'john@example.com',
                    'password' => bcrypt('password'),
                    'role' => 'buyer',
                ]),
                User::create([
                    'name' => 'Jane Smith',
                    'email' => 'jane@example.com',
                    'password' => bcrypt('password'),
                    'role' => 'buyer',
                ]),
                User::create([
                    'name' => 'Mike Johnson',
                    'email' => 'mike@example.com',
                    'password' => bcrypt('password'),
                    'role' => 'buyer',
                ]),
                User::create([
                    'name' => 'Sarah Williams',
                    'email' => 'sarah@example.com',
                    'password' => bcrypt('password'),
                    'role' => 'buyer',
                ]),
                User::create([
                    'name' => 'David Brown',
                    'email' => 'david@example.com',
                    'password' => bcrypt('password'),
                    'role' => 'buyer',
                ]),
            ]);
        }

        $comments = [
            'Great product! Highly recommend it.',
            'Excellent quality and fast shipping.',
            'Good value for money. Very satisfied!',
            'Amazing product, exceeded my expectations.',
            'Perfect! Exactly as described.',
            'Very happy with this purchase.',
            'Good quality but could be better.',
            'Nice product, works as expected.',
            'Love it! Will buy again.',
            'Decent product for the price.',
            'Not bad, but there are better options.',
            'Satisfied with the purchase.',
            'Good product overall.',
            'Worth the money.',
            'Pretty good, no complaints.',
            'Could be improved, but okay.',
            'Average product, nothing special.',
            'Works fine, does the job.',
            'Happy with my purchase.',
            'Good quality product.',
        ];

        foreach ($products as $product) {
            // Add 0-5 random reviews per product
            $reviewCount = rand(0, 5);
            $usedBuyers = [];

            for ($i = 0; $i < $reviewCount; $i++) {
                // Get a random buyer who hasn't reviewed this product yet
                $availableBuyers = $buyers->whereNotIn('id', $usedBuyers);
                
                if ($availableBuyers->isEmpty()) {
                    break; // All buyers have reviewed this product
                }

                $buyer = $availableBuyers->random();
                $usedBuyers[] = $buyer->id;

                // Random rating between 3-5 (mostly positive reviews)
                $rating = rand(3, 5);
                
                // Random comment
                $comment = $comments[array_rand($comments)];

                Review::create([
                    'product_id' => $product->id,
                    'user_id' => $buyer->id,
                    'rating' => $rating,
                    'comment' => $comment,
                ]);
            }
        }
    }
}
