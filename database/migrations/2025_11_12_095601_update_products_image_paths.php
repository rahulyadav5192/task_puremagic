<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Get all products with images
        $products = DB::table('products')->whereNotNull('image')->get();

        foreach ($products as $product) {
            $oldPath = $product->image;
            
            // Skip if already in new format
            if (str_starts_with($oldPath, 'images/products/')) {
                continue;
            }

            // Handle old storage format: products/filename.jpg
            if (str_starts_with($oldPath, 'products/')) {
                $filename = basename($oldPath);
                $newPath = 'images/products/' . $filename;
                
                // Move physical file if it exists in old location
                $oldFilePath = storage_path('app/public/' . $oldPath);
                $newFilePath = public_path($newPath);
                
                // Create directory if it doesn't exist
                if (!file_exists(public_path('images/products'))) {
                    File::makeDirectory(public_path('images/products'), 0755, true);
                }
                
                // Move file if it exists
                if (file_exists($oldFilePath)) {
                    if (file_exists($newFilePath)) {
                        // If file already exists in new location, just update DB
                        unlink($oldFilePath);
                    } else {
                        // Move file to new location
                        File::move($oldFilePath, $newFilePath);
                    }
                }
                
                // Update database
                DB::table('products')
                    ->where('id', $product->id)
                    ->update(['image' => $newPath]);
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Get all products with images in new format
        $products = DB::table('products')
            ->whereNotNull('image')
            ->where('image', 'like', 'images/products/%')
            ->get();

        foreach ($products as $product) {
            $oldPath = $product->image;
            $filename = basename($oldPath);
            $newPath = 'products/' . $filename;
            
            // Move physical file back if it exists
            $oldFilePath = public_path($oldPath);
            $newFilePath = storage_path('app/public/' . $newPath);
            
            // Create directory if it doesn't exist
            if (!file_exists(storage_path('app/public/products'))) {
                File::makeDirectory(storage_path('app/public/products'), 0755, true);
            }
            
            // Move file back if it exists
            if (file_exists($oldFilePath)) {
                if (file_exists($newFilePath)) {
                    // If file already exists in old location, just update DB
                    unlink($oldFilePath);
                } else {
                    // Move file back to old location
                    File::move($oldFilePath, $newFilePath);
                }
            }
            
            // Update database
            DB::table('products')
                ->where('id', $product->id)
                ->update(['image' => $newPath]);
        }
    }
};
