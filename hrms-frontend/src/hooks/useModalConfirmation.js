import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';

/**
 * Custom hook for modal confirmation with toast notifications
 * Provides a confirmation dialog when users try to close modals
 * 
 * @param {string} modalName - The name of the modal for the confirmation message
 * @param {function} onConfirm - Callback function to execute when user confirms
 * @param {function} onCancel - Optional callback function to execute when user cancels
 * @param {object} options - Additional options for customization
 * @returns {object} - Object containing modal state and handlers
 */
export const useModalConfirmation = (modalName, onConfirm, onCancel = null, options = {}) => {
  const [showModal, setShowModal] = useState(false);
  const [pendingClose, setPendingClose] = useState(false);

  const {
    confirmText = 'Yes, close',
    cancelText = 'No, keep open',
    position = 'top-center',
    autoClose = 5000,
    hideProgressBar = false,
    closeOnClick = true,
    pauseOnHover = true,
    draggable = true,
    theme = 'light'
  } = options;

  const handleCloseRequest = useCallback(() => {
    if (pendingClose) return; // Prevent multiple confirmation dialogs

    setPendingClose(true);
    
    const toastId = toast(
      <div className="modal-confirmation-toast">
        <div className="toast-header">
          <div className="toast-header-content">
            <div className="toast-icon">⚠️</div>
            <div className="toast-title">Confirm Modal Close</div>
          </div>
        </div>
        <div className="toast-body">
          <p className="toast-message">Are you sure you want to close "{modalName}"?</p>
          <div className="btn-container">
            <button
              className="btn btn-outline-secondary"
              onClick={() => {
                toast.dismiss(toastId);
                setPendingClose(false);
                if (onCancel) onCancel();
              }}
            >
              {cancelText}
            </button>
            <button
              className="btn btn-danger"
              onClick={() => {
                toast.dismiss(toastId);
                setPendingClose(false);
                setShowModal(false);
                if (onConfirm) onConfirm();
              }}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>,
      {
        position: "top-center",
        autoClose: false,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        toastId: `modal-confirmation-${modalName}-${Date.now()}`,
        className: "custom-modal-confirmation-toast",
        bodyClassName: "custom-modal-confirmation-body"
      }
    );
  }, [modalName, onConfirm, onCancel, pendingClose, confirmText, cancelText]);

  const openModal = useCallback(() => {
    setShowModal(true);
    setPendingClose(false);
  }, []);

  const closeModal = useCallback(() => {
    setShowModal(false);
    setPendingClose(false);
  }, []);

  const forceCloseModal = useCallback(() => {
    setShowModal(false);
    setPendingClose(false);
    if (onConfirm) onConfirm();
  }, [onConfirm]);

  return {
    showModal,
    openModal,
    closeModal,
    handleCloseRequest,
    forceCloseModal,
    isPendingClose: pendingClose
  };
};

/**
 * Enhanced version that provides a more sophisticated confirmation dialog
 * with better styling and more options
 */
export const useAdvancedModalConfirmation = (modalName, onConfirm, onCancel = null, options = {}) => {
  const [showModal, setShowModal] = useState(false);
  const [pendingClose, setPendingClose] = useState(false);

  const {
    confirmText = 'Yes, close',
    cancelText = 'No, keep open',
    title = 'Confirm Modal Close',
    message = `Are you sure you want to close "${modalName}"?`,
    icon = '⚠️',
    position = 'top-center',
    autoClose = false, // Don't auto-close for confirmation dialogs
    hideProgressBar = true,
    closeOnClick = false, // Don't close on click for confirmation
    pauseOnHover = true,
    draggable = true,
    theme = 'light',
    className = 'modal-confirmation-toast'
  } = options;

  const handleCloseRequest = useCallback(() => {
    if (pendingClose) return;

    setPendingClose(true);
    
    const toastId = toast(
      <div className={`modal-confirmation-toast ${className}`}>
        <div className="toast-header">
          <div className="toast-header-content">
            <div className="toast-icon">{icon}</div>
            <div className="toast-title">{title}</div>
          </div>
        </div>
        <div className="toast-body">
          <p className="toast-message">{message}</p>
          <div className="btn-container">
            <button
              className="btn btn-outline-secondary"
              onClick={() => {
                toast.dismiss(toastId);
                setPendingClose(false);
                if (onCancel) onCancel();
              }}
            >
              {cancelText}
            </button>
            <button
              className="btn btn-danger"
              onClick={() => {
                toast.dismiss(toastId);
                setPendingClose(false);
                setShowModal(false);
                if (onConfirm) onConfirm();
              }}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>,
      {
        position: "top-center",
        autoClose: false,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        toastId: `modal-confirmation-${modalName}-${Date.now()}`,
        className: "custom-modal-confirmation-toast",
        bodyClassName: "custom-modal-confirmation-body"
      }
    );
  }, [modalName, onConfirm, onCancel, pendingClose, confirmText, cancelText, title, message, icon, className]);

  const openModal = useCallback(() => {
    setShowModal(true);
    setPendingClose(false);
  }, []);

  const closeModal = useCallback(() => {
    setShowModal(false);
    setPendingClose(false);
  }, []);

  const forceCloseModal = useCallback(() => {
    setShowModal(false);
    setPendingClose(false);
    if (onConfirm) onConfirm();
  }, [onConfirm]);

  return {
    showModal,
    openModal,
    closeModal,
    handleCloseRequest,
    forceCloseModal,
    isPendingClose: pendingClose
  };
};

export default useModalConfirmation;
