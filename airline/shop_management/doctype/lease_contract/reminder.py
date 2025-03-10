import frappe
from frappe.utils import nowdate, getdate, add_days
from frappe.core.doctype.communication.email import make

def send_rent_due_reminder():
    """Send rent due reminders to tenants via email every month."""
    today = getdate(nowdate())
    
    # Fetch tenants whose rent is due (assuming you have a 'Lease Agreement' doctype)
    tenants = frappe.get_all("Lease Contract", 
        filters={"status": "Active"}, 
        fields=["shop", "custom_tenant_email", "lease_end_date", "rent_amount"]
    )
    
    for tenant in tenants:
        due_date = getdate(tenant.get("lease_end_date"))
        if due_date and due_date.month == today.month:  # Check if rent is due this month
            subject = "Rent Due Reminder"
            message = f"""
                Dear Tenant,<br><br>
                This is a reminder that your rent of <b>₹{tenant.get("rent_amount")}</b> is due on <b>{due_date}</b>.<br>
                Kindly ensure timely payment to avoid penalties.<br><br>
                Regards,<br>
                Airport Management
            """
            
            if tenant.get("custom_tenant_email"):
                frappe.sendmail(
                    recipients=tenant["custom_tenant_email"],
                    subject=subject,
                    message=message
                )
