

var linksContainer = new Vue({
  el: '#links-container',
  data: {
    links: []
  }
});

var previewContainer = new Vue({
  el: '#preview-container',
  data: {
    preview: ''
  }
});

$(document).ready(() => {
  $.ajax('/links').then(res => {
    linksContainer.links = res;
  });
});





