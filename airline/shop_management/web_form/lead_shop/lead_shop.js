frappe.ready(function() {
    // Fetch Tenant Email when Tenant field changes
    frappe.web_form.on("tenant", (field, value) => {
        if (value) {
            frappe.call({
                method: "frappe.client.get_value",
                args: {
                    doctype: "Tenant",
                    filters: { "name": value },  // Assuming "name" is the unique identifier for Tenant
                    fieldname: "email"
                },
                callback: function(response) {
                    if (response.message) {
                        frappe.web_form.set_value("custom_tenant_email", response.message.email);
                    }
                }
            });
        }
    });
});
