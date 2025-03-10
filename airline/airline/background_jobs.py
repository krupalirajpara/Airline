# import frappe

# def update_ticket_gate_numbers(flight_id, new_gate):
#     print('background jobs flight_id', flight_id, 'new_gate', new_gate)
#     # Fetch tickets linked to the flight
#     tickets = frappe.get_all("Airplane Ticket", filters={"flight": flight_id}, fields=["name", "gate_no"])

#     for ticket in tickets:
#         ticket_doc = frappe.get_doc("Airplane Ticket", ticket.name)
#         if hasattr(ticket_doc, "gate_no"): 
#             ticket_doc.gate_no = new_gate
#             ticket_doc.save()       
#     frappe.db.commit() 
