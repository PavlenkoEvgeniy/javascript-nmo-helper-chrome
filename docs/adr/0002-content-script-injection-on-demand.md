# Content script is injected on demand instead of running on `<all_urls>`

The extension originally declared the content script on `<all_urls>` and ALSO
re-injected it from the popup, producing duplicate `chrome.runtime.onMessage`
listeners. We removed the manifest declaration and inject via `scripting.executeScript`
only when the user presses "Parse", sending the message after successful injection
(or directly if the listener already exists). This reduces the extension's
per-page footprint and privacy exposure; the trade-off is that running the
extension on `chrome://` pages remains impossible, which was already true.