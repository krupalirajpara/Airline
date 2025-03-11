// Copyright (c) 2025, Krupali Rajpara and contributors
// For license information, please see license.txt

frappe.ui.form.on('Airplane Ticket', {
    refresh: function(frm) {
        remove_duplicate_add_ons(frm);
        calculate_total_amount(frm);
    },

    flight_price: function(frm) {
        calculate_total_amount(frm);
    },

    add_ons_add: function(frm) {
        remove_duplicate_add_ons(frm);
        calculate_total_amount(frm);
    },

    add_ons_remove: function(frm) {
        calculate_total_amount(frm);
    },

    validate: function(frm) {
        if (remove_duplicate_add_ons(frm)) {
            frappe.throw(__('Duplicate add-ons found! Please remove them before saving.'));
        }
        calculate_total_amount(frm);
    },

    //// check seat availability
    validate: function(frm) { 
        if (!frm.doc.seat) {
            frappe.call({
                method: "airline.airline.doctype.airplane_ticket.airplane_ticket.assign_seat",
                args: {
                    flight: frm.doc.flight
                },
                callback: function(r) {
                    console.log("Response from assign_seat:", r);
                    if (r.message) {
                        frm.set_value('seat', r.message);
                    } else {
                        frappe.msgprint("No seat assigned. Check availability.");
                    }
                }
            });
        }
    },

    //// custom button for assign seat
    refresh: function(frm) {
        if (frm.doc.docstatus === 0) {  // Show only if editable
            frm.add_custom_button("Assign Seat", function() {
                assign_seat(frm);
            }, "Actions");
        }
    }
});

frappe.ui.form.on('Airplane Ticket Add-on Item', {  
    amount: function(frm) {
        calculate_total_amount(frm);
    },
    add_on_type: function(frm) {
        remove_duplicate_add_ons(frm);
        calculate_total_amount(frm);
    }
});

function calculate_total_amount(frm) {
    let flight_price = frm.doc.flight_price || 0;
    let add_on_total = (frm.doc.add_ons || []).reduce((sum, row) => sum + (row.amount || 0), 0);

    frm.set_value('total_amount', flight_price + add_on_total);
}

function remove_duplicate_add_ons(frm) {
    let seen_add_ons = new Set();
    let duplicate_indexes = [];
    let add_ons = frm.doc.add_ons || [];

    add_ons.forEach((row, index) => {
        if (seen_add_ons.has(row.add_on_type)) {
            duplicate_indexes.push(index);
        } else {
            seen_add_ons.add(row.add_on_type);
        }
    });

    if (duplicate_indexes.length > 0) {
        frappe.msgprint(__('Duplicate add-ons found in this ticket! Removing them automatically.'));
        duplicate_indexes.reverse().forEach(index => frm.get_field("add_ons").grid.grid_rows[index].remove());
        frm.refresh_field("add_ons");
    }
}

// assign seat No
function assign_seat(frm) {
    frappe.prompt([
        {
            fieldname: "seat",
            fieldtype: "Data",
            label: "Enter Seat Number",
            reqd: 1
        }
    ], function(values) {
        frm.set_value("seat", values.seat);  // Set the value in the form
        frappe.msgprint("Seat assigned temporarily! Submit to save.");
    }, "Assign Seat", "Assign");
}
