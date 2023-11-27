function deleteAllEventsInCalendar(calendar) {
  let events = calendar.getEvents(new Date(0, 0, 0, 0, 0, 0), new Date(9999, 0, 0, 0, 0, 0))
  events.forEach(event => event.deleteEvent())
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
