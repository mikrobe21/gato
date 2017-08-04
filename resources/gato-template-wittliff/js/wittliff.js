jQuery(document).ready(function($) {

  // Main Menu Hamburger Button
  var menucontainer = $('.main-menu');
  var menubtn = $('.main-menu >button');
  var menupanel = $('.main-menu .main-menu-panel');
  menubtn.click(function (e) {
    menucontainer.toggleClass('shown');
    menubtn.attr('aria-expanded', menucontainer.is('.shown'));
  })
  $('html').click( function (e) {
    if (!$.contains(menucontainer.get(0), e.target)) {
      menucontainer.removeClass('shown');
    }
  });
  // close the menu with the escape key
  $(document).keyup(function (e) {
    if (e.keyCode === 27 && menucontainer.hasClass('shown')) {
      e.preventDefault();
      menucontainer.removeClass('shown');
    }
  });

  // Main Menu expand/contract
  $('.simplemenu-expand').click(function (e) {
    var btn = $(this);
    var toplevel = btn.closest('li');
    toplevel.toggleClass('expanded');
    btn.attr('aria-expanded', toplevel.hasClass('expanded'));
  });


  // Stay Connected Button
  var smcontainer = $('.social-media');
  var smbtn = $('.social-media >button');
  var smpanel = $('.social-media .social-media-panel');
  var smtimeout;
  smbtn.click(function (e) {
    smcontainer.toggleClass('shown');
    smbtn.attr('aria-expanded', smcontainer.is('.shown'));
  })
  var smin = function() {
    clearTimeout(smtimeout);
    smtimeout = setTimeout(function() {
      smcontainer.addClass('shown');
      smbtn.attr('aria-expanded', true);
    }, 100);
  }
  var smout = function() {
    clearTimeout(smtimeout);
    smtimeout = setTimeout(function() {
      smcontainer.removeClass('shown');
      smbtn.attr('aria-expanded', false);
    }, 200);
  }
  smbtn.mouseover(smin);
  smpanel.mouseover(smin);
  smbtn.mouseout(smout);
  smpanel.mouseout(smout);
  $('html').click( function (e) {
    if (!$.contains(smcontainer.get(0), e.target)) {
      smcontainer.removeClass('shown');
    }
  });

  // Make sure page is tall enough to accomodate the sidebar height
  // .contentcolumn is position relative and its top should be lined up with sidebar
  // so we'll use a min-height to push down the page as needed
  var sbc = $('.sidebar-container');
  var contentcol = $('.contentcolumn');
  var sidebarheightfix = function () {
    var sbc = $('.sidebar-container');
    if (sbc.size() > 0) {
      contentcol.css('min-height', sbc.outerHeight());
    }
  }
  resizeTimeout(sidebarheightfix);
});
