// https://github.com/Zod-/jsVideoUrlParser, Copyright (c) 2014 Julian Hangstörfer The MIT License (MIT)
function URLParser(){"use strict";this.plugins={}}function cloneObject(a){"use strict";if(null===a||"object"!=typeof a)return a;var b=a.constructor();for(var c in a)b[c]=cloneObject(a[c]);return b}function getQueryParams(a){"use strict";a=a.split("+").join(" ");for(var b,c={},d=/[\?#&]([^=]+)=([^&#]*)/g;b=d.exec(a);)c[decodeURIComponent(b[1])]=decodeURIComponent(b[2]);return c}function combineParams(a){"use strict";var b="",c=0,d=Object.keys(a.params);if(0===d.length)return"";for(d.sort(),a.hasParams||(b+="?"+d[0]+"="+a.params[d[0]],c+=1);c<d.length;c+=1)b+="&"+d[c]+"="+a.params[d[c]];return b}function getTime(a){"use strict";var b,c=0,d={s:1,m:60,h:3600,d:86400,w:604800};if(!a.match(/^(\d+[smhdw]?)+$/))return 0;a=a.replace(/([smhdw])/g," $1 ").trim(),b=a.split(" ");for(var e=0;e<b.length;e+=2)c+=parseInt(b[e],10)*d[b[e+1]||"s"];return c}URLParser.prototype.parse=function(a){"use strict";var b,c=this,d=a.match(/(?:(?:https?:)?\/\/)?(?:[^\.]+\.)?(\w+)\./i),e=d?d[1]:void 0;return d&&e&&c.plugins[e]&&c.plugins[e].parse&&(b=c.plugins[e].parse.call(this,a,getQueryParams(a)))?(b.params&&0===Object.keys(b.params).length&&delete b.params,b.provider=c.plugins[e].provider,b):void 0},URLParser.prototype.bind=function(a){"use strict";var b=this;if(b.plugins[a.provider]=a,a.alternatives)for(var c=0;c<a.alternatives.length;c+=1)b.plugins[a.alternatives[c]]=a},URLParser.prototype.create=function(a){"use strict";var b=this,c=a.videoInfo,d=a.params,e=b.plugins[c.provider];return d="internal"===d?c.params:d||{},e&&(a.format=a.format||e.defaultFormat,e.formats.hasOwnProperty(a.format))?e.formats[a.format](c,cloneObject(d)):void 0};var urlParser=new URLParser;urlParser.bind({provider:"dailymotion",alternatives:["dai"],parse:function(a,b){"use strict";var c,d,e={params:b};return c=a.match(/(?:\/video|ly)\/([A-Za-z0-9]+)/i),d=c?c[1]:void 0,b.hasOwnProperty("start")&&(b.start=getTime(b.start)),d?(e.mediaType="video",e.id=d,e):void 0},defaultFormat:"long",formats:{"short":function(a){"use strict";return"https://dai.ly/"+a.id},"long":function(a,b){"use strict";return"https://dailymotion.com/video/"+a.id+combineParams({params:b})},embed:function(a,b){"use strict";return"//www.dailymotion.com/embed/video/"+a.id+combineParams({params:b})}}}),urlParser.bind({provider:"twitch",parse:function(a,b){"use strict";var c,d,e,f,g={};return c=a.match(/twitch\.tv\/(\w+)(?:\/(.)\/(\d+))?/i),e=c?c[1]:void 0,f=c?c[2]:void 0,d=c?c[3]:void 0,(e=b.channel||b.utm_content||e)?(d?(g.mediaType="video",g.id=d,g.idPrefix=f):g.mediaType="stream",g.channel=e,g):void 0},defaultFormat:"long",formats:{"long":function(a,b){"use strict";var c="";return"stream"===a.mediaType?c="https://twitch.tv/"+a.channel:"video"===a.mediaType&&(c="https://twitch.tv/"+a.channel+"/"+a.idPrefix+"/"+a.id),c+=combineParams({params:b})},embed:function(a,b){"use strict";return"//www.twitch.tv/"+a.channel+"/embed"+combineParams({params:b})}}}),urlParser.bind({provider:"vimeo",alternatives:["vimeopro"],parse:function(a){"use strict";var b,c;return b=a.match(/(?:\/(?:channels\/[\w]+|(?:album\/\d+\/)?videos?))?\/(\d+)/i),c=b?b[1]:void 0,c?{mediaType:"video",id:c}:void 0},defaultFormat:"long",formats:{"long":function(a,b){"use strict";return"https://vimeo.com/"+a.id+combineParams({params:b})},embed:function(a,b){"use strict";return"//player.vimeo.com/video/"+a.id+combineParams({params:b})}}}),urlParser.bind({provider:"youtube",alternatives:["youtu"],parse:function(a,b){"use strict";var c,d,e,f={params:b};if(c=a.match(/(?:(?:v|be|videos|embed)\/(?!videoseries)|v=)([\w\-]{11})/i),d=c?c[1]:void 0,b.v===d&&delete b.v,b.list===d?delete b.list:e=b.list,b.hasOwnProperty("start")&&(b.start=getTime(b.start)),b.hasOwnProperty("t")&&(b.start=getTime(b.t),delete b.t),d)f.mediaType="video",f.id=d,e&&(f.list=e);else{if(!e)return void 0;f.mediaType="playlist",f.list=e}return f},defaultFormat:"long",formats:{"short":function(a,b){"use strict";var c="https://youtu.be/"+a.id;return b.start&&(c+="#t="+b.start),c},embed:function(a,b){"use strict";var c="//youtube.com/embed";return"playlist"===a.mediaType?b.listType="playlist":(c+="/"+a.id,1==b.loop&&(b.playlist=a.id)),c+=combineParams({params:b})},"long":function(a,b){"use strict";var c="",d=b.start;return delete b.start,"playlist"===a.mediaType?(b.feature="share",c+="https://youtube.com/playlist"):(b.v=a.id,c+="https://youtube.com/watch"),c+=combineParams({params:b}),"playlist"!==a.mediaType&&d&&(c+="#t="+d),c},"default":"long"}});

var uStreamRecordedRegex = /^https?:\/\/www\.ustream\.tv\/recorded\/(\d+)\/?$/;
var uStreamChannelRegex = /^https?:\/\/www\.ustream\.tv\/channel\/([^\/]*)\/?$/;
var flowPlayerTypes = {
  "mp4": "video/mp4",
  "m4v": "video/mp4",
  "webm": "video/webm",
  "ogv": "video/ogg",
  "m3u8": "application/x-mpegurl",
  "flv": "video/flash"
}

function getVideoInfo(url) {
  var vInfo = {};
  vInfo.url = url;
  var urlInfo = urlParser.parse(vInfo.url);

  if (urlInfo) {
    vInfo.playerType = urlInfo.provider;
    vInfo.videoId = urlInfo.id;
  } else if (url.match(/^https:\/\/mediaflo\.txstate\.edu/)) {
    vInfo.playerType = "mediaflo";
  } else if (match = url.match(uStreamRecordedRegex)) {
    vInfo.playerType = "ustream_recorded";
    vInfo.videoId = match[1];
  } else if (match = url.match(uStreamChannelRegex)) {
    vInfo.playerType = "ustream_channel";
    vInfo.videoId = match[1];
  } else if (url.startsWith("<iframe") && url.endsWith("</iframe>")) {
    vInfo.playerType = "embed";
  } else if (flowPlayerTypes[getFileExtension(url)]) {
    vInfo.playerType = "flow";
  } else {
    vInfo.playerType = "unknown";
  }

  return vInfo;
}

function getFileExtension(url) {
  url = url.split('?', 2)[0];
  var dot = url.lastIndexOf('.');
  if (dot == -1) { return ''; }

  return url.substr(dot + 1);
}

function buildFlowPlayer(el, videoInfo, opts) {
  var container = jQuery('<div class="functional"></div>');
  jQuery(el).append(container);
  var ext = getFileExtension(videoInfo.url);
  var usehlsjs = false;
  var startflowplayer = function () {
    flowplayer(container, {
      embed: false,
      hlsjs: usehlsjs,
      autoplay: opts.autoplay ? true : false,
      clip: {
        sources: [{ type: flowPlayerTypes[ext], src: videoInfo.url}]
      }
    });
  }
  if (ext == 'm3u8') jQuery.ajax(videoInfo.url).done(function() { usehlsjs = {}; startflowplayer(); }).fail(startflowplayer);
  else startflowplayer();
}

function buildEmbed(el, embedCode) {
  var iframe = jQuery(embedCode);
  jQuery(el).append(embedCode);
}

function buildUstreamChannel(el, videoInfo) {
  if (videoInfo.channelId) {
    var iframe = '<iframe src="http://www.ustream.tv/embed/' + videoInfo.channelId + '?html5ui" allowfullscreen webkitallowfullscreen scrolling="no" frameborder="0" style="border: 0 none transparent;"></iframe>';
    jQuery(el).append(iframe);
  } else {
    el.innerHTML = "Sorry, we're unable to play this video.";
  }
}

function buildUstreamRecorded(el, videoInfo) {
  var iframe = '<iframe src="http://www.ustream.tv/embed/recorded/' + videoInfo.videoId + '?html5ui" allowfullscreen webkitallowfullscreen scrolling="no" frameborder="0" style="border: 0 none transparent;"></iframe>';
  jQuery(el).append(iframe);
}

function oEmbedFinished(el, info) {
  el = jQuery(el);
  el.html(info.html);
  var url = el.data('url');
  var iframe = el.find('iframe');
  iframe.removeAttr('frameborder');
  var title = el.data('embedtitle');
  if (title) iframe.attr('title', title);
  if (getVideoInfo(url).playerType == "youtube" && el.data('openinapp') && is_url_scheme_appropriate()) {
    var appurl = url.replace(/^https?:/, 'vnd.youtube:');
    el.after('<div class="streaming-open-in-app"><a href="'+appurl+'">Open 360 video in YouTube <i class="fa fa-chevron-right" aria-hidden="true"></i></a></div>');
  }
}

function oEmbedGetInfo(el, oembedurl, videourl) {
  jQuery.ajax(oembedurl, {dataType: 'json'})
    .done(function(data) {
      oEmbedFinished(el, data);
    })
    .fail(function () { createNonOembedPlayer(el, videourl); });
}

function oEmbedAutodiscover(el, videourl, opts) {
  jQuery.ajax(videourl, {dataType: 'xml'})
    .done(function(data) {
      var oembedurl = jQuery('link[type="application/json+oembed"]', data).attr('href');
      if (!isBlank(oembedurl)) oEmbedGetInfo(el, oembedurl, videourl);
      else createNonOembedPlayer(el, videourl);
    })
    .fail(function () { createNonOembedPlayer(el, videourl, opts); });
}

function createPlayer(el, url, opts) {
  var urlInfo = urlParser.parse(url);
  var oembedurl;
  var embedcode = jQuery(el).data('embed');
  if (!isBlank(embedcode)) {
    oEmbedFinished(el, {html:embedcode});
  } else if (url.match(/^https?:\/\/mediaflo/)) {
    oEmbedGetInfo(el, "https://secure.its.txstate.edu/mediaflo_oembed/mediaflo_oembed?format=json&url="+encodeURIComponent(url), url);
  } else {
    oEmbedAutodiscover(el, url, opts);
  }
}

function createNonOembedPlayer(el, url, opts) {
  var videoInfo = getVideoInfo(url);
  switch(videoInfo.playerType) {
    case "embed":
      buildEmbed(el, videoInfo.url);
      break;
    case "flow":
      buildFlowPlayer(el, videoInfo, opts);
      break;
    case "ustream_recorded":
      buildUstreamRecorded(el, videoInfo);
      break;
    case "ustream_channel":
      videoInfo.channelId = jQuery(el).data('videoid');
      buildUstreamChannel(el, videoInfo);
      break;
    case "unknown":
      if (videoInfo.url.startsWith("http")) {
        jQuery(el).append('<a href="' + videoInfo.url + '">' + videoInfo.url + '</a>');
      } else {
        el.innerHTML = "Sorry, we're unable to play this video.";
      }
      jQuery(el).closest('.gatoEmbedContainer').removeClass('gatoEmbedContainer');
      break;
  }

  var iframe = jQuery(el).find('iframe');
  if (iframe.length && !iframe.attr('title')) {
    iframe.attr('title', 'Video Player');
  }
}

jQuery(document).ready(function($) {
  $('.gatoEmbedContainer').each(function(i) {
    var container = this;
    container.id = 'gato-player-' + i;
    createPlayer(container, jQuery(container).data("url"));
  });
});
