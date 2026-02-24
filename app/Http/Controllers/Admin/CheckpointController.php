<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Checkpoint;
use App\Models\Mountain;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class CheckpointController extends Controller
{
    public function index()
    {
        $checkpoints = Checkpoint::with('mountain')
                                ->orderBy('mountain_id')
                                ->orderBy('order')
                                ->get();
        return Inertia::render('admin/checkpoints/index', [
            'checkpoints' => $checkpoints
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/checkpoints/create', [
            'mountains' => Mountain::all(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'mountain_id' => 'required|exists:mountains,id',
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:checkpoints',
            'order' => 'required|integer'
        ]);

        Checkpoint::create($validated);

        return Redirect::route('admin.checkpoints.index')->with('success', 'Checkpoint created successfully.');
    }

    public function edit(Checkpoint $checkpoint)
    {
        return Inertia::render('admin/checkpoints/edit', [
            'checkpoint' => $checkpoint,
            'mountains' => Mountain::all(),
        ]);
    }

    public function update(Request $request, Checkpoint $checkpoint)
    {
        $validated = $request->validate([
            'mountain_id' => 'required|exists:mountains,id',
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:checkpoints,slug,' . $checkpoint->id,
            'order' => 'required|integer'
        ]);

        $checkpoint->update($validated);

        return Redirect::route('admin.checkpoints.index')->with('success', 'Checkpoint updated successfully.');
    }

    public function destroy(Checkpoint $checkpoint)
    {
        $checkpoint->delete();
        return Redirect::route('admin.checkpoints.index')->with('success', 'Checkpoint deleted successfully.');
    }
}