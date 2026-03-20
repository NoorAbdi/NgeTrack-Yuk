<?php

namespace App\Http\Controllers;

use App\Models\AlertSetting;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminAlertSettingController extends Controller
{
    public function edit()
    {
        $setting = AlertSetting::firstOrCreate(
            ['id' => 1],
            ['warning_threshold_hours' => 3, 'critical_threshold_hours' => 0]
        );

        return Inertia::render('admin/AlertSettings', [
            'setting' => $setting
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'warning_threshold_hours' => 'required|integer|min:1',
            'critical_threshold_hours' => 'required|integer|min:0',
        ]);

        $setting = AlertSetting::first();
        $setting->update($validated);

        return redirect()->back()->with('success', 'Alert system logic has been updated successfully.');
    }
}
