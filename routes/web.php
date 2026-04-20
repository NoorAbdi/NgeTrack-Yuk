<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\HikeRegistrationController;
use App\Http\Controllers\Admin\CheckpointController;
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

Route::inertia('/learn-more', 'LearnMore')->name('learn.more');
Route::inertia('/privacy-policy', 'PrivacyPolicy')->name('privacy.policy');
Route::inertia('/terms-of-service', 'TermsOfService')->name('terms.of.service');
Route::inertia('/contact-rangers', 'ContactRangers')->name('contact.rangers');

Route::get('/dashboard', [HikerDashboardController::class, 'index'])->middleware(['auth', 'verified'])->name('dashboard');
Route::middleware('auth')->group(function () {
    Route::get('/register-hike', [HikeRegistrationController::class, 'create'])->name('hike.create');
    Route::post('/register-hike', [HikeRegistrationController::class, 'store'])->name('hike.store');
    Route::get('/checkpoint/{slug}', [PublicCheckpointController::class, 'show'])->name('checkpoint.show');
    Route::post('/checkpoint/scan', [PublicCheckpointController::class, 'store'])->name('checkpoint.store')->middleware('throttle:10,1');
});

Route::middleware(['auth', 'verified', 'is_admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
    Route::get('/checkpoints', [AdminCheckpointController::class, 'index'])->name('checkpoints.index');
    Route::post('/checkpoints', [AdminCheckpointController::class, 'store'])->name('checkpoints.store')->middleware('throttle:30,1');
    Route::put('/checkpoints/{checkpoint}', [AdminCheckpointController::class, 'update'])->name('checkpoints.update')->middleware('throttle:30,1');
    Route::delete('/checkpoints/{checkpoint}', [AdminCheckpointController::class, 'destroy'])->name('checkpoints.destroy')->middleware('throttle:20,1');
    Route::resource('checkpoints', CheckpointController::class)->withTrashed();
    Route::resource('forestry-officers', ForestryOfficerController::class)->except(['show', 'edit', 'update']);
    Route::get('/alert-settings', [AdminAlertSettingController::class, 'edit'])->name('admin.alert-settings.edit');
    Route::put('/alert-settings', [AdminAlertSettingController::class, 'update'])->name('admin.alert-settings.update');
});

Route::middleware(['auth', 'verified', 'is_admin'])->prefix('forestry')->name('forestry.')->group(function () {
        Route::get('/dashboard', [ForestryDashboardController::class, 'index'])->name('dashboard');
        Route::get('/export/csv', [ForestryDashboardController::class, 'downloadCsv'])->name('export.csv');
        Route::get('/report/print', [ForestryDashboardController::class, 'printReport'])->name('report.print');
        Route::put('/hikes/{hike}/extend', [ForestryDashboardController::class, 'extendPermit'])->name('hikes.extend')->middleware('throttle:10,1');
        Route::put('/hikes/{hike}/evacuation', [ForestryDashboardController::class, 'updateEvacuation'])->name('hikes.evacuation')->middleware('throttle:5,1');
        Route::get('/extended-booking', [ForestryDashboardController::class, 'createBooking'])->name('booking.create');
        Route::post('/extended-booking', [ForestryDashboardController::class, 'storeBooking'])->name('booking.store');
        Route::get('/report', [ForestryDashboardController::class, 'printReport'])->name('forestry.report');
        Route::post('/hikes/{hike}/manual-checkin', [ForestryDashboardController::class, 'manualCheckin'])->name('forestry.hikes.manual-checkin')->middleware('throttle:60,1');
    });

require __DIR__.'/settings.php';