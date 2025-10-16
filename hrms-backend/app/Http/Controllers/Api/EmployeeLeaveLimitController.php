<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\EmployeeLeaveLimit;
use App\Models\EmployeeProfile;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class EmployeeLeaveLimitController extends Controller
{
    /**
     * Get all employee leave limits with pagination
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = EmployeeLeaveLimit::with(['employee', 'createdBy'])
                ->active();

            // Filter by employee if provided
            if ($request->has('employee_id')) {
                $query->where('employee_id', $request->employee_id);
            }

            // Filter by leave type if provided
            if ($request->has('leave_type')) {
                $query->where('leave_type', $request->leave_type);
            }

            $limits = $query->orderBy('created_at', 'desc')
                ->paginate($request->get('per_page', 15));

            return response()->json([
                'success' => true,
                'data' => $limits->items(),
                'pagination' => [
                    'current_page' => $limits->currentPage(),
                    'last_page' => $limits->lastPage(),
                    'per_page' => $limits->perPage(),
                    'total' => $limits->total(),
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch employee leave limits',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get leave limits for a specific employee
     */
    public function getEmployeeLimits($employeeId): JsonResponse
    {
        try {
            $employee = EmployeeProfile::findOrFail($employeeId);
            
            $limits = EmployeeLeaveLimit::where('employee_id', $employeeId)
                ->active()
                ->currentlyEffective()
                ->orderBy('leave_type')
                ->get();

            return response()->json([
                'success' => true,
                'data' => [
                    'employee' => [
                        'id' => $employee->id,
                        'name' => $employee->first_name . ' ' . $employee->last_name,
                        'employee_id' => $employee->employee_id,
                        'department' => $employee->department
                    ],
                    'limits' => $limits
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch employee leave limits',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Create or update employee leave limit
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'employee_id' => 'required|exists:employee_profiles,id',
                'leave_type' => 'required|string|max:255',
                'max_days_per_month' => 'required|integer|min:0|max:31',
                'max_paid_requests_per_year' => 'required|integer|min:0|max:12',
                'reason' => 'nullable|string|max:500',
                'effective_from' => 'nullable|date',
                'effective_until' => 'nullable|date|after:effective_from',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Check if limit already exists for this employee and leave type
            $existingLimit = EmployeeLeaveLimit::where('employee_id', $request->employee_id)
                ->where('leave_type', $request->leave_type)
                ->active()
                ->first();

            if ($existingLimit) {
                // Update existing limit
                $existingLimit->update([
                    'max_days_per_month' => $request->max_days_per_month,
                    'max_paid_requests_per_year' => $request->max_paid_requests_per_year,
                    'reason' => $request->reason,
                    'effective_from' => $request->effective_from,
                    'effective_until' => $request->effective_until,
                    'created_by' => Auth::id(),
                ]);

                $limit = $existingLimit;
            } else {
                // Create new limit
                $limit = EmployeeLeaveLimit::create([
                    'employee_id' => $request->employee_id,
                    'leave_type' => $request->leave_type,
                    'max_days_per_month' => $request->max_days_per_month,
                    'max_paid_requests_per_year' => $request->max_paid_requests_per_year,
                    'reason' => $request->reason,
                    'effective_from' => $request->effective_from,
                    'effective_until' => $request->effective_until,
                    'created_by' => Auth::id(),
                ]);
            }

            $limit->load(['employee', 'createdBy']);

            return response()->json([
                'success' => true,
                'message' => 'Employee leave limit saved successfully',
                'data' => $limit
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to save employee leave limit',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update employee leave limit
     */
    public function update(Request $request, $id): JsonResponse
    {
        try {
            $limit = EmployeeLeaveLimit::findOrFail($id);
            
            $validator = Validator::make($request->all(), [
                'max_days_per_month' => 'required|integer|min:0|max:31',
                'max_paid_requests_per_year' => 'required|integer|min:0|max:12',
                'reason' => 'nullable|string|max:500',
                'effective_from' => 'nullable|date',
                'effective_until' => 'nullable|date|after:effective_from',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $limit->update([
                'max_days_per_month' => $request->max_days_per_month,
                'max_paid_requests_per_year' => $request->max_paid_requests_per_year,
                'reason' => $request->reason,
                'effective_from' => $request->effective_from,
                'effective_until' => $request->effective_until,
            ]);

            $limit->load(['employee', 'createdBy']);

            return response()->json([
                'success' => true,
                'message' => 'Employee leave limit updated successfully',
                'data' => $limit
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update employee leave limit',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete employee leave limit (soft delete by setting inactive)
     */
    public function destroy($id): JsonResponse
    {
        try {
            $limit = EmployeeLeaveLimit::findOrFail($id);
            $limit->update(['is_active' => false]);

            return response()->json([
                'success' => true,
                'message' => 'Employee leave limit deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete employee leave limit',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get employees for dropdown
     */
    public function getEmployees(): JsonResponse
    {
        try {
            $employees = EmployeeProfile::select('id', 'first_name', 'last_name', 'employee_id', 'department')
                ->orderBy('first_name')
                ->get()
                ->map(function ($employee) {
                    return [
                        'id' => $employee->id,
                        'name' => $employee->first_name . ' ' . $employee->last_name,
                        'employee_id' => $employee->employee_id,
                        'department' => $employee->department
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $employees
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch employees',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
