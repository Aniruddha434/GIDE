import React, { useState } from 'react';
import styles from './FileExplorer.module.css';

export interface FileSystemNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  children?: FileSystemNode[];
  // content?: string; // Will be added later when we load file content
}

interface FileExplorerProps {
  fileTree: FileSystemNode[];
  onSelectFile: (fileId: string, fileName: string) => void; // Pass fileName for tab title later
  onDeleteNode: (nodeId: string) => void; // Added for deleting nodes
  onCreateFile: (parentId: string | null) => void; // Modified to accept parentId
  onCreateFolder: (parentId: string | null) => void; // Modified to accept parentId
  // onOpenFile: (fileId: string, content: string) => void; // For loading content
}

interface TreeNodeProps {
  node: FileSystemNode;
  onSelectFile: (fileId: string, fileName: string) => void;
  onDeleteNode: (nodeId: string) => void; // Added for deleting nodes
  level: number;
  selectedFolderId: string | null; // To highlight selected folder
  onSelectFolder: (folderId: string | null) => void; // To set the selected folder for creation context
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
  const [isOpen, setIsOpen] = useState(node.type === 'folder'); // Folders open by default

  const handleToggle = () => {
    if (node.type === 'folder') {
      setIsOpen(!isOpen);
    }
  };

  const handleNodeClick = () => {
    if (node.type === 'file') {
      onSelectFile(node.id, node.name);
      onSelectFolder(null); // Clear folder selection when a file is selected
    } else { // node.type === 'folder'
      onSelectFolder(node.id); // Select this folder
      // Optionally toggle if that's desired behavior on folder name click
      // handleToggle(); 
    }
  };

  const handleDelete = (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent triggering onSelect or onToggle
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

  const indent = level * 15; // Indentation for nesting
  const isSelected = node.type === 'folder' && node.id === selectedFolderId;
  const fileType = node.type === 'file' ? node.name.split('.').pop()?.toLowerCase() : undefined;

  return (
    <div className={styles.treeNodeContainer}>
      <div 
        className={`${styles.treeNode} ${node.type === 'folder' ? styles.folderNode : styles.fileNode} ${isSelected ? styles.selectedFolder : ''}`}
        style={{ paddingLeft: `${indent}px` }}
        onClick={handleNodeClick}
        data-file-type={fileType}
      >
        {node.type === 'folder' && (
          <span className={`${styles.icon} ${isOpen ? styles.openIcon : styles.closedIcon}`} onClick={(e) => { e.stopPropagation(); handleToggle();}} >
            {isOpen ? '📂' : '📁'} {/* Simple folder icons */}
          </span>
        )}
        {node.type === 'file' && (
          <span className={styles.icon}>
            {fileType === 'py' ? '🐍' :
             fileType === 'js' ? '📜' :
             fileType === 'html' ? '🌐' :
             fileType === 'css' ? '🎨' :
             fileType === 'json' ? '📋' :
             fileType === 'md' ? '📝' : '📄'}
          </span>
        )}
        <span className={styles.nodeName}>{node.name}</span>
        <div className={styles.nodeActions}>
          {node.type === 'folder' && (
            <>
              <button onClick={handleCreateFileHere} title="New File in this folder" className={styles.actionButtonInline}>📄+</button>
              <button onClick={handleCreateSubfolderHere} title="New Subfolder" className={styles.actionButtonInline}>📁+</button>
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

  // Wrapper for onCreateFile to pass the currently selected folder ID or null for root
  const handleCreateFileRequest = () => {
    onCreateFile(selectedFolderId); 
  };

  // Wrapper for onCreateFolder to pass the currently selected folder ID or null for root
  const handleCreateFolderRequest = () => {
    onCreateFolder(selectedFolderId);
  };

  return (
    <div className={styles.fileExplorerContainer}>
      <div className={styles.header}>
        <span>{selectedFolderId ? `Selected: ${fileTree.find(n => n.id === selectedFolderId)?.name || 'Folder'}` : 'Files'}</span>
        <div className={styles.headerActions}>
          {/* These buttons now create at root or in selected folder based on selectedFolderId */}
          <button onClick={handleCreateFileRequest} title={selectedFolderId ? "New File in Selected Folder" : "New File at Root"} className={styles.actionButton}>📄+</button>
          <button onClick={handleCreateFolderRequest} title={selectedFolderId ? "New Folder in Selected Folder" : "New Folder at Root"} className={styles.actionButton}>📁+</button>
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
            onCreateFileInFolder={onCreateFile} // Directly pass IDE's creation function
            onCreateSubfolder={onCreateFolder}  // Directly pass IDE's creation function
        />
      ))}
    </div>
  );
};

export default FileExplorer; 