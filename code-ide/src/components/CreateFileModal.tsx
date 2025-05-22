import React, { useState, useEffect, useRef } from 'react';
import styles from './CreateFileModal.module.css';

interface CreateFileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (fileName: string) => void;
  type: 'file' | 'folder';
  existingNames: string[];
}

const CreateFileModal: React.FC<CreateFileModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  type,
  existingNames
}) => {
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = fileName.trim();
    
    if (!trimmedName) {
      setError('Name cannot be empty');
      return;
    }

    if (existingNames.some(name => name.toLowerCase() === trimmedName.toLowerCase())) {
      setError('A file or folder with this name already exists');
      return;
    }

    if (type === 'file' && !trimmedName.includes('.')) {
      setError('File name must include an extension (e.g., .py, .js)');
      return;
    }

    onSubmit(trimmedName);
    setFileName('');
    setError('');
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Create New {type === 'file' ? 'File' : 'Folder'}</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="fileName">
              {type === 'file' ? 'File Name (e.g., script.py):' : 'Folder Name:'}
            </label>
            <input
              ref={inputRef}
              id="fileName"
              type="text"
              value={fileName}
              onChange={(e) => {
                setFileName(e.target.value);
                setError('');
              }}
              placeholder={type === 'file' ? 'Enter file name with extension' : 'Enter folder name'}
              className={error ? styles.inputError : ''}
            />
            {error && <div className={styles.errorMessage}>{error}</div>}
          </div>

          <div className={styles.buttonGroup}>
            <button type="button" className={styles.cancelButton} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.createButton}>
              Create {type === 'file' ? 'File' : 'Folder'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateFileModal; 