<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EmployeeLeaveLimit extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_id',
        'leave_type',
        'max_days_per_month',
        'max_paid_requests_per_year',
        'reason',
        'effective_from',
        'effective_until',
        'is_active',
        'created_by'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'max_days_per_month' => 'integer',
        'max_paid_requests_per_year' => 'integer',
        'effective_from' => 'date',
        'effective_until' => 'date',
    ];

    /**
     * Get the employee that owns this leave limit
     */
    public function employee(): BelongsTo
    {
        return $this->belongsTo(EmployeeProfile::class, 'employee_id');
    }

    /**
     * Get the HR user who created this limit
     */
    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Scope to get active limits
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope to get currently effective limits
     */
    public function scopeCurrentlyEffective($query)
    {
        $today = now()->toDateString();
        return $query->where(function ($q) use ($today) {
            $q->whereNull('effective_from')
              ->orWhere('effective_from', '<=', $today);
        })->where(function ($q) use ($today) {
            $q->whereNull('effective_until')
              ->orWhere('effective_until', '>=', $today);
        });
    }

    /**
     * Get the effective limit for a specific employee and leave type
     */
    public static function getEffectiveLimit($employeeId, $leaveType)
    {
        return self::where('employee_id', $employeeId)
            ->where('leave_type', $leaveType)
            ->active()
            ->currentlyEffective()
            ->orderBy('created_at', 'desc')
            ->first();
    }
}
