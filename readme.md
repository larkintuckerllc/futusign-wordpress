futusign
====
Manage and display digital signage content

- [Description](#description)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [Contact](#contact)
- [License](#license)

Description
===

Simply put... *WordPress* is one of the best content managements systems available today. Digital signage management is a content management problem. 

Installation
====

Install and activate the *futusign* plugin via the *WordPress Plugins* admin
screen.

Additional features are provided through supplemental plugins:

* [futusign Media Deck](https://github.com/larkintuckerllc/futusign-wp-mediadeck): Support for displaying media decks; ordered list of existing media types: images, webs, and YouTube videos.
* [futusign Monitor](https://github.com/larkintuckerllc/futusign-wp-monitor): Support for screen monitoring; detecting if screens are offline
* [futusign Multisite](https://github.com/larkintuckerllc/futusign-wp-multisite): Support for WordPress multisite
* [futusign Overlay](https://github.com/larkintuckerllc/futusign-wp-overlay): Support for overlay of widgets
* [futusign Overlay Clock](https://github.com/larkintuckerllc/futusign-wp-overlayclock): Support for adding a clock overlay widget
* [futusign Overlay RSS](https://github.com/larkintuckerllc/futusign-wp-overlayrss): Support for adding a RSS  overlay widget
* [futusign Override](https://github.com/larkintuckerllc/futusign-wp-override): Support for overriding media; for example to temporarily override media on subscribed playlists.
* [futusign YouTube Video](https://github.com/larkintuckerllc/futusign-wp-youtube): Support for YouTube videos

Usage
====
Using your favorite presentation tool, e.g., *PowerPoint*, create a slide show with the same resolution and aspect ratio of the target display screen; for example 1920px by 1080px for an landscape HD screen. Save it as a series of images.

From the *WordPress* administrative screens.

1. Add a new *Image* (or multiple) from the admin menu; uploading the
image file.
2. Update the *Image Duration* as desired.
3. While adding the image, also add it to a new *Playlist*.
4. Add a new *Screen* from the admin menu.
5. Update the *Polling Cycle* as desired.
6. While adding the screen, also subscribe it to the created *Playlist*.
7. View the *Screen*.

When editing a screen; a list of the currently playing media is provided.

To create a digital sign, connect a television to a computer with *Chrome* browser and have it load the *Screen's* URL. The loaded web application will check every hour (configurable) to automatically apply changes made on the admin screens.

Contributing
====
Submit bug or enhancement requests using the *GitHub* issues feature.

Contact
====
General questions and comments can be directed to
<mailto:john@larkintuckerllc.com>.

License
====
GPLv2 or later <https://www.gnu.org/licenses/gpl.html>
