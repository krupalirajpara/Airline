frappe.ready(function() {
    let params = new URLSearchParams(window.location.search);
    let flight_id = params.get("flight");

    if (flight_id) {
        frappe.web_form.set_value("flight", flight_id);

        frappe.call({
            method: "frappe.client.get",
            args: {
                doctype: "Flight",
                name: flight_id
            },
            callback: function(response) {
                if (response.message) {
                    let flight = response.message;
                    frappe.web_form.set_value("departure", flight.date_of_departure);
                    frappe.web_form.set_value("duration", flight.duration);
                }
            }
        });
    }
});
