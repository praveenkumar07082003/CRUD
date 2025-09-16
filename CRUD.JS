// Employee Management System JavaScript

// Global variables
let employees = [];
let currentEditId = null;
let currentSort = { field: null, direction: 'asc' };

// Sample data initialization
const sampleEmployees = [
    {
        id: 1,
        name: "praveen",
        age: 22,
        dateOfJoining: "2025-09-16",
        email: "praveenkumarprem@gmail.com",
        phone: "555-123-4567"
    }
];

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    // Load sample data
    employees = [...sampleEmployees];
    initializeEventListeners();
    renderEmployeeTable();
    updateRecordCount();
    setMaxDateToToday();
});

// Set maximum date to today for date input
function setMaxDateToToday() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('dateOfJoining').setAttribute('max', today);
}

// Initialize event listeners
function initializeEventListeners() {
    const form = document.getElementById('employee-form');
    const searchInput = document.getElementById('search-input');
    
    form.addEventListener('submit', handleFormSubmit);
    searchInput.addEventListener('input', handleSearch);
    
    // Real-time validation on blur only
    const formInputs = form.querySelectorAll('input');
    formInputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => clearFieldError(input.name));
    });
    
    // Phone number formatting
    const phoneInput = document.getElementById('phone');
    phoneInput.addEventListener('input', formatPhoneNumber);
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
}

// Keyboard shortcuts
function handleKeyboardShortcuts(e) {
    if (e.key === 'Escape') {
        hideDeleteModal();
        cancelEdit();
    }
}

// Form submission handler
function handleFormSubmit(e) {
    e.preventDefault();
    
    // Validate all fields before submission
    if (validateForm()) {
        const formData = new FormData(e.target);
        const employeeData = {
            name: formData.get('name').trim(),
            age: parseInt(formData.get('age')),
            dateOfJoining: formData.get('dateOfJoining'),
            email: formData.get('email').trim(),
            phone: formData.get('phone').trim()
        };
        
        if (currentEditId) {
            updateEmployee(currentEditId, employeeData);
        } else {
            createEmployee(employeeData);
        }
    } else {
        // Show error notification if validation fails
        showNotification('Please fix the errors in the form before submitting.', 'error');
    }
}

// Create new employee
function createEmployee(employeeData) {
    const newEmployee = {
        id: generateUniqueId(),
        ...employeeData
    };
    
    employees.push(newEmployee);
    resetForm();
    renderEmployeeTable();
    updateRecordCount();
    showNotification('Employee added successfully!', 'success');
}

// Update existing employee
function updateEmployee(id, employeeData) {
    const index = employees.findIndex(emp => emp.id === id);
    if (index !== -1) {
        employees[index] = { id, ...employeeData };
        resetForm();
        renderEmployeeTable();
        updateRecordCount();
        showNotification('Employee updated successfully!', 'success');
    }
}

// Delete employee
function deleteEmployee(id) {
    const index = employees.findIndex(emp => emp.id === id);
    if (index !== -1) {
        employees.splice(index, 1);
        renderEmployeeTable();
        updateRecordCount();
        showNotification('Employee deleted successfully!', 'success');
    }
}

// Generate unique ID
function generateUniqueId() {
    return Math.max(0, ...employees.map(emp => emp.id)) + 1;
}

// Form validation - validate all fields
function validateForm() {
    const form = document.getElementById('employee-form');
    const inputs = form.querySelectorAll('input[required]');
    let isValid = true;
    
    // Validate each field and collect results
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    return isValid;
}

// Validate individual field
function validateField(input) {
    const value = input.value.trim();
    const fieldName = input.name;
    let isValid = true;
    let errorMessage = '';
    
    // Clear previous error state
    input.classList.remove('error');
    
    switch (fieldName) {
        case 'name':
            if (!value) {
                errorMessage = 'Name is required';
                isValid = false;
            } else if (value.length < 2) {
                errorMessage = 'Name must be at least 2 characters';
                isValid = false;
            }
            break;
            
        case 'age':
            if (!value) {
                errorMessage = 'Age is required';
                isValid = false;
            } else {
                const age = parseInt(value);
                if (isNaN(age) || age < 18 || age > 65) {
                    errorMessage = 'Age must be between 18 and 65';
                    isValid = false;
                }
            }
            break;
            
        case 'dateOfJoining':
            if (!value) {
                errorMessage = 'Date of joining is required';
                isValid = false;
            } else {
                const selectedDate = new Date(value);
                const today = new Date();
                today.setHours(23, 59, 59, 999); // End of today
                if (selectedDate > today) {
                    errorMessage = 'Date of joining cannot be in the future';
                    isValid = false;
                }
            }
            break;
            
        case 'email':
            if (!value) {
                errorMessage = 'Email is required';
                isValid = false;
            } else {
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(value)) {
                    errorMessage = 'Please enter a valid email address';
                    isValid = false;
                }
            }
            break;
            
        case 'phone':
            if (!value) {
                errorMessage = 'Phone number is required';
                isValid = false;
            } else {
                const phonePattern = /^\d{3}-\d{3}-\d{4}$/;
                if (!phonePattern.test(value)) {
                    errorMessage = 'Phone number must be in format: 123-456-7890';
                    isValid = false;
                }
            }
            break;
    }
    
    // Display error message
    const errorElement = document.getElementById(`${fieldName}-error`);
    if (errorElement) {
        errorElement.textContent = errorMessage;
    }
    
    if (!isValid) {
        input.classList.add('error');
    }
    
    return isValid;
}

// Clear field error
function clearFieldError(fieldName) {
    const errorElement = document.getElementById(`${fieldName}-error`);
    const inputElement = document.querySelector(`[name="${fieldName}"]`);
    
    if (errorElement) {
        errorElement.textContent = '';
    }
    if (inputElement) {
        inputElement.classList.remove('error');
    }
}

// Format phone number
function formatPhoneNumber(e) {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length >= 6) {
        value = value.substring(0, 3) + '-' + value.substring(3, 6) + '-' + value.substring(6, 10);
    } else if (value.length >= 3) {
        value = value.substring(0, 3) + '-' + value.substring(3, 6);
    }
    
    e.target.value = value;
}

// Reset form
function resetForm() {
    const form = document.getElementById('employee-form');
    const formTitle = document.getElementById('form-title');
    const submitBtn = document.getElementById('submit-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    
    form.reset();
    currentEditId = null;
    
    formTitle.textContent = 'Add New Employee';
    submitBtn.querySelector('.btn-text').textContent = 'Add Employee';
    cancelBtn.style.display = 'none';
    
    // Clear all error messages
    const errorElements = form.querySelectorAll('.error-message');
    errorElements.forEach(element => {
        element.textContent = '';
    });
    
    // Remove error classes
    const inputElements = form.querySelectorAll('.form-control');
    inputElements.forEach(element => {
        element.classList.remove('error');
    });
}

// Edit employee
function editEmployee(id) {
    const employee = employees.find(emp => emp.id === id);
    if (!employee) return;
    
    currentEditId = id;
    
    // Clear any existing errors first
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(element => {
        element.textContent = '';
    });
    
    const inputElements = document.querySelectorAll('.form-control');
    inputElements.forEach(element => {
        element.classList.remove('error');
    });
    
    // Populate form with employee data
    document.getElementById('name').value = employee.name;
    document.getElementById('age').value = employee.age;
    document.getElementById('dateOfJoining').value = employee.dateOfJoining;
    document.getElementById('email').value = employee.email;
    document.getElementById('phone').value = employee.phone;
    
    // Update form UI for edit mode
    const formTitle = document.getElementById('form-title');
    const submitBtn = document.getElementById('submit-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    
    formTitle.textContent = 'Edit Employee';
    submitBtn.querySelector('.btn-text').textContent = 'Update Employee';
    cancelBtn.style.display = 'inline-flex';
    
    // Scroll to form
    document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
}

// Cancel edit
function cancelEdit() {
    resetForm();
}

// Show delete confirmation
function showDeleteConfirmation(id) {
    const employee = employees.find(emp => emp.id === id);
    if (!employee) return;
    
    const modal = document.getElementById('delete-modal');
    const employeeDetails = document.getElementById('delete-employee-details');
    const confirmBtn = document.getElementById('confirm-delete-btn');
    
    employeeDetails.textContent = `${employee.name} (${employee.email})`;
    
    // Remove any existing click handlers and add new one
    confirmBtn.onclick = function() {
        deleteEmployee(id);
        hideDeleteModal();
    };
    
    modal.classList.remove('hidden');
}

// Hide delete modal
function hideDeleteModal() {
    const modal = document.getElementById('delete-modal');
    modal.classList.add('hidden');
}

// Search functionality
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const filteredEmployees = employees.filter(employee => 
        employee.name.toLowerCase().includes(searchTerm) ||
        employee.email.toLowerCase().includes(searchTerm) ||
        employee.phone.includes(searchTerm)
    );
    
    renderEmployeeTable(filteredEmployees);
}

// Sort table
function sortTable(field) {
    if (currentSort.field === field) {
        currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
    } else {
        currentSort.field = field;
        currentSort.direction = 'asc';
    }
    
    const sortedEmployees = [...employees].sort((a, b) => {
        let aValue = a[field];
        let bValue = b[field];
        
        if (field === 'age') {
            aValue = parseInt(aValue);
            bValue = parseInt(bValue);
        } else if (field === 'dateOfJoining') {
            aValue = new Date(aValue);
            bValue = new Date(bValue);
        } else {
            aValue = aValue.toLowerCase();
            bValue = bValue.toLowerCase();
        }
        
        if (aValue < bValue) {
            return currentSort.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
            return currentSort.direction === 'asc' ? 1 : -1;
        }
        return 0;
    });
    
    renderEmployeeTable(sortedEmployees);
    updateSortIndicators();
}

// Update sort indicators
function updateSortIndicators() {
    const indicators = document.querySelectorAll('.sort-indicator');
    indicators.forEach(indicator => {
        indicator.className = 'sort-indicator';
    });
    
    if (currentSort.field) {
        const currentHeader = document.querySelector(`th[onclick="sortTable('${currentSort.field}')"] .sort-indicator`);
        if (currentHeader) {
            currentHeader.classList.add(currentSort.direction);
        }
    }
}

// Render employee table
function renderEmployeeTable(employeeList = employees) {
    const tableBody = document.getElementById('employee-table-body');
    const emptyState = document.getElementById('empty-state');
    
    if (employeeList.length === 0) {
        tableBody.innerHTML = '';
        emptyState.classList.remove('hidden');
        return;
    }
    
    emptyState.classList.add('hidden');
    
    const rows = employeeList.map(employee => `
        <tr>
            <td>${escapeHtml(employee.name)}</td>
            <td>${employee.age}</td>
            <td>${formatDate(employee.dateOfJoining)}</td>
            <td>${escapeHtml(employee.email)}</td>
            <td>${escapeHtml(employee.phone)}</td>
            <td>
                <button class="action-btn action-btn--edit" onclick="editEmployee(${employee.id})" title="Edit employee">
                    Edit
                </button>
                <button class="action-btn action-btn--delete" onclick="showDeleteConfirmation(${employee.id})" title="Delete employee">
                    Delete
                </button>
            </td>
        </tr>
    `).join('');
    
    tableBody.innerHTML = rows;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Update record count
function updateRecordCount() {
    const recordCount = document.getElementById('record-count');
    const count = employees.length;
    recordCount.textContent = `${count} employee${count !== 1 ? 's' : ''}`;
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    const messageElement = notification.querySelector('.notification-message');
    
    messageElement.textContent = message;
    notification.className = `notification ${type}`;
    notification.classList.remove('hidden');
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        hideNotification();
    }, 5000);
}

// Hide notification
function hideNotification() {
    const notification = document.getElementById('notification');
    notification.classList.add('hidden');
}

// Export to CSV
function exportToCSV() {
    if (employees.length === 0) {
        showNotification('No data to export', 'error');
        return;
    }
    
    const headers = ['Name', 'Age', 'Date of Joining', 'Email', 'Phone'];
    const csvContent = [
        headers.join(','),
        ...employees.map(employee => [
            `"${employee.name}"`,
            employee.age,
            employee.dateOfJoining,
            `"${employee.email}"`,
            `"${employee.phone}"`
        ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'employees.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showNotification('Employee data exported successfully!', 'success');
    }
}

// Close modal when clicking outside
window.addEventListener('click', function(e) {
    const modal = document.getElementById('delete-modal');
    if (e.target === modal) {
        hideDeleteModal();
    }
});
