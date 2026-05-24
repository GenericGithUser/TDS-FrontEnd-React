const ticketData = [
  {
    id: "#PT-0001",
    title: "Dashboard fails to load after login",
    urgency: "High",
    date_sent: "2023-01-11 09:03:15",
    status: "Closed",
    message: "User reported that the main dashboard displays a blank white screen immediately after a successful login. The issue was reproduced on Chrome and Edge. Investigation revealed a broken API call to the widgets endpoint caused by an expired session token. A hotfix was deployed and the issue was resolved within the hour."
  },
  {
    id: "#PT-0002",
    title: "Sales summary widget showing incorrect totals",
    urgency: "High",
    date_sent: "2023-01-26 10:41:33",
    status: "Closed",
    message: "The sales summary widget on the main dashboard was displaying totals that did not match the figures in the detailed records view. The discrepancy was traced to a misconfigured date filter that was including records from the previous month. The filter logic was corrected and totals now reflect the current period accurately."
  },
  {
    id: "#PT-0003",
    title: "Chart widget not rendering on reports page",
    urgency: "Medium",
    date_sent: "2023-02-14 14:22:08",
    status: "Closed",
    message: "A user reported that the bar chart on the monthly reports page was not rendering and instead showing an empty container with no error message. The issue was isolated to datasets with more than 500 rows, which exceeded the rendering library's default threshold. The limit was raised and the chart now loads correctly."
  },
  {
    id: "#PT-0004",
    title: "Filter panel resets on every page refresh",
    urgency: "Medium",
    date_sent: "2023-02-28 11:17:45",
    status: "Open",
    message: "Users have reported that any filters applied on the records overview page are cleared whenever the page is refreshed. Filter state is expected to persist across sessions via local storage, but the current implementation does not save the state on apply. A fix is being developed to persist filter selections per user account."
  },
  {
    id: "#PT-0005",
    title: "Unable to export records to CSV",
    urgency: "High",
    date_sent: "2023-03-07 08:55:22",
    status: "Closed",
    message: "Multiple users reported that clicking the export to CSV button on the records table produced no download and no visible error. Server logs showed the export job was timing out for datasets above 1,000 rows. The export function was refactored to run asynchronously, with the user receiving a download link via notification once the file is ready."
  },
  {
    id: "#PT-0006",
    title: "Notification bell shows unread count but no messages",
    urgency: "Low",
    date_sent: "2023-03-22 15:30:11",
    status: "Closed",
    message: "A user reported that the notification bell in the top navigation consistently showed an unread count of 3, but opening the notification panel displayed no messages. The issue was caused by soft-deleted notifications that were still being counted in the badge query. The query was updated to exclude soft-deleted entries and the badge now reflects the correct count."
  },
  {
    id: "#PT-0007",
    title: "Dashboard layout broken on 1280px screen width",
    urgency: "Low",
    date_sent: "2023-04-10 13:08:44",
    status: "Closed",
    message: "A user on a laptop with a 1280px display reported that the dashboard grid was overlapping widget panels, making several cards unreadable. The responsive breakpoint for medium-width screens was missing a CSS rule that caused the two-column layout to collapse improperly. A stylesheet fix was applied and the layout now renders correctly at all tested widths."
  },
  {
    id: "#PT-0008",
    title: "Access denied error when opening analytics tab",
    urgency: "High",
    date_sent: "2023-04-25 09:44:57",
    status: "Open",
    message: "Several users with the Analyst role reported receiving an access denied error when navigating to the Analytics tab, despite the role previously having read access to this section. A recent permissions update inadvertently removed analytics read access from the Analyst role definition. A corrective role policy update is pending approval before deployment."
  },
  {
    id: "#PT-0009",
    title: "Date range picker not accepting manual input",
    urgency: "Low",
    date_sent: "2023-05-16 14:55:39",
    status: "Open",
    message: "Users reported that manually typing a date into the date range picker fields on the report filters panel does not apply the value correctly. Selecting dates via the calendar popup works as expected. The issue appears to be a missing input event handler on the text fields. A fix is under review and will be included in the next scheduled release."
  },
  {
    id: "#PT-0010",
    title: "User profile changes not saving",
    urgency: "Medium",
    date_sent: "2023-06-06 10:28:17",
    status: "Closed",
    message: "A user reported that updating their display name and timezone in the profile settings page appeared to save successfully, but the changes were reverted after logging out and back in. The profile update endpoint was not committing changes to the database due to a missing transaction commit call. The bug was patched and profile changes now persist correctly."
  },
  {
    id: "#PT-0011",
    title: "Search results returning irrelevant records",
    urgency: "Medium",
    date_sent: "2023-07-19 11:03:50",
    status: "Open",
    message: "Multiple users reported that the global search bar on the dashboard was returning records unrelated to the search term entered. Investigation revealed the search index had become out of sync following a bulk import the previous week. A full re-index of the records database has been scheduled for the next maintenance window."
  },
  {
    id: "#PT-0012",
    title: "Sidebar navigation collapses unexpectedly",
    urgency: "Low",
    date_sent: "2023-08-03 15:12:06",
    status: "Closed",
    message: "Users reported that the left sidebar navigation would spontaneously collapse to icon-only mode while navigating between pages, even when it had been manually pinned open. A state management bug was found where the sidebar's pinned state was being overwritten by the default layout initialization on each route change. The initialization logic was corrected and the sidebar now respects the user's preference."
  },
  {
    id: "#PT-0013",
    title: "Dashboard widgets load out of order",
    urgency: "Low",
    date_sent: "2023-09-11 08:34:29",
    status: "Closed",
    message: "A user reported that widgets on their customized dashboard rearranged themselves into a different order each time the page was loaded, despite having been saved in a specific layout. The widget order was being stored by widget type rather than by position index, causing inconsistent rendering when multiple widgets of the same type were present. The storage schema was corrected."
  },
  {
    id: "#PT-0014",
    title: "Real-time data feed stopped updating",
    urgency: "High",
    date_sent: "2023-10-24 09:18:41",
    status: "Open",
    message: "Users monitoring the live activity feed on the dashboard reported that the feed had stopped updating and was showing data from several hours prior. The WebSocket connection responsible for pushing real-time updates had silently dropped and was not reconnecting automatically. A reconnection handler is being implemented to detect dropped connections and restore the feed without requiring a page reload."
  },
  {
    id: "#PT-0015",
    title: "Slow dashboard load times for admin accounts",
    urgency: "Medium",
    date_sent: "2023-11-30 13:47:02",
    status: "Open",
    message: "Admin users reported that the dashboard was taking 12 to 18 seconds to fully load, while standard user accounts loaded in under 3 seconds. Profiling revealed that the admin dashboard was fetching all widgets sequentially rather than in parallel, and several admin-only data endpoints were running unoptimized queries without caching. Query optimization and parallel loading are currently in progress."
  }
];

export default ticketData;