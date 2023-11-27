const headers = {
  Authorization: `Bearer ${theMovieDbAccessToken}`,
  accept: 'application/json'
}

function getWatchlistUrlForPage(page) {
  return `https://api.themoviedb.org/3/account/1/watchlist/tv?language=en-US&page=${page}&sort_by=created_at.asc`
}

function getWatchlistSeriesIds() {
  let page = 1
  let totalPages = 1
  let seriesIds = []
  do {
    let response = UrlFetchApp.fetch(getWatchlistUrlForPage(page), {headers})
    let data = JSON.parse(response.getContentText())

    let idsForPage = data['results'].map(show => show['id'])
    seriesIds.push(...idsForPage)

    totalPages = data['total_pages']
    page++
  } while (page <= totalPages)

  return seriesIds
}

function getSeriesDetailsUrlForSeriesId(seriesId) {
  return `https://api.themoviedb.org/3/tv/${seriesId}?language=en-US`
}

function getNextRegularEpisodes(seriesIds) {
  let nextRegularEpisodes = []
  let seriesNames = {}

  let requests = seriesIds.map(seriesId => ({
    url: getSeriesDetailsUrlForSeriesId(seriesId),
    headers
  }))
  let datas = UrlFetchApp.fetchAll(requests).map(response => JSON.parse(response.getContentText()))

  for (data of datas) {
    seriesNames[data['id']] = data['name']

    let nextEpisode = data['next_episode_to_air']
    if (nextEpisode === null) {
      continue
    }
    let runtime = nextEpisode['runtime'] === null ? 60 : nextEpisode['runtime']
    nextRegularEpisodes.push({
      showName: data['name'],
      episodeName: nextEpisode['name'],
      episodeRuntime: runtime,
      episodeAirDate: nextEpisode['air_date']
    })
  }
  
  return { nextRegularEpisodes, seriesNames }
}

function getSpecialEpisodesForSeriesId(seriesId) {
  return `https://api.themoviedb.org/3/tv/${seriesId}/season/0`
}

function getUpcomingSpecialEpisodes(seriesIds, seriesNames) {
  let specialEpisodes = []

  let requests = seriesIds.map(seriesId => ({
    url: getSpecialEpisodesForSeriesId(seriesId),
    headers,
    muteHttpExceptions: true
  }))
  let allShowsEpisodes = UrlFetchApp.fetchAll(requests)
  .filter(response => response.getResponseCode() != '404')
  .map(response => JSON.parse(response.getContentText()))
  .map(data => data['episodes'])
  .map(episodes => episodes.reverse())

  for (reversedEpisodes of allShowsEpisodes) {
    for (episode of reversedEpisodes) {
      let airDate = episode['air_date']
      if (airDate === null) {
        continue
      }
      if (new Date() > parseISOLocal(airDate)) {
        break
      }
      let runtime = episode['runtime'] === null ? 60 : episode['runtime']
      specialEpisodes.push({
        showName: seriesNames[episode['show_id']],
        episodeName: episode['name'],
        episodeRuntime: runtime,
        episodeAirDate: airDate
      })
    }
  }

  return specialEpisodes
}

function getNextEpisodesForWatchlistShows() {
  let seriesIds = getWatchlistSeriesIds()
  let nextEpisodes = []

  let { nextRegularEpisodes, seriesNames } = getNextRegularEpisodes(seriesIds)
  nextEpisodes.push(...nextRegularEpisodes)
  nextEpisodes.push(...getUpcomingSpecialEpisodes(seriesIds, seriesNames))

  return nextEpisodes
}