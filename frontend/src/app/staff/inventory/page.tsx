'use client';

import { useState } from 'react';
import Navbar from '@/src/components/Navigation/Navbar';
import { Search, Filter, Plus, Download, Printer, ChevronDown, X, Edit2, Trash2, Package } from 'lucide-react';
import styles from './page.module.css';

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  reorderLevel: number;
  lastUpdated: string;
  location?: string;
  supplier?: string;
}

export default function InventoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([
    { 
      id: '1', 
      name: 'Basmati Rice', 
      category: 'Grains', 
      quantity: 60, 
      unit: 'kg', 
      reorderLevel: 20, 
      lastUpdated: '2024-01-15',
      location: 'Storage A1',
      supplier: 'GrainCo'
    },
    { 
      id: '2', 
      name: 'Fresh Vegetables', 
      category: 'Produce', 
      quantity: 25, 
      unit: 'kg', 
      reorderLevel: 30, 
      lastUpdated: '2024-01-15',
      location: 'Cooler B2',
      supplier: 'FarmFresh'
    },
    { 
      id: '3', 
      name: 'Chicken Breast', 
      category: 'Meat', 
      quantity: 22, 
      unit: 'kg', 
      reorderLevel: 15, 
      lastUpdated: '2024-01-14',
      location: 'Freezer C3',
      supplier: 'MeatMasters'
    },
    { 
      id: '4', 
      name: 'Mixed Spices', 
      category: 'Seasonings', 
      quantity: 8, 
      unit: 'kg', 
      reorderLevel: 5, 
      lastUpdated: '2024-01-14',
      location: 'Pantry D4',
      supplier: 'SpiceWorld'
    },
    { 
      id: '5', 
      name: 'Olive Oil', 
      category: 'Cooking', 
      quantity: 15, 
      unit: 'l', 
      reorderLevel: 10, 
      lastUpdated: '2024-01-13',
      location: 'Storage A2',
      supplier: 'OilKing'
    },
    { 
      id: '6', 
      name: 'Whole Milk', 
      category: 'Dairy', 
      quantity: 20, 
      unit: 'l', 
      reorderLevel: 15, 
      lastUpdated: '2024-01-15',
      location: 'Cooler B1',
      supplier: 'DairyDelight'
    },
    { 
      id: '7', 
      name: 'Wheat Flour', 
      category: 'Grains', 
      quantity: 45, 
      unit: 'kg', 
      reorderLevel: 25, 
      lastUpdated: '2024-01-14',
      location: 'Storage A3',
      supplier: 'GrainCo'
    },
    { 
      id: '8', 
      name: 'Sugar', 
      category: 'Seasonings', 
      quantity: 35, 
      unit: 'kg', 
      reorderLevel: 15, 
      lastUpdated: '2024-01-13',
      location: 'Pantry D3',
      supplier: 'SweetSupplies'
    },
  ]);
  
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [newItem, setNewItem] = useState({
    name: '',
    category: 'Grains',
    quantity: 0,
    unit: 'kg',
    reorderLevel: 10,
    location: '',
    supplier: ''
  });

  const categories = ['all', 'Grains', 'Produce', 'Meat', 'Dairy', 'Seasonings', 'Cooking'];
  const units = ['kg', 'g', 'l', 'ml', 'pcs', 'boxes'];

  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.supplier?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalItems = inventoryItems.length;
  const lowStockItems = inventoryItems.filter(item => item.quantity <= item.reorderLevel).length;
  const totalQuantity = inventoryItems.reduce((sum, item) => sum + item.quantity, 0);

  // Function to handle adding a new item
  const handleAddItem = () => {
    if (!newItem.name.trim()) {
      alert('Please enter an item name');
      return;
    }

    const newInventoryItem: InventoryItem = {
      id: (Math.max(...inventoryItems.map(i => parseInt(i.id)), 0) + 1).toString(),
      name: newItem.name,
      category: newItem.category,
      quantity: newItem.quantity,
      unit: newItem.unit,
      reorderLevel: newItem.reorderLevel,
      lastUpdated: new Date().toISOString().split('T')[0],
      location: newItem.location || 'Default Storage',
      supplier: newItem.supplier || 'Unknown Supplier'
    };

    setInventoryItems([...inventoryItems, newInventoryItem]);
    
    // Reset form
    resetForm();
    setIsAddingItem(false);
  };

  // Function to handle editing an item
  const handleEditItem = () => {
    if (!editingItem || !newItem.name.trim()) {
      alert('Please enter an item name');
      return;
    }

    setInventoryItems(inventoryItems.map(item => 
      item.id === editingItem.id 
        ? {
            ...item,
            name: newItem.name,
            category: newItem.category,
            quantity: newItem.quantity,
            unit: newItem.unit,
            reorderLevel: newItem.reorderLevel,
            location: newItem.location || 'Default Storage',
            supplier: newItem.supplier || 'Unknown Supplier',
            lastUpdated: new Date().toISOString().split('T')[0]
          }
        : item
    ));

    resetForm();
    setEditingItem(null);
  };

  // Function to open edit modal
  const openEditModal = (item: InventoryItem) => {
    setEditingItem(item);
    setNewItem({
      name: item.name,
      category: item.category,
      quantity: item.quantity,
      unit: item.unit,
      reorderLevel: item.reorderLevel,
      location: item.location || '',
      supplier: item.supplier || ''
    });
  };

  // Function to delete an item
  const handleDeleteItem = (itemId: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      setInventoryItems(inventoryItems.filter(item => item.id !== itemId));
    }
  };

  // Function to reset form
  const resetForm = () => {
    setNewItem({
      name: '',
      category: 'Grains',
      quantity: 0,
      unit: 'kg',
      reorderLevel: 10,
      location: '',
      supplier: ''
    });
  };

  // Function to close modal
  const closeModal = () => {
    setIsAddingItem(false);
    setEditingItem(null);
    resetForm();
  };

  // Function to export CSV
  const handleExportCSV = () => {
    const headers = ['ID', 'Name', 'Category', 'Quantity', 'Unit', 'Reorder Level', 'Location', 'Supplier', 'Last Updated', 'Status'];
    
    const csvRows = [
      headers.join(','),
      ...inventoryItems.map(item => {
        const isLow = item.quantity <= item.reorderLevel;
        const status = isLow ? 'Low Stock' : 'Adequate';
        
        return [
          item.id,
          `"${item.name}"`,
          `"${item.category}"`,
          item.quantity,
          item.unit,
          item.reorderLevel,
          `"${item.location || ''}"`,
          `"${item.supplier || ''}"`,
          item.lastUpdated,
          status
        ].join(',');
      })
    ];

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `inventory_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Function to print report
  const handlePrintReport = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to print the report');
      return;
    }

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Kitchen Inventory Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #333; border-bottom: 3px solid #3b82f6; padding-bottom: 10px; }
          .report-header { margin-bottom: 30px; }
          .date { color: #666; font-size: 14px; }
          .summary { 
            display: grid; 
            grid-template-columns: repeat(2, 1fr); 
            gap: 20px; 
            margin-bottom: 30px;
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
          }
          .summary-item { 
            padding: 15px;
            background: white;
            border-radius: 6px;
            border-left: 4px solid #3b82f6;
          }
          .summary-label { 
            font-size: 12px; 
            color: #666; 
            text-transform: uppercase;
            font-weight: 600;
          }
          .summary-value { 
            font-size: 28px; 
            font-weight: bold; 
            color: #333; 
            margin-top: 5px;
          }
          table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-top: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          th { 
            background-color: #3b82f6; 
            color: white; 
            padding: 12px; 
            text-align: left;
            font-weight: 600;
          }
          td { 
            padding: 10px; 
            border-bottom: 1px solid #e5e7eb;
          }
          tr:hover { background-color: #f8f9fa; }
          .low-stock { 
            color: #dc2626; 
            font-weight: bold;
          }
          .adequate { 
            color: #059669; 
            font-weight: bold;
          }
          .status-badge {
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
          }
          .status-low {
            background: #fee2e2;
            color: #dc2626;
          }
          .status-ok {
            background: #d1fae5;
            color: #059669;
          }
          @media print {
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="report-header">
          <h1>📦 Kitchen Inventory Report</h1>
          <p class="date">Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
        </div>
        
        <div class="summary">
          <div class="summary-item">
            <div class="summary-label">Total Items</div>
            <div class="summary-value">${totalItems}</div>
          </div>
          <div class="summary-item">
            <div class="summary-label">Low Stock Items</div>
            <div class="summary-value" style="color: #dc2626;">${lowStockItems}</div>
          </div>
          <div class="summary-item">
            <div class="summary-label">Total Quantity</div>
            <div class="summary-value">${totalQuantity}</div>
          </div>
          <div class="summary-item">
            <div class="summary-label">Categories</div>
            <div class="summary-value">${categories.length - 1}</div>
          </div>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>Unit</th>
              <th>Reorder Level</th>
              <th>Location</th>
              <th>Supplier</th>
              <th>Status</th>
              <th>Last Updated</th>
            </tr>
          </thead>
          <tbody>
            ${inventoryItems.map(item => {
              const isLow = item.quantity <= item.reorderLevel;
              return `
                <tr>
                  <td><strong>${item.name}</strong></td>
                  <td>${item.category}</td>
                  <td class="${isLow ? 'low-stock' : 'adequate'}">${item.quantity}</td>
                  <td>${item.unit}</td>
                  <td>${item.reorderLevel}</td>
                  <td>${item.location}</td>
                  <td>${item.supplier}</td>
                  <td><span class="status-badge ${isLow ? 'status-low' : 'status-ok'}">${isLow ? 'Low Stock' : 'Adequate'}</span></td>
                  <td>${item.lastUpdated}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
        
        <div style="margin-top: 40px; padding-top: 20px; border-top: 2px solid #e5e7eb; text-align: center; color: #666;">
          <p><strong>Note:</strong> Items marked as "Low Stock" need to be reordered soon.</p>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.content}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>📦 Kitchen Inventory</h1>
            <p className={styles.subtitle}>
              Manage and track your kitchen supplies in real-time
            </p>
          </div>
          <div className={styles.headerActions}>
            <button onClick={() => setIsAddingItem(true)} className={styles.primaryButton}>
              <Plus size={20} />
              Add Item
            </button>
            <button onClick={handleExportCSV} className={styles.secondaryButton}>
              <Download size={20} />
              Export CSV
            </button>
            <button onClick={handlePrintReport} className={styles.secondaryButton}>
              <Printer size={20} />
              Print Report
            </button>
          </div>
        </div>

        {/* Add/Edit Item Modal */}
        {(isAddingItem || editingItem) && (
          <div className={styles.modalOverlay} onClick={closeModal}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h2 className={styles.modalTitle}>
                  <Package size={24} />
                  {editingItem ? 'Edit Item' : 'Add New Item'}
                </h2>
                <button onClick={closeModal} className={styles.modalCloseButton}>
                  <X size={20} />
                </button>
              </div>

              <div className={styles.modalForm}>
                <div className={styles.formGroup}>
                  <label className={`${styles.formLabel} ${styles.formLabelRequired}`}>
                    Item Name
                  </label>
                  <input
                    type="text"
                    value={newItem.name}
                    onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                    className={styles.formInput}
                    placeholder="e.g., Basmati Rice, Chicken Breast"
                    required
                    autoFocus
                  />
                </div>

                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label className={`${styles.formLabel} ${styles.formLabelRequired}`}>
                      Category
                    </label>
                    <select
                      value={newItem.category}
                      onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                      className={styles.formSelect}
                      required
                    >
                      {categories.filter(cat => cat !== 'all').map(category => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={`${styles.formLabel} ${styles.formLabelRequired}`}>
                      Unit
                    </label>
                    <select
                      value={newItem.unit}
                      onChange={(e) => setNewItem({...newItem, unit: e.target.value})}
                      className={styles.formSelect}
                      required
                    >
                      {units.map(unit => (
                        <option key={unit} value={unit}>
                          {unit}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label className={`${styles.formLabel} ${styles.formLabelRequired}`}>
                      Quantity
                    </label>
                    <input
                      type="number"
                      value={newItem.quantity}
                      onChange={(e) => setNewItem({...newItem, quantity: parseFloat(e.target.value) || 0})}
                      min="0"
                      step="0.01"
                      className={styles.formInput}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>
                      Reorder Level
                    </label>
                    <input
                      type="number"
                      value={newItem.reorderLevel}
                      onChange={(e) => setNewItem({...newItem, reorderLevel: parseFloat(e.target.value) || 0})}
                      min="0"
                      step="0.01"
                      className={styles.formInput}
                      required
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    Location
                  </label>
                  <input
                    type="text"
                    value={newItem.location}
                    onChange={(e) => setNewItem({...newItem, location: e.target.value})}
                    className={styles.formInput}
                    placeholder="e.g., Storage A1, Cooler B2"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    Supplier (Optional)
                  </label>
                  <input
                    type="text"
                    value={newItem.supplier}
                    onChange={(e) => setNewItem({...newItem, supplier: e.target.value})}
                    className={styles.formInput}
                    placeholder="Enter supplier name"
                  />
                </div>
              </div>

              <div className={styles.modalActions}>
                <button onClick={closeModal} className={styles.cancelButton}>
                  Cancel
                </button>
                <button 
                  onClick={editingItem ? handleEditItem : handleAddItem} 
                  className={styles.submitButton}
                >
                  {editingItem ? 'Update Item' : 'Add Item'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Filters Section */}
        <div className={styles.filters}>
          <div className={styles.searchBar}>
            <Search className={styles.searchIcon} size={20} />
            <input
              type="text"
              placeholder="Search by name, category, location, or supplier..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className={styles.clearSearch}
                aria-label="Clear search"
              >
                <X size={18} />
              </button>
            )}
          </div>
          <div className={styles.categoryFilter}>
            <Filter size={18} />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={styles.categorySelect}
            >
              <option value="all">All Categories</option>
              {categories.filter(cat => cat !== 'all').map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <ChevronDown size={16} />
          </div>
        </div>

        {/* Inventory Table */}
        <div className={styles.tableContainer}>
          <div className={styles.tableHeader}>
            <div className={styles.tableHeaderContent}>
              <span>Showing {filteredItems.length} of {totalItems} items</span>
              {searchQuery && (
                <span className={styles.searchResults}>
                  Search results for: "<strong>{searchQuery}</strong>"
                </span>
              )}
            </div>
          </div>
          
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Item</th>
                <th>Category</th>
                <th>Quantity / Unit</th>
                <th>Location</th>
                <th>Reorder Level</th>
                <th>Status</th>
                <th>Last Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length > 0 ? (
                filteredItems.map(item => {
                  const isLow = item.quantity <= item.reorderLevel;
                  const isCritical = item.quantity <= item.reorderLevel / 2;
                  
                  return (
                    <tr key={item.id}>
                      <td>
                        <div className={styles.itemName}>
                          <div 
                            className={styles.itemDot} 
                            style={{ 
                              backgroundColor: isCritical ? '#ef4444' : isLow ? '#f97316' : '#10b981' 
                            }} 
                          />
                          <div>
                            <div className={styles.itemNameText}>{item.name}</div>
                            {item.supplier && (
                              <div className={styles.itemSupplier}>
                                Supplier: {item.supplier}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={styles.categoryBadge}>
                          {item.category}
                        </span>
                      </td>
                      <td>
                        <div className={styles.quantityCell}>
                          <span className={isLow ? styles.lowQuantity : styles.normalQuantity}>
                            {item.quantity}
                          </span>
                          <span className={styles.quantityUnit}>/ {item.unit}</span>
                        </div>
                      </td>
                      <td>{item.location}</td>
                      <td>
                        <div className={styles.reorderCell}>
                          <span>{item.reorderLevel}</span>
                          <span className={styles.reorderUnit}>{item.unit}</span>
                        </div>
                      </td>
                      <td>
                        <span className={isLow ? styles.statusAlert : styles.statusOk}>
                          {isCritical ? 'Critical' : isLow ? 'Low Stock' : 'Adequate'}
                        </span>
                      </td>
                      <td>{item.lastUpdated}</td>
                      <td>
                        <div className={styles.actionButtons}>
                          <button
                            onClick={() => openEditModal(item)}
                            className={`${styles.actionButton} ${styles.editButton}`}
                            title="Edit item"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className={`${styles.actionButton} ${styles.deleteButton}`}
                            title="Delete item"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className={styles.noResultsCell}>
                    <div className={styles.noResultsContent}>
                      <Search size={48} />
                      <div className={styles.noResultsTitle}>No items found</div>
                      <div className={styles.noResultsMessage}>
                        {searchQuery ? 'Try a different search term' : 'Add items to get started'}
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Summary Stats */}
        <div className={styles.stats}>
          <div className={styles.statCard}>
            <h4 className={styles.statTitle}>Total Items</h4>
            <p className={styles.statValue}>{totalItems}</p>
            <div className={styles.statSubtitle}>
              {filteredItems.length} currently showing
            </div>
          </div>
          <div className={styles.statCard}>
            <h4 className={styles.statTitle}>Low Stock Items</h4>
            <p className={styles.statValue} style={{ color: 'var(--color-danger)' }}>
              {lowStockItems}
            </p>
            <div className={styles.statSubtitle}>
              Needs attention
            </div>
          </div>
          <div className={styles.statCard}>
            <h4 className={styles.statTitle}>Total Quantity</h4>
            <p className={styles.statValue}>{totalQuantity}</p>
            <div className={styles.statSubtitle}>
              Across all items
            </div>
          </div>
          <div className={styles.statCard}>
            <h4 className={styles.statTitle}>Categories</h4>
            <p className={styles.statValue}>{categories.length - 1}</p>
            <div className={styles.statSubtitle}>
              Different types
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
