import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Modal, Table, Badge, InputGroup } from 'react-bootstrap';
import { Search, Plus, Edit, Trash2, User, Calendar, Settings } from 'lucide-react';
import { 
  getEmployeeLeaveLimits, 
  getEmployeeLimits, 
  saveEmployeeLeaveLimit, 
  updateEmployeeLeaveLimit, 
  deleteEmployeeLeaveLimit,
  getEmployeesForDropdown 
} from '../../api/employeeLeaveLimits';
import './EmployeeLeaveLimits.css';

const EmployeeLeaveLimits = () => {
  const [employeeLimits, setEmployeeLimits] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [leaveTypes, setLeaveTypes] = useState([
    'Sick Leave',
    'Vacation Leave', 
    'Emergency Leave',
    'Maternity Leave – 105 days',
    'Paternity Leave – 7 days',
    'Leave for Victims of Violence Against Women and Their Children (VAWC) – 10 days',
    'Parental Leave – 7 days',
    'Women\'s Special Leave – 60 days'
  ]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const [showModal, setShowModal] = useState(false);
  const [editingLimit, setEditingLimit] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [employeeSearchTerm, setEmployeeSearchTerm] = useState('');

  // Form data
  const [formData, setFormData] = useState({
    employee_id: '',
    leave_type: '',
    max_days_per_month: 0,
    max_paid_requests_per_year: 0,
    reason: '',
    effective_from: '',
    effective_until: ''
  });

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);


  const loadData = async () => {
    try {
      setLoading(true);
      const [limitsResponse, employeesResponse] = await Promise.all([
        getEmployeeLeaveLimits(),
        getEmployeesForDropdown()
      ]);

      if (limitsResponse.success) {
        setEmployeeLimits(limitsResponse.data);
      }

      if (employeesResponse.success) {
        setEmployees(employeesResponse.data);
      }

      // Leave types are now hardcoded since we removed the Leave Settings feature
      setLeaveTypes([
        'Sick Leave',
        'Vacation Leave', 
        'Emergency Leave',
        'Maternity Leave – 105 days',
        'Paternity Leave – 7 days',
        'Leave for Victims of Violence Against Women and Their Children (VAWC) – 10 days',
        'Parental Leave – 7 days',
        'Women\'s Special Leave – 60 days'
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
      showAlert('Failed to load data. Please try again.', 'danger');
      // Ensure leaveTypes is still an array even if API fails
      setLeaveTypes([
        'Sick Leave',
        'Vacation Leave', 
        'Emergency Leave',
        'Maternity Leave – 105 days',
        'Paternity Leave – 7 days',
        'Leave for Victims of Violence Against Women and Their Children (VAWC) – 10 days',
        'Parental Leave – 7 days',
        'Women\'s Special Leave – 60 days'
      ]);
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => {
      setAlert({ show: false, message: '', type: '' });
    }, 5000);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };


  const handleAddNew = () => {
    setEditingLimit(null);
    setFormData({
      employee_id: '',
      leave_type: '',
      max_days_per_month: 0,
      max_paid_requests_per_year: 0,
      reason: '',
      effective_from: '',
      effective_until: ''
    });
    setEmployeeSearchTerm('');
    setShowModal(true);
  };

  const handleEdit = (limit) => {
    setEditingLimit(limit);
    setFormData({
      employee_id: limit.employee_id,
      leave_type: limit.leave_type,
      max_days_per_month: limit.max_days_per_month,
      max_paid_requests_per_year: limit.max_paid_requests_per_year,
      reason: limit.reason || '',
      effective_from: limit.effective_from || '',
      effective_until: limit.effective_until || ''
    });
    
    // Set the employee search term to show the selected employee
    const employee = employees.find(emp => emp.id === limit.employee_id);
    if (employee) {
      const name = employee.name || 'Unknown';
      const employeeId = employee.employee_id || 'N/A';
      const department = employee.department || 'N/A';
      setEmployeeSearchTerm(`${name} (${employeeId}) - ${department}`);
    }
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      // Validation
      if (!formData.employee_id || !formData.leave_type) {
        showAlert('Please select an employee and leave type.', 'warning');
        return;
      }

      if (formData.max_days_per_month < 0 || formData.max_paid_requests_per_year < 0) {
        showAlert('Days and paid requests cannot be negative.', 'warning');
        return;
      }

      let response;
      if (editingLimit) {
        response = await updateEmployeeLeaveLimit(editingLimit.id, formData);
      } else {
        response = await saveEmployeeLeaveLimit(formData);
      }

      if (response.success) {
        showAlert(response.message, 'success');
        setShowModal(false);
        loadData(); // Reload data
      } else {
        showAlert(response.message || 'Failed to save limit.', 'danger');
      }
    } catch (error) {
      console.error('Error saving limit:', error);
      showAlert('Failed to save limit. Please try again.', 'danger');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee leave limit?')) {
      try {
        const response = await deleteEmployeeLeaveLimit(id);
        if (response.success) {
          showAlert('Employee leave limit deleted successfully.', 'success');
          loadData(); // Reload data
        } else {
          showAlert('Failed to delete limit.', 'danger');
        }
      } catch (error) {
        console.error('Error deleting limit:', error);
        showAlert('Failed to delete limit. Please try again.', 'danger');
      }
    }
  };

  // Filter data based on search
  const filteredLimits = employeeLimits.filter(limit => {
    const matchesSearch = !searchTerm || 
      limit.employee?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      limit.leave_type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesEmployee = !selectedEmployee || limit.employee_id.toString() === selectedEmployee;
    
    return matchesSearch && matchesEmployee;
  });

  return (
    <Container fluid className="employee-leave-limits">
      <Row>
        <Col>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <div>
                <h5 className="mb-0">
                  <User className="me-2" size={20} />
                  Individual Employee Leave Limits
                </h5>
                <small className="text-muted">
                  Set custom leave limits for specific employees
                </small>
              </div>
              <Button variant="primary" onClick={handleAddNew}>
                <Plus size={16} className="me-1" />
                Add Employee Limit
              </Button>
            </Card.Header>

            <Card.Body>
              {alert.show && (
                <Alert variant={alert.type} dismissible onClose={() => setAlert({ show: false, message: '', type: '' })}>
                  {alert.message}
                </Alert>
              )}

              {/* Search and Filter */}
              <Row className="mb-3">
                <Col md={6}>
                  <InputGroup>
                    <InputGroup.Text>
                      <Search size={16} />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Search by employee name or leave type..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </InputGroup>
                </Col>
                <Col md={3}>
                  <Form.Select
                    value={selectedEmployee}
                    onChange={(e) => setSelectedEmployee(e.target.value)}
                  >
                    <option value="">All Employees</option>
                    {employees.map(employee => (
                      <option key={employee.id} value={employee.id}>
                        {employee.name} ({employee.employee_id})
                      </option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={3}>
                  <Button variant="outline-secondary" onClick={loadData} disabled={loading}>
                    {loading ? 'Loading...' : 'Refresh'}
                  </Button>
                </Col>
              </Row>

              {/* Table */}
              {loading ? (
                <div className="text-center py-4">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <Table responsive striped hover>
                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>Leave Type</th>
                      <th>Max Days/Month</th>
                      <th>Max Paid/Year</th>
                      <th>Reason</th>
                      <th>Effective Period</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLimits.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="text-center py-4 text-muted">
                          No employee leave limits found
                        </td>
                      </tr>
                    ) : (
                      filteredLimits.map(limit => (
                        <tr key={limit.id}>
                          <td>
                            <div>
                              <strong>{limit.employee?.name}</strong>
                              <br />
                              <small className="text-muted">
                                ID: {limit.employee?.employee_id} | {limit.employee?.department}
                              </small>
                            </div>
                          </td>
                          <td>
                            <Badge bg="info">{limit.leave_type}</Badge>
                          </td>
                          <td>
                            <Badge bg="primary">{limit.max_days_per_month} days</Badge>
                          </td>
                          <td>
                            <Badge bg="success">{limit.max_paid_requests_per_year} requests</Badge>
                          </td>
                          <td>
                            <small>{limit.reason || 'No reason provided'}</small>
                          </td>
                          <td>
                            <small>
                              {limit.effective_from && (
                                <div>From: {new Date(limit.effective_from).toLocaleDateString()}</div>
                              )}
                              {limit.effective_until && (
                                <div>Until: {new Date(limit.effective_until).toLocaleDateString()}</div>
                              )}
                              {!limit.effective_from && !limit.effective_until && (
                                <span className="text-muted">Permanent</span>
                              )}
                            </small>
                          </td>
                          <td>
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => handleEdit(limit)}
                              className="me-1"
                            >
                              <Edit size={14} />
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleDelete(limit.id)}
                            >
                              <Trash2 size={14} />
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingLimit ? 'Edit Employee Leave Limit' : 'Add Employee Leave Limit'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Employee <span className="text-danger">*</span></Form.Label>
                  <Form.Select
                    value={formData.employee_id}
                    onChange={(e) => {
                      const selectedId = e.target.value;
                      setFormData(prev => ({ ...prev, employee_id: selectedId }));
                      if (selectedId) {
                        const employee = employees.find(emp => emp.id === selectedId);
                        if (employee) {
                          const name = employee.name || 'Unknown';
                          const employeeId = employee.employee_id || 'N/A';
                          const department = employee.department || 'N/A';
                          setEmployeeSearchTerm(`${name} (${employeeId}) - ${department}`);
                        }
                      } else {
                        setEmployeeSearchTerm('');
                      }
                    }}
                    required
                  >
                    <option value="">Select Employee</option>
                    {employees.map(employee => (
                      <option key={employee.id} value={employee.id}>
                        {employee.name || 'Unknown'} ({employee.department || 'N/A'})
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Leave Type <span className="text-danger">*</span></Form.Label>
                  <Form.Select
                    value={formData.leave_type}
                    onChange={(e) => handleInputChange('leave_type', e.target.value)}
                    required
                  >
                    <option value="">Select Leave Type</option>
                    {Array.isArray(leaveTypes) && leaveTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Max Days Per Month <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    max="31"
                    value={formData.max_days_per_month}
                    onChange={(e) => handleInputChange('max_days_per_month', parseInt(e.target.value) || 0)}
                    required
                  />
                  <Form.Text className="text-muted">
                    Maximum days this employee can take per month for this leave type
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Max Paid Requests Per Year <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    max="12"
                    value={formData.max_paid_requests_per_year}
                    onChange={(e) => handleInputChange('max_paid_requests_per_year', parseInt(e.target.value) || 0)}
                    required
                  />
                  <Form.Text className="text-muted">
                    Maximum paid leave requests per year for this leave type
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Reason for Custom Limit</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.reason}
                onChange={(e) => handleInputChange('reason', e.target.value)}
                placeholder="Explain why this employee needs a custom leave limit (e.g., medical condition, special circumstances)"
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Effective From</Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.effective_from}
                    onChange={(e) => handleInputChange('effective_from', e.target.value)}
                  />
                  <Form.Text className="text-muted">
                    Leave blank for immediate effect
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Effective Until</Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.effective_until}
                    onChange={(e) => handleInputChange('effective_until', e.target.value)}
                  />
                  <Form.Text className="text-muted">
                    Leave blank for permanent limit
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : (editingLimit ? 'Update Limit' : 'Save Limit')}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default EmployeeLeaveLimits;
