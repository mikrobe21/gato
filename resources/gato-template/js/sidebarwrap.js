jQuery(document).ready(function ($) {
  var sidebar = $('.sidebar-container .sidebar');
  var pagecontent = $('.contentcolumn');

  if (sidebar.size() > 0) {
    var expandsectionsaftersidebar = function () {
      // find the first gato-component paragraph whose top is
      // below the sidebar and expand it to full width
      $('.gato-section').each(function (i, cmp) {
        cmp = $(cmp);
        if (cmp.offset().top > sidebar.offset().top+sidebar.outerHeight()) {
          cmp.closest('.gato-section-full').addClass('full-width');
        }
      });
    };

    resizeTimeout(expandsectionsaftersidebar);
    waitforselector('.navBlocks_add', '.mgnlEditor.mgnlPlaceholder', expandsectionsaftersidebar);
  }
});
