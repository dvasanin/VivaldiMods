Vivaldi Modding Guide (Windows) for the Inexperienced By: DVAsanin
Last Updated: 18-05-2025
Hi, I'm Dan!
---
This is a quick guide on how to customize the Vivaldi browser using custom CSS and JS. These features aren't enabled by default, so some manual setup is required. Be cautious when editing Javascript - Vivaldi is still a browser, so injecting broken scripts can make it unresponsive.

🔧 Step 1: Enable Mod Support

Open vivaldi://experiments/ in your address bar.
Enable the "Allow CSS modifications" experiment.
Go to Vivaldi Settings → search for "Mods" → set the path to your custom mods folder.
💡 Tip: I recommend storing this folder on a separate drive for easier backup and version control. You can also create a desktop shortcut to it.

📁 Step 2: Backup and Modify window.html

Navigate to your Vivaldi installation directory: 'C:\Program Files\Vivaldi\Application<version>\resources\vivaldi' (or whatever it is)
Locate the file named window.html.
Make a backup of this file - store it in an archive folder (e.g., /mods/archive/). This serves as your fallback (v1.0) if anything breaks.
📥 Step 3: Install Mods

CSS Mods:
Place your .css files in your main mods folder (the one you linked in Vivaldi Settings).
JavaScript Mods:
JavaScript mods must be injected through a modified window.html file, which means you also need to:

Edit window.html and add your script (<script src="YourScriptName.js">):

Copy both the modified window.html and the .js script into the Vivaldi installation folder. If you need to, you can edit these files using Notepad or any code editor.

Pro Tip: Keep archived versions of all mods (CSS and JS) - you never know when a rollback might save you.

I have Vivaldi installed in its default path - feel free to change it if you have to.

🗂️ Pro Tip: Keep all mods (CSS and JS) archived too - you never know when you'll need to revert or roll back to a previous version.

⚠️ After Browser Updates

Vivaldi updates will reset the window.html file and may disable your mods. Always back up your changes and reapply them after updating the browser or run the .bat script included in this repo to reapply your changes.

If your Vivaldi is installed in a different location than C:\Program Files\Vivaldi...:

Open the .bat file in Notepad.
Update the path variable to match your installation directory.
Save the file with the .bat extension (select "All Files" in Save As).
Run it again.
🛠 TROUBLESHOOTING

If something breaks, restore your original window.html.

Mods may stop working after major Vivaldi updates, check the [Vivaldi Modding Forum] (https://forum.vivaldi.net/category/52/modifications/) or r/VivaldiBrowser.

I'm not an expert-I figured this out in a morning of trial and error. If I can do it, so can you.

🧠 Final Note

Use mods at your own risk. Vivaldi is one of the few browsers that makes this kind of customization even possible, so treat it with respect. Back up often, experiment safely, and enjoy your truly personalized browser!
