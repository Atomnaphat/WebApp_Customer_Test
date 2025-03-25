// Wait for DOM to be fully loaded
$(document).ready(function() {
    // Load customers when page loads
    loadCustomers();

    // Handle form submission
    $('#customerForm').on('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const customerData = {
            name: $('#name').val(),
            email: $('#email').val(),
            phone: $('#phone').val(),
            address: $('#address').val()
        };

        // Send POST request to add customer
        $.ajax({
            url: '/api/customers',
            method: 'POST',
            data: customerData,
            success: function(response) {
                // Clear form
                $('#customerForm')[0].reset();
                // Reload customer list
                loadCustomers();
                // Show success message
                alert('Customer added successfully!');
            },
            error: function(xhr, status, error) {
                alert('Error adding customer: ' + error);
            }
        });
    });

    // Function to load all customers
    function loadCustomers() {
        $.ajax({
            url: '/api/customers',
            method: 'GET',
            success: function(customers) {
                const customerList = $('#customerList');
                customerList.empty();

                customers.forEach(function(customer) {
                    const row = `
                        <tr>
                            <td>${customer.name}</td>
                            <td>${customer.email}</td>
                            <td>${customer.phone}</td>
                            <td>${customer.address}</td>
                            <td>
                                <button class="btn btn-danger btn-sm delete-customer" data-id="${customer._id}">
                                    <i class="fas fa-trash"></i> Delete
                                </button>
                            </td>
                        </tr>
                    `;
                    customerList.append(row);
                });
            },
            error: function(xhr, status, error) {
                alert('Error loading customers: ' + error);
            }
        });
    }

    // Handle customer deletion
    $(document).on('click', '.delete-customer', function() {
        const customerId = $(this).data('id');
        
        if (confirm('Are you sure you want to delete this customer?')) {
            $.ajax({
                url: `/api/customers/${customerId}`,
                method: 'DELETE',
                success: function(response) {
                    loadCustomers();
                    alert('Customer deleted successfully!');
                },
                error: function(xhr, status, error) {
                    alert('Error deleting customer: ' + error);
                }
            });
        }
    });
}); 