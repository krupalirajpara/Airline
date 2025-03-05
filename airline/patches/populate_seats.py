import frappe

def execute():
    # Fetch all Airplane Tickets that don't have a seat assigned
    tickets = frappe.get_all("Airplane Ticket", filters={"seat": ["=", ""]}, fields=["name", "flight"])

    for ticket in tickets:
        if ticket.flight:
            # Generate a seat number
            assigned_seat = get_next_available_seat(ticket.flight)
            if assigned_seat:
                frappe.db.set_value("Airplane Ticket", ticket.name, "seat", assigned_seat)
    
    frappe.db.commit()
    print(f"✅ Updated {len(tickets)} Airplane Tickets with seat numbers!")

def get_next_available_seat(flight_name):
    """Generate a seat number for the given flight"""
    existing_seats = frappe.get_all(
        "Airplane Ticket", 
        filters={"flight": flight_name, "seat": ["!=", ""]}, 
        fields=["seat"]
    )

    seat_numbers = {seat["seat"] for seat in existing_seats}
    rows = 30
    cols = ["A", "B", "C", "D", "E", "F"]  

    for row in range(1, rows + 30):  # Assuming max 30 rows
        for col in cols:
            seat = f"{row}{col}"
            if seat not in seat_numbers:
                return seat
    return None
