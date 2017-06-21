=== futusign  ===
Contributors: sckmkny
Tags: digital, signage
Requires at least: 4.3
Tested up to: 4.7
Stable tag: 2.4.2
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl.html

Manage and display digital signage content

== Description ==

Manage and display digital signage content

**See details on GitHub:** https://github.com/larkintuckerllc/futusign-wordpress

== Installation ==

Install and activate the *futusign* plugin via the WordPress *Plugins* admin
screen.

== Changelog ==

= 2.4.2 =

bug fix: Overlay position typo fix.

= 2.4.1 =

bug fix: allow null version

= 2.4.0 =

feature: Server time.
feature: version and reload
feature: new overlay positions
feature: YouTube player CC

= 2.3.1 =

Fixed for ugly URLs.

= 2.3.0 =

Fixed and validated against older PHP 5.3

= 2.2.7 =

Still tracking down bug with customer site; adding more debugging.

= 2.2.6 =

Still tracking down bug with customer site; adding debugging back in.

= 2.2.5 =

Fix bug with relative require causing endpoint to fail; thus
the screen player to fail.

= 2.2.4 =

Added debugging points to find error in endpoint API for a
customer.

= 2.2.3 =

Bug fix: Hopefully final attempt to fix problem during upgrade;
current work-around is to deactivate and activate the plugin.

= 2.2.2 =

Bug fix: Try to fix problem during upgrade; current work-around is to
deactivate and activate the plugin.

= 2.2.1 =

Bug fix: On upgrade to 2.2.0, the plugin needed to be reactivated
before screens would play again.

= 2.2.0 =

Enhancement: Currently playing / layers summary on screens.

Enhancement: Screen polling cycle choice; default hour.

Enhancement: No longer dependent on ACF to Rest plugin.

Performance fix: Collapsed poll from 10+ polls to a single poll.

= 2.1.1 =

Band-aid fix; changed polling from once per minute to once per hour.
Eating up too much CPU cyles on WordPress instance. Future will default
to an hour but let you change.

= 2.1.0 =

Enhancement: Updated to support Media Decks commercial feature; replacement
for Slide Decks.

= 2.0.0 =

Slide Decks are now deprecated and will be removed in a future version;
primarily due to unresolvable issues with the PDF rendering library.

Images are now included in the core futusign plugin; also replaces Slide
Decks in offline behavior.

Media play alphabetically by title.

= 1.5.0 =

Bug Fix: Reset polling to 1 minute (accidentally set to much longer).

Enhancement: Supporting futusign Override.

= 1.4.2 =

Tweak instructions for Screens and Slide Decks.

Bug Fix: With futusign Priority not showing first priority.

Enhancement: Remove spinner on cycling or priority changes.

Bug Fix: Updated limit of items to max; 100.

Enhancement: Update order to use titles instead of post date.

= 1.4.1 =

Bug fix; continue showing spinner until next media plays. Manifested itself
with futusign Web plugin (in development).

= 1.4.0 =

Bug fix; slow memory leak when playing Slide Decks.

Bug fix; with futusign Overlay, not removing widgets when removed
overlay from screen or delete overlay entirely.

Refactor player; Replace fade with spinner (when required).

Supporting futusign Priority.

Supporting futusign Web.

= 1.3.0 =

Add support for futusign Layer commercial plugin.

= 1.2.3 =

Security hardening of the PHP code; tests to ensure run through
WordPress.

= 1.2.2 =

PDF viewer delay from 1 sec to 2 sec; allow smoother fade in.
Fix bug in offline mode where it doubled up on the last slide.

= 1.2.1 =

Support WordPress multisite. Purge use of index files.

= 1.2.0 =

Add support for futusign Overlay commercial plugin.

= 1.1.0 =

Add support for futusign Monitor commercial plugin.

= 1.0.0 =

Add support for offline operation; play first Slide Deck
in subscribed Playlist.

Add support for automatic updates on plugin update.

= 0.4.0 =

Minor bug fix for hiding select with empty playlist.

Cosmetic instructions on screen.

Cosmetic custom post type icons.

Player upgrade to support additional media; image and YouTube video
provided by future WordPress plugins.

= 0.3.5 =

Minor code cleanup in screen web application.

Add 'key' to Advanced Custom Fields registration to address
bug introduced in ACF Pro v5.5.8 (fixed in v5.5.9).
Future-proofs code.

= 0.3.4 =

Fix bug in activation caused by refactor.

= 0.3.3 =

Refactor plugin based on WordPress-Plugin-Boilerplate.

Fix bug where screen would fail connect when using "Plain" permalinks.

= 0.3.2 =

Broken deployment.

= 0.3.1 =

Rolling back to 0.2.2 functionality.

= 0.3.0 =

Broken deployment.

= 0.2.2 =

Fix JavaScript player to bust API caching; some hosting service
not handling caching right.

= 0.2.1 =

First public release.

= 0.2.0 =

Refactor playlist structure.

= 0.1.6 =
Fix bug in player; now reuse PDFWorker.

= 0.1.5 =
Changed playlist to hiearchical

= 0.1.4 =
Using tabs consistently in plugin file.

= 0.1.3 =
Fixed bug with handling alternate plugin folder names.

= 0.1.2 =
Fix bug with flushing permalinks.

= 0.1.1 =
Fix bug in loading screen.

= 0.1.0 =
initial release
