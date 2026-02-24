<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;

class ForestryOfficerController extends Controller
{
    public function index()
    {
        $officers = User::where('role', 'forestry_officer')->get();
        return Inertia::render('admin/forestry-officers/index', [
            'officers' => $officers
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/forestry-officers/create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:'.User::class,
            'phone_number' => 'nullable|string|max:20',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone_number' => $request->phone_number,
            'password' => Hash::make($request->password),
            'role' => 'forestry_officer',
            'email_verified_at' => now(),
        ]);

        return redirect()->route('admin.forestry-officers.index')
            ->with('success', 'Forestry Officer account successfully created.');
    }

    public function destroy(User $forestry_officer)
    {
        if ($forestry_officer->role === 'forestry_officer') {
            $forestry_officer->delete();
            return redirect()->back()->with('success', 'Officer account deleted.');
        }
        
        return redirect()->back()->with('error', 'Unauthorized action.');
    }
}