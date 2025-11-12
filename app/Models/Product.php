<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'desc',
        'price',
        'seller_id',
        'image',
    ];

    public function seller(): BelongsTo
    {
        return $this->belongsTo(User::class, 'seller_id');
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function carts(): HasMany
    {
        return $this->hasMany(Cart::class);
    }

    /**
     * Get the image URL, handling both old storage paths and new public paths
     */
    public function getImageUrlAttribute()
    {
        if (!$this->image) {
            return null;
        }

        // If it's already in the new format (images/products/...), return as is
        if (str_starts_with($this->image, 'images/products/')) {
            return '/' . $this->image;
        }

        // If it's in the old storage format (products/...), convert to new format
        if (str_starts_with($this->image, 'products/')) {
            return '/images/' . $this->image;
        }

        // Otherwise, assume it's already a full path
        return '/' . ltrim($this->image, '/');
    }
}
