import React from 'react';
import { Modal } from 'react-bootstrap';
import { useAdvancedModalConfirmation } from '../../hooks/useModalConfirmation';
import '../../styles/ModalConfirmation.css';

/**
 * A reusable Modal component with built-in confirmation functionality
 * Shows a toast confirmation when user tries to close the modal
 */
const ConfirmableModal = ({
  show,
  onHide,
  onConfirm,
  onCancel,
  modalName,
  title,
  children,
  size = 'lg',
  className = '',
  backdrop = true,
  keyboard = true,
  centered = false,
  scrollable = false,
  fullscreen = false,
  confirmationOptions = {},
  ...props
}) => {
  const {
    showModal,
    handleCloseRequest,
    forceCloseModal
  } = useAdvancedModalConfirmation(
    modalName || title || 'Modal',
    onConfirm || onHide,
    onCancel,
    {
      title: 'Confirm Modal Close',
      message: `Are you sure you want to close "${modalName || title || 'this modal'}"?`,
      ...confirmationOptions
    }
  );

  // Handle the modal close request
  const handleModalClose = () => {
    handleCloseRequest();
  };

  // Handle the close button click
  const handleCloseButtonClick = () => {
    handleModalClose();
  };

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleModalClose();
    }
  };

  return (
    <Modal
      show={show}
      onHide={handleModalClose}
      size={size}
      className={className}
      backdrop={backdrop}
      keyboard={keyboard}
      centered={centered}
      scrollable={scrollable}
      fullscreen={fullscreen}
      onClick={handleBackdropClick}
      {...props}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          // Clone the child and add our custom close handler to Modal.Header
          if (child.type === Modal.Header) {
            return React.cloneElement(child, {
              closeButton: true,
              onClose: handleCloseButtonClick
            });
          }
          // For Modal.Footer, we might want to add a close button if it doesn't exist
          if (child.type === Modal.Footer) {
            const hasCloseButton = React.Children.toArray(child.props.children).some(
              (grandChild) => 
                React.isValidElement(grandChild) && 
                (grandChild.props.variant === 'secondary' || 
                 grandChild.props.className?.includes('btn-secondary') ||
                 grandChild.props.onClick === onHide)
            );
            
            if (!hasCloseButton) {
              return React.cloneElement(child, {
                children: [
                  ...React.Children.toArray(child.props.children),
                  <button
                    key="modal-close-btn"
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCloseButtonClick}
                  >
                    Close
                  </button>
                ]
              });
            }
          }
        }
        return child;
      })}
    </Modal>
  );
};

export default ConfirmableModal;
