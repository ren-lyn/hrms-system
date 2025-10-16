import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000/api',
  withCredentials: true,
});

// Add auth token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Get all employee leave limits
export const getEmployeeLeaveLimits = async (params = {}) => {
  try {
    const response = await API.get('/employee-leave-limits', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching employee leave limits:', error);
    throw error;
  }
};

// Get leave limits for a specific employee
export const getEmployeeLimits = async (employeeId) => {
  try {
    const response = await API.get(`/employee-leave-limits/employee/${employeeId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching employee limits:', error);
    throw error;
  }
};

// Create or update employee leave limit
export const saveEmployeeLeaveLimit = async (data) => {
  try {
    const response = await API.post('/employee-leave-limits', data);
    return response.data;
  } catch (error) {
    console.error('Error saving employee leave limit:', error);
    throw error;
  }
};

// Update employee leave limit
export const updateEmployeeLeaveLimit = async (id, data) => {
  try {
    const response = await API.put(`/employee-leave-limits/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating employee leave limit:', error);
    throw error;
  }
};

// Delete employee leave limit
export const deleteEmployeeLeaveLimit = async (id) => {
  try {
    const response = await API.delete(`/employee-leave-limits/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting employee leave limit:', error);
    throw error;
  }
};

// Get employees for dropdown
export const getEmployeesForDropdown = async () => {
  try {
    const response = await API.get('/employee-leave-limits/employees/dropdown');
    return response.data;
  } catch (error) {
    console.error('Error fetching employees:', error);
    throw error;
  }
};
