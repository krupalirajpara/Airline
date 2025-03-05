# Copyright (c) 2025, krupali rajpara and contributors
# For license information, please see license.txt

# import frappe
from frappe.website.website_generator import WebsiteGenerator
from frappe.utils import getdate, format_time


class AirplaneFlight(WebsiteGenerator):
    pass

def get_context(context):
	flights = frappe.get_all(
        "AirplaneFlight",
        filters={"is_published": 1},  # Only published flights
        fields=["name", "route", "airplane", "source_airport_code", "destination_airport_code", "date_of_departure", "time_of_departure", "duration"]
    )

    