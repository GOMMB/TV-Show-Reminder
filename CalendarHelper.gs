function deleteAllEventsInCalendar(calendar) {
  let events = calendar.getEvents(new Date(0, 0, 0, 0, 0, 0), new Date(9999, 0, 0, 0, 0, 0))
  events.forEach(event => event.deleteEvent())
}

function parseISOLocal(s) {
  var b = s.split(/\D/);
  return new Date(b[0], b[1]-1, b[2]);
}

function addEpisodesToCalendar(calendar, episodes) {
  episodes.forEach(episode => {
    let startTime = parseISOLocal(episode['episodeAirDate'])
    let endTime = new Date(startTime.getTime() + episode['episodeRuntime']*60000)
    calendar.createEvent(
      episode['showName'],
      startTime,
      endTime,
      {description: episode['episodeName']}
    )
  })
}
