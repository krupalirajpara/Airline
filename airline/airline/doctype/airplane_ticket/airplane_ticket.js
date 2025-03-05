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

    ////
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
    let unique_add_ons = new Set();
    let cleaned_add_ons = [];
    let duplicate_found = false;

    (frm.doc.add_ons || []).forEach(row => {
        if (!unique_add_ons.has(row.add_on_type)) {
            unique_add_ons.add(row.add_on_type);
            cleaned_add_ons.push(row);
        } else {
            duplicate_found = true;
        }
    });

    if (duplicate_found) {
        frappe.msgprint(__('Duplicate add-ons found! Remove them to proceed.'));
    }

    frm.doc.add_ons = cleaned_add_ons;
    frm.refresh_field("add_ons"); 
    calculate_total_amount(frm);

    return duplicate_found; 
}
