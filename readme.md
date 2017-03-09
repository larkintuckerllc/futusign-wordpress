futusign
====
Manage and display digital signage content

<https://wordpress.org/plugins/futusign/>

- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [Contact](#contact)
- [License](#license)

Installation
====

Install the plugin from the *WordPress Plugin Directory* or:

1. Copy the `futusign` folder into your `wp-content/plugins` folder
2. Activate the *futusign* plugin via the *Plugins* admin page

Usage
====
Using your favorite presentation tool, e.g., PowerPoint, create a slide
show and save it as a portable document format (PDF) file.

From the WordPress administrative screens.

1. Add a new slide deck from the main navigation menu item *Slide Decks*;
uploading the PDF file.
2. While adding the slide deck, also add it to a new playlist using
the *Playlist* box.
3. Add a new screen from the main navigation menu item *Screens*.
4. While adding the screen, subscribe it to the playlist that was
added above using the *Playlist* box.
5. View the screen; it should be playing the slide deck.

To create a digital sign, connect a television to a computer with a modern web
browser and have it load the screen's URL. The loaded web application will
check every minute to automatically apply changes made on the administrative
screens.

**Caveats**

The web browser will not load the web application unless it have network
access to the WordPress server.

There are several known situations where the web application will display an
error until the situation is corrected (will recover within a minute).

* If the web application is running and loses network access to the WordPress
server, it will display a *no network* icon.
* If the screen is not subscribed to a playlist, the web application will
display a *no slide decks* icon.
* If the screen is subscribed to one or more playlists that are all empty,
the web application will display a *no slide decks* icon.

When the plugin is updated, the web application will need to be reloaded;
one solution is to regularly reboot the supporting computer.

**Tips**

* Slide decks play in the order shown (alphabetical) on the *Slide Decks*
page.
* Slide decks can be scheduled to be published in the future using the
schedule feature in the *Publish* box.
* Slide decks can be scheduled to expire in the future using the third-party
plugin *Post Expirator*.
* A variety of devices can be used for digital signage
as described in the article [Digital Signage is Just Another Screen](https://medium.com/@johntucker_48673/digital-signage-is-just-another-screen-e138c2ec3ae9#.244a74dta).
* Additional features can be added via private plugins available at
<https://www.futusign.com>.

Contributing
====
Submit bug or enhancement requests using the GitHub issues feature.

Contact
====
General questions and comments can be directed to
<mailto:john@larkintuckerllc.com>.

License
====
GPLv2 or later <https://www.gnu.org/licenses/gpl.html>
