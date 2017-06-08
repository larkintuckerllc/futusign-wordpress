futusign
====
Manage and display digital signage content

- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [Contact](#contact)
- [License](#license)

Installation
====

Install and activate the *futusign* plugin via the WordPress *Plugins* admin
screen.

Additional details, including usage with Wordpress multisite, are available
in the [Frequently Asked Questions](https://www.futusign.com/faq/).

Usage
====
Using your favorite presentation tool, e.g., PowerPoint, create a slide
show with the same resolution and aspect ratio of the target display screen;
for example 1920px by 1080px for an landscape HD screen. Save it as a series of
images.

From the WordPress administrative screens.

1. Add a new *Image* (or multiple) from the admin menu; uploading the
image file.
2. Update the *Image Duration* as desired.
3. While adding the image, also add it to a new *Playlist*.
4. Add a new *Screen* from the admin menu.
5. Update the *Polling Cycle* as desired.
6. While adding the screen, also subscribe it to the created *Playlist*.
7. View the *Screen*.

When editing a screen; a list of the currently playing media is provided.

To create a digital sign, connect a television to a computer with Chrome
browser and have it load the *Screen's* URL. The loaded web application will
check every hour (configurable) to automatically apply changes made on the
admin screens.

**Caveats**

After the initial load, the web browser will load the web application with
or without a network connection.

When the plugin in updated, the web application will automatically
update and reload within an hour.

There are several known situations where the web application will display an
error until the situation is corrected (will recover within a minute).

* If the web application is running and the web browser loses its network
connection, it will display a *No Network* icon. The web application will also
repeatedly display the first *Image* in the list (if there is one).
* If the screen is not subscribed to a list, the web application will
display a *No Images* icon.
* If the screen is subscribed to one or more list that are all empty,
the web application will display a *No Images* icon.

**Tips**

* If required, the uploaded image file will be stretched / shrunk (centered and
maintaining aspect ratio) to just cover the target display screen.
* *Images* play alphabetically by title.
* *Images* can be scheduled to be published in the future using the
WordPress schedule feature.
* *Images* can be scheduled to expire in the future using the third-party
plugin [Post Expirator](https://wordpress.org/plugins/post-expirator/).
* A variety of devices can be used for digital signage
as described in the article [Digital Signage is Just Another Screen](https://medium.com/@johntucker_48673/digital-signage-is-just-another-screen-e138c2ec3ae9#.244a74dta).
* Additional features can be added via commercial plugins available at
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
