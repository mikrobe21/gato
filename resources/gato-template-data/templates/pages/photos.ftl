[
[#list cmsfn.children(gf.singleComponent(content, 'contentParagraph').column1, 'mgnl:component') as section]
  {
    "section": "${ section.title! }",
    "images": [
      [#list cmsfn.children(section.images, 'mgnl:component') as photo]
        [#assign asset = damfn.getAsset(photo.image)]
        {
          "name": "${ asset.fileName }",
          "modified": "${gf.getLastModified(photo)?string("EEE', 'dd' 'MMM' 'yyyy' 'HH:mm:ss' 'Z")}",
          "image": "${gf.absoluteUrl(damfn.getAssetLink(photo.image))}",
          "imagecroptop": "${ photo.imagecroptop }",
          "imagecropleft": "${ photo.imagecropleft }",
          "imagecropright": "${ photo.imagecropright }",
          "imagecropbottom": "${ photo.imagecropbottom }"
        }[#if photo_has_next],[/#if]
      [/#list]
    ]
  }[#if section_has_next],[/#if]
[/#list]
]
