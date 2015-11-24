[#if content.link?has_content]
  [#if content.link?contains("facebook")]
    [#assign iconclass="fa-facebook-square"]
    [#assign alttext="Facebook"]
  [#elseif content.link?contains("flickr")]
    [#assign iconclass="fa-flickr"]
    [#assign alttext="Flickr"]
  [#elseif content.link?contains("github")]
    [#assign iconclass="fa-github"]
    [#assign alttext="Github"]
  [#elseif content.link?contains("instagram")]
    [#assign iconclass="fa-instagram"]
    [#assign alttext="Instagram"]
  [#elseif content.link?contains("linkedin")]
    [#assign iconclass="fa-linkedin-square"]
    [#assign alttext="LinkedIn"]
  [#elseif content.link?contains("pinterest")]
    [#assign iconclass="fa-pinterest-square"]
    [#assign alttext="Pinterest"]
  [#elseif content.link?contains("spotify")]
    [#assign iconclass="fa-spotify"]
    [#assign alttext="Spotify"]
  [#elseif content.link?contains("tumblr")]
    [#assign iconclass="fa-tumblr-square"]
    [#assign alttext="Tumblr"]
  [#elseif content.link?contains("twitter")]
    [#assign iconclass="fa-twitter-square"]
    [#assign alttext="Twitter"]
  [#elseif content.link?contains("vimeo")]
    [#assign iconclass="fa-vimeo-square"]
    [#assign alttext="Vimeo"]
  [#elseif content.link?contains("wordpress")]
    [#assign iconclass="fa-rss-square"]
    [#assign alttext="Wordpress"]
  [#elseif content.link?contains("txstate.edu")]
    [#assign iconclass="fa-star"]
    [#assign alttext="Texas State"]
  [#elseif content.link?matches(r".*youtu\.?be.*")]
    [#assign iconclass="fa-youtube-square"]
    [#assign alttext="YouTube"]
  [/#if]
  [#if !alttext?has_content]
    [#-- unrecognized service, let's see if we can regex out the top two levels of their domain name --]
    [#assign alttext = content.link?replace('^.*//','','r')?replace('/.*', '', 'r')?replace('^[^\\.]*\\.([^\\.]\\.[^\\.]*)$','$1','r')]
    [#if !alttext?has_content][#assign alttext = "Social Link"][/#if]
  [/#if]

  [#assign linktext = content.title!alttext]
  [#if content.icononly!false][#assign linktext = ''][/#if]

  [#assign title = alttext]
  [#if linktext?lower_case?contains(alttext?lower_case)]
    [#assign title = '']
  [/#if]

  <a href="${content.link}" class="gato-sociallink ${(content.icononly!false)?string('icononly','')}">
    [#if content.icon?has_content]
      <img src="${damfn.getAssetLink(content.icon)}" alt="${title}" title="${title}"/>[#--
    --][#else][#--
      --]<i class="fa ${iconclass!'fa-share-alt-square'}" aria-label="${title}"></i>[#--
    --][/#if][#--
    --]${linktext}[#--
  --]</a>
[/#if]
