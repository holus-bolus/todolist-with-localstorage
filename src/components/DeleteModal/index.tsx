import React from 'react';
import Button from '../Button';
import Modal from '../Modal';
import './style.scss';

const DeleteModal = ({ onCancel, onConfirm }: any) => {
    return (
        <Modal>
            <div className="delete-modal">
                <p>Are you sure you want to delete this task?</p>
                <div className="delete-modal__actions">
                    <Button title="Delete" onClick={onConfirm} />
                    <Button title="Cancel" outline onClick={onCancel} />
                </div>
            </div>
        </Modal>
    );
};

export default DeleteModal;
