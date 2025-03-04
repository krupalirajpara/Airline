# Copyright (c) 2025, krupali rajpara and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class AirplaneTicket(Document):
    def validate(self):
        if self.docstatus == 1 and self.status != "Boarded":
            frappe.throw("You cannot submit this document unless the status is 'Boarded'.")
