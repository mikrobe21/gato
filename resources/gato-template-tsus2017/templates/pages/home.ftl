[#include "/gato-template/templates/includes/head.ftl"]
<!DOCTYPE HTML>
<html lang="en">
    <head>
        [@templatejs scripts=['gato-lib/js/jquery-ui/jquery-ui.min.js', 'gato-template-tsus2017/js/tsus.js', 'gato-template-txstate2015/js/dropdownsearch.js']/]
        <script src="https://cdnjs.cloudflare.com/ajax/libs/masonry/3.3.2/masonry.pkgd.min.js"></script>
        <link rel="stylesheet" type="text/css" href="${gf.resourcePath()}/gato-template-tsus2017/css/tsus-home.compiled.css"/>
        [@templatehead publisher="Texas State University System"/]
    </head>
    <body>

        [#include "includes/header.ftl"]

        <!-- slideshow -->
        <div class="tsus-slideshow eq-parent">
          
          [@cms.area name="tsus-slideshow" /]
        </div>
        <!-- progress bars -->

        [@cms.area name="progress-section" /]
        <div class="container">

            <!-- news -->
            <div class="grid">
                  <div class="grid__sizer"></div>
                  [@cms.area name="news-section" /]
            </div>

            <!-- institution logos -->
              <div class="tsus-institution-logos eq-parent">
                [@cms.area name="tsuslogos" /]
              </div>
        </div>


        [#include "includes/footer.ftl"]
        [@cssjsmodals /]
    </body>
</html>
