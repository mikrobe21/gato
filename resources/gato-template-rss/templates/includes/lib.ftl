[#macro rssitem node moddate='' body='' author='' title='' link='' guid='' asset='' enclosure={} thumbnail={}]
  <item>
    <pubDate>
      [#if !moddate?has_content]
        [#local moddate = gf.getModificationDate(node)]
      [/#if]
      [#if !moddate?has_content]
        [#local moddate = .now]
      [/#if]
      ${moddate?string["EEE, dd MMM yyyy HH:mm:ss Z"]}
    </pubDate>

    [#if title?has_content]
      <title>${title}</title>
    [#elseif node.title?has_content]
      <title>${node.title}</title>
    [/#if]

    [#if link?has_content]
      <link>${gf.absoluteUrl(link)}</link>
    [#elseif node.link?has_content]
      <link>${ gf.absoluteUrl(node.link) }</link>
    [#else]
      <link>${gf.absoluteUrl(cmsfn.link(cmsfn.page(node)))}#${gf.uuidToHtmlId(node.@id)}</link>
    [/#if]

    [#if author?has_content]
      <author>${author}</author>
    [/#if]

    [#if !body?has_content]
      [#local body]
        [#nested]
      [/#local]
    [/#if]
    <description><![CDATA[${gf.convertLinksToAbsolute(body)}]]></description>

    [#if asset?has_content]
      <media:thumbnail url="${gf.absoluteDamUrl(asset)}" width="${gf.getImgWidth(asset)}" height="${gf.getImgHeight(asset)}" time="${gf.toAsset(asset).getLastModified()}" />
      <enclosure url="${gf.absoluteDamUrl(asset)}" length="${gf.toAsset(asset).getFileSize()}" type="${gf.toAsset(asset).getMimeType()}" />
    [#else]
      [#if enclosure?has_content]
        [#if enclosure.mime?has_content]
          [#local mime = enclosure.mime]
        [#elseif enclosure.extension?has_content]
          [#local mime = gf.getMimeType(enclosure.extension)]
        [#else]
          [#local extension = enclosure.url?replace('[#\\?].*$','','r')?replace('.*\\.','','r')]
          [#if extension?has_content]
            [#local mime = gf.getMimeType(extension)]
          [/#if]
        [/#if]
        [#if !mime?has_content]
          [#local mime = 'application/octet-stream']
        [/#if]
        <enclosure url="${gf.absoluteUrl(enclosure.url)}" length="${enclosure.size!0}" type="${mime}" />
      [/#if]

      [#if thumbnail?has_content]
        <media:thumbnail url="${gf.absoluteUrl(thumbnail.url!)}" width="${thumbnail.width!100}" height="${thumbnail.height!100}"[#if thumbnail.time?has_content] time="${thumbnail.time}"[/#if] />
      [/#if]
    [/#if]

    [#if !guid?has_content]
      [#local guid = node.@id]
    [/#if]
    <guid isPermaLink="false">${ guid }</guid>
  </item>
[/#macro]
