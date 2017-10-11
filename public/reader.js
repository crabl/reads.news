var linksContainer = new Vue({
  el: '#links-container',
  data: {
    links: []
  },
  methods: {
    getPreview: link => {
      getPreview(link);
    }
  }
});

var previewContainer = new Vue({
  el: '#preview-container',
  data: {
    preview: ''
  }
});

function getPreview(url) {
  $.ajax({
    url: '/preview',
    method: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({
      url
    })
  }).then(res => {
    previewContainer.preview = res;
  });
}

$(document).ready(() => {
  $.ajax('/links').then(res => {
    linksContainer.links = res;
  });
});





