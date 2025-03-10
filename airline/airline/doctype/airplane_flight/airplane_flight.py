# Copyright (c) 2025, krupali rajpara and contributors
# For license information, please see license.txt

import frappe
from frappe.website.website_generator import WebsiteGenerator
from frappe.utils.background_jobs import enqueue
# from airline.airline.background_jobs import update_ticket_gate_numbers 

class AirplaneFlight(WebsiteGenerator):
    def before_save(self):
        """Trigger background job when gate number changes"""
        previous_gate = frappe.db.get_value("Airplane Flight", self.name, "gate_no")  
        print('previous_gate:', previous_gate, "self.gate_no:", self.gate_no)

        if previous_gate != self.gate_no:
            print('Gate changed. Enqueuing job...')
            enqueue(
                self.update_ticket_gate_numbers,
                queue="short",
                flight_id=self.name,
                new_gate=self.gate_no,
                is_async=True,
                timeout=200
            )
    
    @staticmethod
    def update_ticket_gate_numbers(flight_id, new_gate):
        """Update gate number in Airplane Ticket when flight gate changes"""
        print('Updating tickets for flight:', flight_id, 'New gate:', new_gate)

        tickets = frappe.get_all("Airplane Ticket", filters={"flight": flight_id}, fields=["name", "gate_no"])

        for ticket in tickets:
            print(f"Updating Ticket: {ticket.name}")
            frappe.db.set_value("Airplane Ticket", ticket.name, "gate_no", new_gate)
            frappe.db.commit()  # Ensure changes are saved
            print(f"Updated Ticket {ticket.name} to Gate {new_gate}")

   
# def get_context(context):
# 	flights = frappe.get_all(
#         "AirplaneFlight",
#         filters={"is_published": 1},  # Only published flights
#         fields=["name", "route", "airplane", "source_airport_code", "destination_airport_code", "date_of_departure", "time_of_departure", "duration"]
#     )
