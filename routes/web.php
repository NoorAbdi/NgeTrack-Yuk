<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\HikeRegistrationController;
use App\Http\Controllers\Admin\CheckpointController as AdminCheckpointController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\ForestryOfficerController;
use App\Http\Controllers\CheckpointController as PublicCheckpointController;
use App\Http\Controllers\HikerDashboardController;
use App\Http\Controllers\ForestryDashboardController;
use App\Http\Controllers\AdminAlertSettingController;
use App\Models\AlertSetting;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('home');

Route::get('/dashboard', [HikerDashboardController::class, 'index'])->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/register-hike', [HikeRegistrationController::class, 'create'])->name('hike.create');
    Route::post('/register-hike', [HikeRegistrationController::class, 'store'])->name('hike.store');
    Route::get('/checkpoint/{slug}', [PublicCheckpointController::class, 'show'])->name('checkpoint.show');
    Route::post('/checkpoint/scan', [PublicCheckpointController::class, 'store'])->name('checkpoint.store');
});

Route::middleware(['auth', 'verified', 'is_admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
    Route::resource('checkpoints', AdminCheckpointController::class);
    Route::resource('forestry-officers', ForestryOfficerController::class)->except(['show', 'edit', 'update']);
    Route::get('/alert-settings', [AdminAlertSettingController::class, 'edit'])->name('admin.alert-settings.edit');
    Route::put('/alert-settings', [AdminAlertSettingController::class, 'update'])->name('admin.alert-settings.update');
});

Route::middleware(['auth', 'verified', 'is_admin'])->prefix('forestry')->name('forestry.')->group(function () {
        Route::get('/dashboard', [ForestryDashboardController::class, 'index'])->name('dashboard');
        Route::get('/export/csv', [ForestryDashboardController::class, 'downloadCsv'])->name('export.csv');
        Route::get('/report/print', [ForestryDashboardController::class, 'printReport'])->name('report.print');
        Route::put('/hikes/{hike}/extend', [ForestryDashboardController::class, 'extendPermit'])->name('hikes.extend');
        Route::put('/hikes/{hike}/evacuation', [ForestryDashboardController::class, 'updateEvacuation'])->name('hikes.evacuation');
        Route::get('/extended-booking', [ForestryDashboardController::class, 'createBooking'])->name('booking.create');
        Route::post('/extended-booking', [ForestryDashboardController::class, 'storeBooking'])->name('booking.store');
    });

require __DIR__.'/settings.php'; 