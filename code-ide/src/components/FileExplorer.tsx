import React, { useState } from 'react';
import styles from './FileExplorer.module.css';

export interface FileSystemNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  children?: FileSystemNode[];
}

interface FileExplorerProps {
  fileTree: FileSystemNode[];
  onSelectFile: (fileId: string, fileName: string) => void;
  onDeleteNode: (nodeId: string) => void;
  onCreateFile: (parentId: string | null) => void;
  onCreateFolder: (parentId: string | null) => void;
}

interface TreeNodeProps {
  node: FileSystemNode;
  onSelectFile: (fileId: string, fileName: string) => void;
  onDeleteNode: (nodeId: string) => void;
  level: number;
  selectedFolderId: string | null;
  onSelectFolder: (folderId: string | null) => void;
  onCreateFileInFolder: (folderId: string) => void;
  onCreateSubfolder: (folderId: string) => void;
}

const TreeNode: React.FC<TreeNodeProps> = ({ 
    node, 
    onSelectFile, 
    onDeleteNode, 
    level, 
    selectedFolderId,
    onSelectFolder,
    onCreateFileInFolder,
    onCreateSubfolder 
}) => {
  const [isOpen, setIsOpen] = useState(node.type === 'folder');

  const handleToggle = () => {
    if (node.type === 'folder') {
      setIsOpen(!isOpen);
    }
  };

  const handleNodeClick = () => {
    if (node.type === 'file') {
      onSelectFile(node.id, node.name);
      onSelectFolder(null);
    } else {
      onSelectFolder(node.id);
    }
  };

  const handleDelete = (event: React.MouseEvent) => {
    event.stopPropagation();
    onDeleteNode(node.id);
  };
  
  const handleCreateFileHere = (event: React.MouseEvent) => {
    event.stopPropagation();
    onCreateFileInFolder(node.id);
  };

  const handleCreateSubfolderHere = (event: React.MouseEvent) => {
    event.stopPropagation();
    onCreateSubfolder(node.id);
  };

  const fileType = node.type === 'file' ? node.name.split('.').pop()?.toLowerCase() : undefined;
  const isSelected = node.type === 'folder' && node.id === selectedFolderId;

  const getFileIcon = () => {
    if (node.type === 'folder') {
      return isOpen ? '📂' : '📁';
    }
    switch (fileType) {
      case 'py': return '📄';
      case 'js': return '📄';
      case 'html': return '📄';
      case 'css': return '📄';
      case 'json': return '📄';
      case 'md': return '📄';
      default: return '📄';
    }
  };

  return (
    <div className={styles.treeNodeContainer}>
      <div 
        className={`${styles.treeNode} ${isSelected ? styles.selectedFolder : ''}`}
        onClick={handleNodeClick}
      >
        <span 
          className={styles.icon} 
          onClick={(e) => { e.stopPropagation(); handleToggle(); }}
        >
          {getFileIcon()}
        </span>
        <span className={styles.nodeName}>{node.name}</span>
        <div className={styles.nodeActions}>
          {node.type === 'folder' && (
            <>
              <button onClick={handleCreateFileHere} title="New File" className={styles.actionButtonInline}>+</button>
              <button onClick={handleCreateSubfolderHere} title="New Folder" className={styles.actionButtonInline}>+</button>
            </>
          )}
          <button
            className={styles.actionButtonInline}
            onClick={handleDelete}
            title="Delete"
          >
            ×
          </button>
        </div>
      </div>
      {isOpen && node.type === 'folder' && node.children && (
        <div className={styles.childrenContainer}>
          {node.children.map((child) => (
            <TreeNode 
                key={child.id} 
                node={child} 
                onSelectFile={onSelectFile} 
                onDeleteNode={onDeleteNode} 
                level={level + 1} 
                selectedFolderId={selectedFolderId}
                onSelectFolder={onSelectFolder}
                onCreateFileInFolder={onCreateFileInFolder}
                onCreateSubfolder={onCreateSubfolder}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const FileExplorer: React.FC<FileExplorerProps> = ({ fileTree, onSelectFile, onDeleteNode, onCreateFile, onCreateFolder }) => {
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);

  const handleSelectFolder = (folderId: string | null) => {
    setSelectedFolderId(folderId);
  };

  return (
    <div className={styles.fileExplorerContainer}>
      <div className={styles.header}>
        <span>Files</span>
        <div className={styles.headerActions}>
          <button onClick={() => onCreateFile(selectedFolderId)} title="New File" className={styles.actionButton}>New File</button>
          <button onClick={() => onCreateFolder(selectedFolderId)} title="New Folder" className={styles.actionButton}>New Folder</button>
        </div>
      </div>
      {fileTree.map((node) => (
        <TreeNode 
            key={node.id} 
            node={node} 
            onSelectFile={onSelectFile} 
            onDeleteNode={onDeleteNode} 
            level={0} 
            selectedFolderId={selectedFolderId}
            onSelectFolder={handleSelectFolder}
            onCreateFileInFolder={onCreateFile}
            onCreateSubfolder={onCreateFolder}
        />
      ))}
    </div>
  );
};

export default FileExplorer; 