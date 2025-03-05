# Copyright (c) 2025, krupali rajpara and contributors
# For license information, please see license.txt

import frappe
import random 
from frappe.model.document import Document

class AirplaneTicket(Document):
    def validate(self):
        if self.docstatus == 1 and self.status != "Boarded":
            frappe.throw("You cannot submit this document unless the status is 'Boarded'.")

    def on_submit(self):
        update_flight_status(self)

@frappe.whitelist()
def assign_seat(flight):
    if not flight or not frappe.db.exists("Airplane Flight", flight):
        frappe.throw("Invalid Flight ID")

    assigned_seats = frappe.get_all("Airplane Ticket", filters={"flight": flight}, pluck="seat")
    print(f"==>> assigned_seats: {assigned_seats}")

    rows = range(1, 31)  
    columns = ["A", "B", "C", "D", "E", "F"]
    available_seats = [f"{r}{c}" for r in rows for c in columns if f"{r}{c}" not in assigned_seats]
    print(f"==>> available_seats: {available_seats}")

    if not available_seats:
        frappe.throw("No available seats on this flight.")

    return random.choice(available_seats)

def update_flight_status(doc):
    if doc.docstatus == 1 and doc.flight:  
        flight_doc = frappe.get_doc("Airplane Flight", doc.flight)
        flight_doc.status = "Completed"
        flight_doc.save(ignore_permissions=True) 
        frappe.db.commit()