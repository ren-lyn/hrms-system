import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTachometerAlt,
  faUser,
  faMoneyBillWave,
  faCalendarAlt,
  faHandHoldingUsd,
  faSignOutAlt,
  faEnvelope,
  faBell,
  faChartBar,
  faClock,
  faBars,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';

const EmployeeDashboard = () => {
  const [employeeName, setEmployeeName] = useState('');
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [timeNow, setTimeNow] = useState(new Date());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState('dashboard'); // default view

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/user');
        setEmployeeName(res.data.name);
      } catch (err) {
        console.error('Failed to fetch user info', err);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeNow(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getHeaderTitle = () => {
    switch (activeView) {
      case 'dashboard': return 'Dashboard';
      case 'profile': return 'Profile';
      case 'payroll-summary': return 'Payslip Summary';
      case 'timesheet': return 'Timesheet';
      case 'leave-request': return 'Leave Request';
      case 'cash-advance': return 'Cash Advance';
      case 'evaluation-summary': return 'Evaluation Summary';
      case 'disciplinary-notice': return 'Disciplinary Notice';
      default: return 'Dashboard';
    }
  };

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <div className="row g-4">
            <div className="col-md-6">
              <div className="card shadow-sm p-3 rounded-4">
                <h6 className="text-secondary mb-3">
                  <FontAwesomeIcon icon={faBell} className="me-2 text-warning" /> Notifications
                </h6>
                <ul className="list-unstyled small ps-2">
                  <li>• New company policy update</li>
                  <li>• 1 pending leave request</li>
                  <li>• Company event on Friday</li>
                </ul>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card shadow-sm p-3 rounded-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="text-secondary m-0">
                    <FontAwesomeIcon icon={faCalendarAlt} className="me-2 text-primary" /> Calendar
                  </h6>
                  <span className="small text-muted">
                    <FontAwesomeIcon icon={faClock} className="me-1" />
                    {timeNow.toLocaleTimeString()}
                  </span>
                </div>
                <Calendar onChange={setCalendarDate} value={calendarDate} className="w-100 border-0" />
              </div>
            </div>
          </div>
        );
      case 'leave-request':
        return (
          <div className="card p-4">
            <h5>Request a Leave</h5>
            <form>
              <div className="mb-3">
                <label className="form-label">Leave Type</label>
                <input type="text" className="form-control" placeholder="Vacation / Sick..." />
              </div>
              <div className="mb-3">
                <label className="form-label">From</label>
                <input type="date" className="form-control" />
              </div>
              <div className="mb-3">
                <label className="form-label">To</label>
                <input type="date" className="form-control" />
              </div>
              <button className="btn btn-primary">Submit</button>
            </form>
          </div>
        );
      default:
        return (
          <div className="card p-4">
            This is the <strong>{getHeaderTitle()}</strong> section.
          </div>
        );
    }
  };

  return (
    <div className="d-flex" style={{ minHeight: '100vh', fontFamily: 'Segoe UI, sans-serif' }}>
      {/* Sidebar */}
      <div className="d-none d-md-flex flex-column bg-dark text-white p-4" style={{ width: '18vw', minHeight: '100vh' }}>
        <h5 className="mb-4 text-center fw-bold text-uppercase">CCDC</h5>
        <ul className="nav flex-column gap-3">
          <li><button onClick={() => setActiveView('dashboard')} className="btn btn-link text-start text-white nav-link"><FontAwesomeIcon icon={faTachometerAlt} className="me-2" /> Dashboard</button></li>
          <li><button onClick={() => setActiveView('profile')} className="btn btn-link text-start text-white nav-link"><FontAwesomeIcon icon={faUser} className="me-2" /> Profile</button></li>
          <li><button onClick={() => setActiveView('payroll-summary')} className="btn btn-link text-start text-white nav-link"><FontAwesomeIcon icon={faMoneyBillWave} className="me-2" /> Payslip</button></li>
          <li><button onClick={() => setActiveView('timesheet')} className="btn btn-link text-start text-white nav-link"><FontAwesomeIcon icon={faClock} className="me-2" /> Timesheet</button></li>
          <li><button onClick={() => setActiveView('leave-request')} className="btn btn-link text-start text-white nav-link"><FontAwesomeIcon icon={faCalendarAlt} className="me-2" /> Leave Request</button></li>
          <li><button onClick={() => setActiveView('cash-advance')} className="btn btn-link text-start text-white nav-link"><FontAwesomeIcon icon={faHandHoldingUsd} className="me-2" /> Cash Advance</button></li>
          <li><button onClick={() => setActiveView('evaluation-summary')} className="btn btn-link text-start text-white nav-link"><FontAwesomeIcon icon={faChartBar} className="me-2" /> Evaluation Summary</button></li>
          <li><button onClick={() => setActiveView('disciplinary-notice')} className="btn btn-link text-start text-white nav-link"><FontAwesomeIcon icon={faExclamationTriangle} className="me-2" /> Disciplinary Notice</button></li>
        </ul>
        <div className="mt-auto pt-3 border-top">
          <a href="/logout" className="nav-link text-danger"><FontAwesomeIcon icon={faSignOutAlt} className="me-2" /> Logout</a>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1" style={{ background: 'linear-gradient(to bottom right, #f0f4f8, #d9e2ec)' }}>
        {/* Mobile header */}
        <div className="d-md-none d-flex justify-content-between align-items-center p-2 bg-dark text-white">
          <span className="fw-bold">CCDC</span>
          <FontAwesomeIcon icon={faBars} size="lg" onClick={() => setSidebarOpen(!sidebarOpen)} style={{ cursor: 'pointer' }} />
        </div>

        {/* Header */}
        <div className="container-fluid py-3 px-3 px-md-5">
          <div className="d-flex justify-content-between align-items-center mb-4 bg-white rounded-4 shadow-sm p-3 flex-wrap">
            <h4 className="fw-bold text-primary mb-2 mb-md-0">{getHeaderTitle()}</h4>
            <div className="d-flex align-items-center gap-3">
              <FontAwesomeIcon icon={faEnvelope} size="lg" className="text-primary" />
              <FontAwesomeIcon icon={faBell} size="lg" className="text-primary" />
              <span className="fw-semibold text-dark">{employeeName || 'Employee'}</span>
              <img src="https://i.pravatar.cc/40" alt="Profile" className="rounded-circle" style={{ width: '36px', height: '36px', objectFit: 'cover', border: '2px solid #0d6efd' }} />
            </div>
          </div>

          {/* Content Section */}
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
