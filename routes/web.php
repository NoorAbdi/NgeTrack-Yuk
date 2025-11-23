<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Admin\CheckpointController as AdminCheckpointController;
use App\Http\Controllers\Settings\ProfileController; 
use App\Http\Controllers\HikeRegistrationController;
use App\Http\Controllers\CheckpointController as PublicCheckpointController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('home');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::get('/register-hike', [HikeRegistrationController::class, 'create'])->name('hike.create');
    Route::post('/register-hike', [HikeRegistrationController::class, 'store'])->name('hike.store');
    Route::get('/checkpoint/{slug}', [PublicCheckpointController::class, 'show'])->name('checkpoint.show');
    Route::post('/checkpoint/scan', [PublicCheckpointController::class, 'store'])->name('checkpoint.store');
});

Route::middleware(['auth', 'is_admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::resource('checkpoints', AdminCheckpointController::class);
});