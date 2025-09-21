import asyncio
from playwright.sync_api import sync_playwright, expect
import os

def run_verification():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Get the full path to the index.html file
        file_path = os.path.abspath('.next/server/app/index.html')

        # Go to the local file
        page.goto(f'file://{file_path}')

        # Find the dropdown by its aria-label
        dropdown_button = page.get_by_label("Sort giveaways by criteria")

        # Expect the dropdown to be visible and contain the "Date" text
        expect(dropdown_button).to_be_visible()
        expect(dropdown_button).to_have_text("Date")

        # Click the dropdown to open the options
        dropdown_button.click()

        # The dropdown list should be visible now.
        # The list has role="listbox" and aria-label="Sort giveaways by criteria"
        listbox = page.get_by_role("listbox", name="Sort giveaways by criteria")
        expect(listbox).to_be_visible()

        # The list should contain "Value" and "Popularity", but not "Date".
        # Let's check for the options. The options have role="option".

        # Check that "Date" is NOT in the list
        date_option = listbox.get_by_role("option", name="Date")
        expect(date_option).not_to_be_visible()

        # Check that "Value" IS in the list
        value_option = listbox.get_by_role("option", name="Value")
        expect(value_option).to_be_visible()

        # Take a screenshot
        page.screenshot(path="jules-scratch/verification/verification.png")

        browser.close()

if __name__ == "__main__":
    run_verification()
