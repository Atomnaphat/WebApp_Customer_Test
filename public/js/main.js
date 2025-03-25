/**
 * Document Ready Handler
 * Initializes the application when the DOM is fully loaded
 */
$(document).ready(function() {
    // Load existing customers when page loads
    loadCustomers();

    /**
     * Form Submit Handler
     * Handles the submission of new customer data
     */
    $('#customerForm').on('submit', function(e) {
        e.preventDefault();
        
        const customerData = {
            firstName: $('#firstName').val(),
            lastName: $('#lastName').val(),
            email: $('#email').val(),
            phone: $('#phone').val(),
            address: $('#address').val()
        };

        // Submit customer data to API
        $.ajax({
            url: '/api/customers',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(customerData),
            success: function(response) {
                showAlert('success', 'Customer added successfully!');
                $('#customerForm')[0].reset();
                loadCustomers();
            },
            error: function(xhr, status, error) {
                showAlert('danger', 'Error adding customer: ' + error);
            }
        });
    });
});

/**
 * Load Customers
 * Fetches and displays all customers from the database
 */
function loadCustomers() {
    $.ajax({
        url: '/api/customers',
        method: 'GET',
        success: function(customers) {
            const customerList = $('#customerList');
            customerList.empty();

            customers.forEach(function(customer) {
                const row = $('<tr>');
                row.append($('<td>').text(`${customer.firstName} ${customer.lastName}`));
                row.append($('<td>').text(customer.email));
                row.append($('<td>').text(customer.phone));
                row.append($('<td>').text(customer.address));
                row.append($('<td>').text(new Date(customer.createdAt).toLocaleDateString()));
                
                // Add delete button
                const deleteButton = $('<button>')
                    .addClass('btn btn-danger btn-sm')
                    .html('<i class="fas fa-trash"></i>')
                    .click(function() {
                        if (confirm('Are you sure you want to delete this customer?')) {
                            deleteCustomer(customer._id);
                        }
                    });
                
                row.append($('<td>').append(deleteButton));
                customerList.append(row);
            });
        },
        error: function(xhr, status, error) {
            showAlert('danger', 'Error loading customers: ' + error);
        }
    });
}

/**
 * Delete Customer
 * Removes a customer from the database by ID
 * @param {string} customerId - The ID of the customer to delete
 */
function deleteCustomer(customerId) {
    $.ajax({
        url: `/api/customers/${customerId}`,
        method: 'DELETE',
        success: function(response) {
            showAlert('success', 'Customer deleted successfully!');
            loadCustomers();
        },
        error: function(xhr, status, error) {
            showAlert('danger', 'Error deleting customer: ' + error);
        }
    });
}

/**
 * Show Alert
 * Displays a bootstrap alert message
 * @param {string} type - The type of alert ('success' or 'danger')
 * @param {string} message - The message to display
 */
function showAlert(type, message) {
    const alertDiv = $('<div>')
        .addClass(`alert alert-${type} alert-dismissible fade show`)
        .attr('role', 'alert')
        .html(`
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `);

    // Insert alert before the first card
    $('.card:first').before(alertDiv);

    // Auto-dismiss after 3 seconds
    setTimeout(function() {
        alertDiv.alert('close');
    }, 3000);
} 