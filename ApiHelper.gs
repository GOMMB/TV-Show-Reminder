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

function getNextEpisodesForWatchlistShows() {
  let seriesIds = getWatchlistSeriesIds()
  let nextEpisodes = []

  let requests = seriesIds.map(seriesId => ({
    url: getSeriesDetailsUrlForSeriesId(seriesId),
    headers
  }))
  let datas = UrlFetchApp.fetchAll(requests).map(response => JSON.parse(response.getContentText()))

  for (data of datas) {
    let nextEpisode = data['next_episode_to_air']
    if (nextEpisode === null) {
      continue
    }
    let runtime = nextEpisode['runtime'] === null ? 60 : nextEpisode['runtime']
    nextEpisodes.push({
      showName: data['name'],
      episodeName: nextEpisode['name'],
      episodeRuntime: runtime,
      episodeAirDate: nextEpisode['air_date']
    })
  }

  return nextEpisodes
}
