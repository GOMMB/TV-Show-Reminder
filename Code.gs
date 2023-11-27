const theMovieDbAccessToken = '' // Put your API access token here from themoviedb.org
const calendarName = '' // Put the calendar name here that you created for this (THIS SCRIPT WILL DELETE ALL THE EVENTS ON THE PROIVIDED CALENDAR SO DON'T USE ONE WITH EVENTS ALREADY ON IT)

function install() {
  ScriptApp.newTrigger('refreshShowsToCalendar')
        .timeBased()
        .everyDays(1)
        .atHour(19)
        .create();
}

function refreshShowsToCalendar() {
  let showsToAdd = getNextEpisodesForWatchlistShows()
  console.log(showsToAdd)

  let calendar = CalendarApp.getCalendarsByName(calendarName)[0]
  deleteAllEventsInCalendar(calendar)
  addEpisodesToCalendar(calendar, showsToAdd)
}
