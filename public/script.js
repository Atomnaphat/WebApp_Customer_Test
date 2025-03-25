// Wait for the DOM to be fully loaded before executing any code
$(document).ready(function() {
    // Load existing customers when the page first loads
    loadCustomers();

    // Handle form submission for adding new customers
    $('#customerForm').on('submit', function(e) {
        // Prevent the default form submission behavior
        e.preventDefault();

        // Create an object with the form data
        const customerData = {
            name: $('#name').val(),        // Get value from name input field
            email: $('#email').val(),      // Get value from email input field
            phone: $('#phone').val(),      // Get value from phone input field
            address: $('#address').val()   // Get value from address textarea
        };

        // Send POST request to add new customer
        $.ajax({
            url: '/api/customers',         // API endpoint for creating customers
            type: 'POST',                  // HTTP POST method
            contentType: 'application/json', // Specify we're sending JSON data
            data: JSON.stringify(customerData), // Convert object to JSON string
            success: function(response) {
                // Clear the form after successful submission
                $('#customerForm')[0].reset();
                // Reload the customer list to show the new entry
                loadCustomers();
                // Show success message to user
                alert('Customer added successfully!');
            },
            error: function(xhr, status, error) {
                // Show error message if something goes wrong
                alert('Error adding customer: ' + error);
            }
        });
    });

    // Function to load and display all customers
    function loadCustomers() {
        $.ajax({
            url: '/api/customers',         // API endpoint for getting customers
            type: 'GET',                   // HTTP GET method
            success: function(customers) {
                // Get reference to the customer list table body
                const customerList = $('#customerList');
                // Clear existing content
                customerList.empty();

                // Loop through each customer and create a table row
                customers.forEach(function(customer) {
                    const row = `
                        <tr>
                            <td>${customer.name}</td>
                            <td>${customer.email}</td>
                            <td>${customer.phone}</td>
                            <td>${customer.address}</td>
                            <td>${new Date(customer.createdAt).toLocaleString()}</td>
                            <td>
                                <button class="btn btn-danger btn-sm delete-customer" data-id="${customer._id}">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    `;
                    // Add the row to the table
                    customerList.append(row);
                });

                // Add click event handlers for delete buttons
                $('.delete-customer').on('click', function() {
                    const customerId = $(this).data('id');
                    deleteCustomer(customerId);
                });
            },
            error: function(xhr, status, error) {
                // Show error message if loading fails
                alert('Error loading customers: ' + error);
            }
        });
    }

    // Function to delete a customer
    function deleteCustomer(customerId) {
        // Show confirmation dialog
        if (confirm('Are you sure you want to delete this customer?')) {
            $.ajax({
                url: `/api/customers/${customerId}`,  // API endpoint for deleting customer
                type: 'DELETE',                       // HTTP DELETE method
                success: function(response) {
                    // Reload the customer list to reflect changes
                    loadCustomers();
                    // Show success message
                    alert('Customer deleted successfully!');
                },
                error: function(xhr, status, error) {
                    // Show error message if deletion fails
                    alert('Error deleting customer: ' + error);
                }
            });
        }
    }
}); 