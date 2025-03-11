// Copyright (c) 2025, krupali rajpara and contributors
// For license information, please see license.txt

frappe.ui.form.on("Lease Contract", {
	refresh(frm) {
        if (!frm.doc.rent_amount) { // Only set if rent is empty
            frappe.call({
                method: "frappe.client.get_single_value",
                args: {
                    doctype: "Shop Management Settings",
                    field: "rent_amount"
                },
                callback: function(r) {
                    if (r.message) {
                        frm.set_value("rent_amount", r.message);
                    }
                }
            });
        }
	},
});
