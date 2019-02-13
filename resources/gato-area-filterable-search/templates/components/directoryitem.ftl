[#assign tags = gf.propertyValues(content.tags![])]
<div class="listitem" data-tags="${tags?join(",")}" data-keywords="[#if content.keywords?has_content]${content.keywords?join(',')}[/#if]">
[#if content.link?has_content]
  <a href="${gf.filterUrl(content.link)}">
[/#if]
<div class="listitem-title" data-searchable="true">
  ${content.prefix!} ${content.firstname!} ${content.lastname!}
</div>
<div class="listitem-alpha" data-alpha="true">
  ${content.lastname!}${content.firstname!}
</div>
[#if content.link?has_content]
  </a>
[/#if]
[#if content.description?has_content]
  <div class="listitem-description" data-searchable="true">
    ${cmsfn.decode(content).description}
  </div>
[/#if]
[#if content.email?has_content]
  Email: ${content.email}
[/#if]
[#if content.office?has_content]
  Office: ${content.office}
[/#if]
[#if content.phone?has_content]
  Phone: ${content.phone}
[/#if]
</div>
