[#macro linkList links ul=true]
  [#if ul]
    <ul>
  [/#if]

    [#list links as link]
      <li><a href="${gf.filterUrl(link.link)}">${gf.filterLinkTitle(link.text, link.link)}</a></li>
    [/#list]

  [#if ul]
    </ul>
  [/#if]
[/#macro]

[#macro featuredLinksFuture links]
  [#local links = links?chunk(3)]

    <li>
      <div class="gato-accordion" data-start-collapsed="true">
        <div class="gato-accordion-header">
          <a href="#" aria-haspopup="true" aria-expanded="false">Undergraduate <i class="fa fa-caret-down"></i></a>
        </div>
        <div class="gato-accordion-content">
          [@linkList links[0] /]
        </div>
      </div>
    </li>

  [#if links?size > 1]
    <li>
      <div class="gato-accordion" data-start-collapsed="true">
        <div class="gato-accordion-header">
          <a href="#" aria-haspopup="true" aria-expanded="false">Graduate <i class="fa fa-caret-down"></i></a>
        </div>
        <div class="gato-accordion-content">
          [@linkList links[1] /]
        </div>
      </div>
    </li>
  [/#if]
[/#macro]

[#macro audienceLinks name]
  [#assign component = cmsfn.asContentMap(cmsfn.nodeByPath('/homepage-data/audience-links/${name}', 'gatoapps'))]
  [#local decodedContent = cmsfn.decode(component)]

  <li>
    <a href="${gf.filterUrl(component.link)}">${gf.filterLinkTitle(component.title, component.link)}</a>
    <ul class="${mobileClass}secondary_nav">
      [#if component.featuredLinks?has_content]
        [#local featuredLinks = cmsfn.children(component.featuredLinks, "mgnl:contentNode")]
        [#local nested][#nested featuredLinks][/#local]
        [#if nested?has_content]
          ${nested}
        [#else /]
          [@linkList featuredLinks?sort_by("text") false/]
        [/#if]
      [/#if]

      <li>
        <a href="${gf.filterUrl(component.buttonLink)}">
          ${gf.filterLinkTitle(decodedContent.buttonText, component.buttonLink)}
        </a>
      </li>

      [#if component.otherLinks?has_content]
        <li>
          <div class="gato-accordion" data-start-collapsed="true">
            <div class="gato-accordion-header">
              <a href="#" aria-haspopup="true" aria-expanded="false">More <i class="fa fa-caret-down"></i></a>
            </div>
            <div class="gato-accordion-content">
              [@linkList cmsfn.children(component.otherLinks, "mgnl:contentNode")?sort_by("text") /]
            </div>
          </div>
        </li>
      [/#if]
    </ul>
  </li>
[/#macro]

[#macro menuBar isMobile]
  [#assign mobileClass = isMobile?string('mobile_', '')]
  <ul class="${mobileClass}primary_nav">

    [@audienceLinks 'future-students' ; featuredLinks]
      [@featuredLinksFuture featuredLinks /]
    [/@audienceLinks]
    [@audienceLinks 'current-students' /]
    [@audienceLinks 'faculty-staff' /]
    [@audienceLinks 'alumni-visitors' /]

  </ul>
[/#macro]
