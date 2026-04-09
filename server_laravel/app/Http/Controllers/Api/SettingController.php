<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SettingController extends Controller
{
    public function index()
    {
        return response()->json(Setting::pluck('value', 'key'));
    }

    public function update(Request $request)
    {
        $payload = $request->all();

        if ($request->hasFile('logo_file')) {
            // Delete old logo if exists
            $oldLogo = Setting::where('key', 'logo_url')->first();
            if ($oldLogo && $oldLogo->value) {
                $oldPath = str_replace(asset('storage/'), '', $oldLogo->value);
                Storage::disk('public')->delete($oldPath);
            }

            $path = $request->file('logo_file')->store('branding', 'public');
            $payload['logo_url'] = asset('storage/' . $path);
        }

        foreach ($payload as $key => $value) {
            // Skip the file object itself
            if ($key === 'logo_file') continue;
            
            Setting::updateOrCreate(['key' => $key], ['value' => $value]);
        }

        return response()->json(['message' => 'Settings and branding updated successfully']);
    }
}
