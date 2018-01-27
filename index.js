'use strict';


function renderResults(config) {

  if(!config.q) return;

  let url = 'https://www.googleapis.com/youtube/v3/search';

  let data = {
    part: 'snippet',
    key: 'AIzaSyBSMZyK4DmXCmT1fro8KGCajfOa1u1ai4I'
  };

  $.extend(data, config);

  $.getJSON(url, data, function(data, textStatus, jqXHR) {

    console.log(data, textStatus, jqXHR);

    let html = `
      <header>
        <h2>${data.items.length} Results</h2>
      </header>
    `;

    html += resultsHTML(data.items);
    html += navigationHTML(data);

    $('#results-target').html(function() {
      $(this).prop('hidden', false);
      return html;
    });
  });
}


function searchVideos(e, config) {

  if(typeof(e) === 'object') e.preventDefault();
  // console.log(e);

  let search = (typeof(e) !== 'object') ? e : $('#video-title').val();

  let data = {
    q: search
  };

  // console.log(config);
  if(config) {
    $.extend(data, config);
  }

  renderResults(data);
}


function navigationHTML(data) {

  let html = '';
  let prevPageToken = data.prevPageToken ? data.prevPageToken : '';
  let nextPageToken = data.nextPageToken ? data.nextPageToken : '';

  html += '<div class="prev page-result">';

  if(prevPageToken) {
    html += `<button data-token="${prevPageToken}">Previous Page</button>`;
  }

  html += '</div>';
  html += '<div class="next page-result">';

  if(nextPageToken) {
    html += `<button data-token="${nextPageToken}">Next Page</button>`;
  }

  html += '</div>';

  html = '<div id="results-navigation">' + html + '</div>';

  return html;
}


function resultsHTML(items) {

  let html = ``;

  items.forEach(function(item) {

    html += `
      <li>
        <a href="https://www.youtube.com/watch?v=${item.id.videoId}" target="_blank">
          <img src="${item.snippet.thumbnails.medium.url}" alt="the video thumbnail">
          <h3>${item.snippet.title}</h3>
        </a>

        <h4>${item.snippet.channelTitle}</h4>
        <a href="https://www.youtube.com/channel/${item.snippet.channelId}" target="_blank">Go to channel</a>
      </li>
    `;
  });

  html = '<ul>' + html + '</ul>';


  return html;
}


$(function() {

  // searchVideos('test');

  let form = $('#video-search-form');

  form.on('submit', searchVideos);

  $('#results-target').on('click', 'button', function(e) {
    form.trigger('submit', { pageToken: $(this).attr('data-token') });
  });

});
