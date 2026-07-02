import React from 'react';
import Modal from './Modal.jsx';

const ConfirmDialog = ({ open, title = 'Are you sure?', message, onConfirm, onCancel, confirmLabel = 'Confirm', danger = false }) => (
  <Modal
    open={open}
    onClose={onCancel}
    title={title}
    footer={
      <>
        <button className="btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button className={danger ? 'btn-danger' : 'btn-primary'} onClick={onConfirm}>
          {confirmLabel}
        </button>
      </>
    }
  >
    <p className="text-sm text-gray-600 dark:text-gray-300">{message}</p>
  </Modal>
);

export default ConfirmDialog;
