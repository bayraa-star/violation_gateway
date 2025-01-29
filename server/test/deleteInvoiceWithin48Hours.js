// Static token for the /fetch-by-plate endpoint
const fetchToken = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzIxOGU5ZGY1MTQzMGI3MjBiNzRlNDMiLCJpYXQiOjE3MzAyNTI0NjEsImV4cCI6MTczMDMzODg2MX0.L2hFIS3ntL_B732rBxXbLaHJGxKJysWfDSkI9TjU4Ug';

// Static token for the /delete endpoint
const deleteToken = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJwYXJraW5nQG9yZ2lsZGVsdGEubW4iLCJpc3MiOiJTbWFydGNhciBMTEMiLCJpYXQiOjE3MzAyNTY1MzQsImV4cCI6MTczMDI4NTMzNH0.kidzq8IFO0WOg5AeJGzG_NRuhP19zUi1XVhPYy31nm9054i347sS91ahp6UFn1TavcaG1l75QvM0Llk9zqPaIA';

// Fetch invoices by plate from /fetch-by-plate endpoint
async function fetchInvoices() {
    const url = 'http://10.71.71.67:5000/api/v1/invoice/fetch-by-plate?startDate=2024-09-01&endDate=2024-10-30&type=CITY_TOLL_GATE';

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': fetchToken, // Use static Bearer token
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Error fetching invoices: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Fetched invoices:', data);
        return data.data; // Returning the entire array of groups
    } catch (error) {
        console.error('Failed to fetch invoices:', error);
        return [];
    }
}

// Function to delete an invoice using the deleteToken
async function deleteInvoice(invoiceNumber) {
    const apiUrl = 'https://smartcar.mn/payment-api/v1/payment-invoice/delete';
    const invoiceData = {
        number: invoiceNumber
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'DELETE',
            headers: {
                'X-Auth-Token': deleteToken, // Use static token for delete
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(invoiceData)
        });

        if (!response.ok) {
            throw new Error(`Error deleting invoice: ${response.statusText}`);
        }

        const data = await response.json();
        console.log(`Invoice ${invoiceNumber} deleted successfully`, data);
        return true; // Return true if delete was successful
    } catch (error) {
        console.error(`Failed to delete invoice ${invoiceNumber}:`, error);
        return false; // Return false if delete failed
    }
}

// Main function to fetch invoices, iterate through groups, delete each invoice, and count deletions
async function fetchAndDeleteInvoices() {
    let deletedCount = 0; // Initialize the counter for deleted invoices
    const groups = await fetchInvoices();

    if (groups.length === 0) {
        console.log('No invoices to delete');
        return;
    }

    for (const group of groups) {
        console.log(`Processing group with _id: ${group._id}`);
        for (const invoice of group.invoices) {
            const success = await deleteInvoice(invoice.invoiceNumber);
            if (success) {
                deletedCount++; // Increment the counter if the delete was successful
            }
        }
    }

    console.log(`Total invoices deleted: ${deletedCount}`);
}

// Run the process
fetchAndDeleteInvoices();
