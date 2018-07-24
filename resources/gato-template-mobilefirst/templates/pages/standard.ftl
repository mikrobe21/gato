[#include "/gato-template/templates/includes/head.ftl"]

<!DOCTYPE HTML>
<html lang="en">
  <head>
    [@templatejs scripts=['gato-template-mobilefirst/js/standard.cjs']/]
    [@templatehead/]
    [@cms.area name="templatecss"/]
  </head>
  <body class="${cmsfn.isEditMode()?string('admin','')}">
    <div class="page-container">
      [@skipnav/]
      <div class="page">
        [#include "includes/menu.ftl"]
        [#include "includes/header.ftl"]
        [#if def.parameters.isHomeTemplate!false]
          [@cms.area name="home-banner" content=gf.getOrCreateArea(homepage, 'home-banner')/]
        [#else]
          [@cms.area name="subpage-banner" content=gf.getOrCreateArea(page, 'subpage-banner')/]
        [/#if]
        [#import "/gato-template-mobilefirst/templates/includes/headerImageLogic.ftl" as headerLogic]
        [@cms.area name="organization-info" content=gf.getOrCreateArea(homepage, 'organization-info') editable=isHomePage contextAttributes={"isHome":def.parameters.isHomeTemplate!false, "hasImage":headerLogic.hasImage}/]
        <div class="page_content">
          <main class="contentcolumn">
            [#assign hideSidebar = true /]
            [@headline hideSidebar /]
            [@cms.area name="mobileFirstContent"/]
          </main>
        </div>
        [#include "includes/footer.ftl"]
      </div>
      [@cssjsmodals /]
      [#include "/gato-template/templates/includes/video-modal.ftl"]
    </div>
  </body>
</html>
