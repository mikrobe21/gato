[#assign aspectclass = 'tall']
[#if gf.getImgAspectRatio(content.image) > 2.8]
  [#assign aspectclass = 'wide']
[/#if]
[#assign src = gf.getImgDefault(content.image)]
[#assign srcset = gf.getSrcSet(content.image)]

<div class="banner-image ${aspectclass}">
  <img src="${src}" alt="" srcset="${srcset}" sizes="100vw" width="${gf.getImgWidth(content.image)?c}" height="${gf.getImgHeight(content.image)?c}">

  [#if content.videourl?has_content]
    <a href="${content.videourl}" class="feature-play-button"
    data-embed="${gf.jsonGetString(gf.oEmbedCached(content, content.videourl), 'html')?html}">
      <i class="fa fa-play" aria-hidden="true"></i>
      <span class="visuallyhidden">Play Video</span>
    </a>
  [/#if]
  [#if cmsfn.isEditMode()]
  <div cms:edit="bar" class="editBanner"></div>
  [/#if]
</div>
