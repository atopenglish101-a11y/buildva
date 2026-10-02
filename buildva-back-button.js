```javascript
/*
=========================================================
 BUILDVA - MOBILE BACK BUTTON PROTECTION
 File: buildva-back-button.js
=========================================================

 This file handles the browser/phone Back button.

 It does NOT modify the Buildva game logic.

 Behavior:
 - Pressing Back while playing shows an exit confirmation.
 - CANCEL keeps the player in Buildva.
 - EXIT allows the browser to leave the page.
 - Works especially for mobile browsers.
=========================================================
*/

(function () {

    "use strict";

    // Prevent this script from being installed twice
    if (window.BuildvaBackButtonLoaded) {
        return;
    }

    window.BuildvaBackButtonLoaded = true;


    /*
    -------------------------------------------------------
    Check whether the user is currently inside the game
    -------------------------------------------------------
    */

    function isGameActive() {

        /*
         * If your game uses #gameArea, this will detect it.
         * If the element doesn't exist, we assume the user
         * is on the main page.
         */

        const gameArea = document.getElementById("gameArea");

        if (gameArea) {

            const style = window.getComputedStyle(gameArea);

            if (
                style.display !== "none" &&
                style.visibility !== "hidden"
            ) {
                return true;
            }
        }

        /*
         * Also check common Buildva game variables.
         */

        if (
            typeof gameStarted !== "undefined" &&
            gameStarted === true
        ) {
            return true;
        }

        return false;
    }


    /*
    -------------------------------------------------------
    Create a browser history entry
    -------------------------------------------------------
    */

    function addBackProtection() {

        history.pushState(
            {
                buildvaBackProtection: true
            },
            "",
            window.location.href
        );
    }


    /*
    -------------------------------------------------------
    Exit confirmation
    -------------------------------------------------------
    */

    function showExitConfirmation() {

        const answer = window.confirm(
            "Exit Buildva?\n\nAre you sure you want to leave the game?"
        );

        if (answer) {

            /*
             * User selected OK.
             * Remove our history protection and allow
             * the browser to continue going back.
             */

            window.removeEventListener(
                "popstate",
                handleBackButton
            );

            history.back();

        } else {

            /*
             * User selected Cancel.
             * Put the protection entry back.
             */

            addBackProtection();
        }
    }


    /*
    -------------------------------------------------------
    Back button handler
    -------------------------------------------------------
    */

    function handleBackButton() {

        if (isGameActive()) {

            showExitConfirmation();

        } else {

            /*
             * If the game isn't active, don't interfere
             * with normal browser navigation.
             */

            window.removeEventListener(
                "popstate",
                handleBackButton
            );

            history.back();
        }
    }


    /*
    -------------------------------------------------------
    Start protection
    -------------------------------------------------------
    */

    function startBuildvaBackProtection() {

        addBackProtection();

        window.addEventListener(
            "popstate",
            handleBackButton
        );
    }


    /*
    -------------------------------------------------------
    Start after page loads
    -------------------------------------------------------
    */

    if (document.readyState === "loading") {

        document.addEventListener(
            "DOMContentLoaded",
            startBuildvaBackProtection
        );

    } else {

        startBuildvaBackProtection();
    }


    /*
    -------------------------------------------------------
    Public controls
    -------------------------------------------------------
    */

    window.BuildvaBackButton = {

        enable: function () {

            window.removeEventListener(
                "popstate",
                handleBackButton
            );

            startBuildvaBackProtection();
        },

        disable: function () {

            window.removeEventListener(
                "popstate",
                handleBackButton
            );
        }

    };


})();
```

### Then you only need ONE small addition to your HTML

Near the bottom of your existing `index.html`, just before:

```html
</body>
```

add:

```html
<script src="buildva-back-button.js"></script>
```

That's it.

Your existing **Buildva game JavaScript doesn't need to be changed**.

### Important limitation

The web version cannot create a completely custom Android-style exit dialog using the browser Back button. Mobile browsers control that behavior for security reasons.

The code above uses the browser's own confirmation dialog, so on a phone the user should see a browser confirmation such as:

**Exit Buildva?**

with **Cancel / OK**.

If you want the confirmation to look **exactly like your Buildva winner popup**—with your own colors, buttons, and styling—we can do that too, but we'd need a slightly different approach using a custom HTML overlay.
