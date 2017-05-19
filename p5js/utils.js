function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (pair[0] == variable) {
      return pair[1];
    }
  }
  return false;
}


function getScreenSize() {
  var B = document.body;
  var H = document.documentElement;
  var height;
  var width;

  if (typeof document.height !== 'undefined') {
    height = document.height // For webkit browsers
  }
  else {
    height = Math.max(B.scrollHeight, B.offsetHeight, H.clientHeight, H.scrollHeight, H.offsetHeight);
  }


  if (typeof document.width !== 'undefined') {
    width = document.width // For webkit browsers
  }
  else {
    width = Math.max(B.scrollWidth, B.offsetWidth, H.clientWidth, H.scrollWidth, H.offsetWidth);
  }

  return {
    height,
    width
  };
}
