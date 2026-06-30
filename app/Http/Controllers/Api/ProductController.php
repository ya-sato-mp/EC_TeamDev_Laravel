<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::query();

        // カテゴリー検索
        if ($request->filled('category_id')) {
            $query->where('category_id', $request->input('category_id'));
        }

        // ソート（新着順など）
        if ($request->input('sort') === 'newest') {
            $query->orderBy('created_at', 'desc')->orderBy('id', 'desc');
        }

        return $query->get();
    }

    public function store(Request $request)
    {
        //
    }

    public function show(string $id)
    {
        return Product::findOrFail($id);
    }

    public function update(Request $request, string $id)
    {
        //
    }

    public function destroy(string $id)
    {
        //
    }
}
