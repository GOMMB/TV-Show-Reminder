# TV Show Reminder
A Google Apps Script to remind yourself of new episodes for TV shows on your watchlist.

## What This Does
This script uses the themoviedb.org API to get the next air date for all the TV shows on your watchlist in your themoviedb.org account and creates calendar events for each of them so that you never forget when a new episode of your favorite show is released. If no next air date is known yet for the show, then no calendar events will be created for it. themoviedb.org does not provide air times for episodes so the calendar event will be created at midnight of the date the episode airs, and the event length will match the runtime of the episode (unless the runtime isn't known yet, in which case the calendar event will just be 60 minutes).

## Setup
Create an account on themoviedb.org, add all of you shows to your watchlist, and generate an API access token. Put that token at the top of Code.gs. Then create a new Google Calendar to use just for this (DO NOT USE AN EXISTING CALENDAR SINCE IT WILL DELETE ALL OF THE EVENTS) and put the name of that calendar at the top of Code.gs as well. Add any notification settings to that calendar that you want (I have it set to email me 3 hours before any event created in the calendar so that it emails me for each episode release). Add all three of the gs files to a Google Apps Script project, then run the install function in Code.gs. That's it!
