import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useAdvancedModalConfirmation } from '../../hooks/useModalConfirmation';
import '../../styles/ModalConfirmation.css';

/**
 * Example component demonstrating how to use the modal confirmation functionality
 * This shows the basic usage pattern for implementing confirmation toasts
 */
const ModalConfirmationExample = () => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });

  // Example 1: Basic modal confirmation
  const basicModalConfirmation = useAdvancedModalConfirmation(
    'Basic Form',
    () => {
      setShowModal(false);
      setFormData({ name: '', email: '' });
    },
    null,
    {
      title: 'Confirm Close Form',
      message: 'Are you sure you want to close this form? Any unsaved changes will be lost.',
      icon: '📝'
    }
  );

  // Example 2: Advanced modal confirmation with custom options
  const advancedModalConfirmation = useAdvancedModalConfirmation(
    'Advanced Settings',
    () => {
      setShowModal(false);
      setFormData({ name: '', email: '' });
    },
    () => {
      // Custom cancel action - could save as draft, etc.
      console.log('User chose to keep modal open');
    },
    {
      title: 'Save Changes?',
      message: 'You have unsaved changes. Do you want to save them before closing?',
      icon: '💾',
      confirmText: 'Save & Close',
      cancelText: 'Keep Editing'
    }
  );

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="p-4">
      <h3>Modal Confirmation Examples</h3>
      <p className="text-muted mb-4">
        These examples demonstrate how to use the modal confirmation functionality.
        Try opening a modal and then clicking the close button or clicking outside the modal.
      </p>

      <div className="d-flex gap-3 mb-4">
        <Button 
          variant="primary" 
          onClick={() => setShowModal(true)}
        >
          Open Basic Modal
        </Button>
        
        <Button 
          variant="secondary" 
          onClick={() => setShowModal(true)}
        >
          Open Advanced Modal
        </Button>
      </div>

      {/* Basic Modal Example */}
      <Modal 
        show={showModal} 
        onHide={basicModalConfirmation.handleCloseRequest}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Basic Form Example</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter your name"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={basicModalConfirmation.handleCloseRequest}
          >
            Cancel
          </Button>
          <Button variant="primary">
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Usage Instructions */}
      <div className="mt-5">
        <h4>How to Use</h4>
        <div className="bg-light p-3 rounded">
          <h6>1. Import the hook:</h6>
          <pre className="bg-dark text-light p-2 rounded">
{`import { useAdvancedModalConfirmation } from '../hooks/useModalConfirmation';`}
          </pre>

          <h6 className="mt-3">2. Create the confirmation hook:</h6>
          <pre className="bg-dark text-light p-2 rounded">
{`const modalConfirmation = useAdvancedModalConfirmation(
  'Modal Name',
  () => {
    // Actions to perform when user confirms close
    setShowModal(false);
    resetForm();
  },
  () => {
    // Optional: Actions when user cancels close
    console.log('User kept modal open');
  },
  {
    title: 'Confirm Close',
    message: 'Are you sure you want to close this modal?',
    icon: '⚠️'
  }
);`}
          </pre>

          <h6 className="mt-3">3. Use in your Modal:</h6>
          <pre className="bg-dark text-light p-2 rounded">
{`<Modal 
  show={showModal} 
  onHide={modalConfirmation.handleCloseRequest}
>
  {/* Modal content */}
</Modal>`}
          </pre>

          <h6 className="mt-3">4. Update Cancel buttons:</h6>
          <pre className="bg-dark text-light p-2 rounded">
{`<Button 
  variant="secondary" 
  onClick={modalConfirmation.handleCloseRequest}
>
  Cancel
</Button>`}
          </pre>

          <h6 className="mt-3">5. Enhanced Features:</h6>
          <ul className="list-unstyled">
            <li>✨ <strong>Modern Design:</strong> Rounded corners, gradients, and shadows</li>
            <li>🎨 <strong>Better Visual Hierarchy:</strong> Clear title and message separation</li>
            <li>📱 <strong>Responsive:</strong> Adapts to mobile screens</li>
            <li>🎭 <strong>Smooth Animations:</strong> Slide-in effect and hover animations</li>
            <li>♿ <strong>Accessible:</strong> Proper focus states and keyboard navigation</li>
            <li>🎯 <strong>Interactive Buttons:</strong> Hover effects and shimmer animations</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirmationExample;
