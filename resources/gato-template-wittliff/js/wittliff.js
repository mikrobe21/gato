jQuery(document).ready(function($) {
  // Editing environment text changes
  magnolialabelchange('.menu-social-media', '.mgnlEditor.mgnlPlaceholder', 'Add Social Media');
  magnolialabelchange('.menu-newsletter-button', '.mgnlEditor.mgnlPlaceholder', 'Add Newsletter Button');
  magnolialabelchange('.menu-donate-button', '.mgnlEditor.mgnlPlaceholder', 'Add Donate Button');
  magnolialabelchange('.calltoaction-column', '.mgnlEditor.mgnlPlaceholder', 'Add Button');
  magnolialabelchange('.addHeroBanner', '.mgnlEditor.mgnlPlaceholder', 'Add Hero-Banner');
  magnolialabelchange('.addHeroSlider', '.mgnlEditor.mgnlPlaceholder', 'Add Hero Image or Video');
  magnolialabelchange('.footer-column-content', '.mgnlEditor.mgnlPlaceholder', 'Add Column');
  magnolialabelchange('.footer-button', '.mgnlEditor.mgnlPlaceholder', 'Add Button');

  // Set this variable for the anchor scroll fix
  window.stickynavheight = $('header').height();

  // Wittliff Reverse buttons have extra hover effect that confuses ios
  $('a.button.reverse, a.linkbutton').on('touchend', function () { console.log($(this)); window.location = $(this).attr('href'); });

  // Give header a new CSS class when the page is scrolled so we can turn it opaque
  var header = $('.page-header');
  $(window).scroll(function() {
    if (header.offset().top > 0) header.addClass('scrolled');
    else header.removeClass('scrolled');
  });

  // Main Menu Hamburger Button
  var menucontainer = $('.main-menu');
  var menubtn = $('.main-menu >button');
  var menupanel = $('.main-menu .main-menu-panel');
  var menuhide = function () {
    header.removeClass('menu-out');
    menubtn.attr('aria-expanded', false);
    menupanel.velocity('slideUp', { duration: 150 });
  }
  var menushow = function() {
    header.addClass('menu-out');
    menubtn.attr('aria-expanded', true);
    menupanel.velocity('slideDown', { duration: 150 });
  }
  menubtn.click(function (e) {
    if (header.hasClass('menu-out')) menuhide();
    else menushow();
  })
  $('html').click( function (e) {
    if (!$.contains(menucontainer.get(0), e.target)) {
      menuhide();
    }
  });
  // close the menu with the escape key
  $(document).keyup(function (e) {
    if (e.keyCode === 27 && header.hasClass('menu-out')) {
      e.preventDefault();
      menuhide();
    }
  });

  // Main Menu expand/contract
  $('.simplemenu-expand').click(function (e) {
    var btn = $(this);
    var toplevel = btn.closest('li');
    var panel = toplevel.find('.simplemenu-subitems');
    toplevel.toggleClass('expanded');
    btn.attr('aria-expanded', toplevel.hasClass('expanded'));
    panel.velocity(toplevel.hasClass('expanded') ? 'slideDown' : 'slideUp', { duration: 150 });
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
  var smcancel = function() {
    if (smcontainer.hasClass('shown')) {
      clearTimeout(smtimeout);
    }
  }
  smbtn.mouseover(smin);
  smpanel.mouseover(smin);
  header.mouseover(smcancel);
  header.mouseout(smout);
  smpanel.mouseout(smout);
  $('html').click( function (e) {
    if (!$.contains(smcontainer.get(0), e.target)) {
      smcontainer.removeClass('shown');
      smbtn.attr('aria-expanded', false);
    }
  });

  $('.eventslider').each(function() {
    new GatoSlider({
      container: $(this),
      rotationminimum: 7,
      rotationtime: 10,
      slides: '.eventslider-slide',
      leftarrow: '.arrow.left',
      rightarrow: '.arrow.right'
    });
  });

  var acceptable = function ($itm) {
    var currentheight = $itm.find('.eventslider-panelcontent').outerHeight();
    var targetheight = $itm.height();
    return currentheight <= targetheight;
  }
  $('.eventslider-panel').each(function (idx,itm) {
    GatoAntiThrasherSingleton.register(new GatoFontAdjuster($(itm), acceptable));
  });

  // Hero Slider
  $('.gato-heroslider').each(function (idx, itm) {
    var slider = $(itm);
    var slides = slider.find('.slide');
    var active = 0;
    var setactive = function (slideidx, backwards) {
      var currslide = slides.eq(active);
      var nextslide = slides.eq(slideidx);
      if (currslide.is(nextslide)) return;
      currslide.velocity('stop');
      nextslide.velocity('stop');
      if (backwards) {
        currslide.velocity({ left: ['100%', '0%'] }, {duration: 500});
        nextslide.velocity({ left: ['0%', '-100%'] }, {duration: 500});
      } else {
        currslide.velocity({ left: ['-100%', '0%'] }, {duration: 500});
        nextslide.velocity({ left: ['0%', '100%'] }, {duration: 500});
      }
      active = slideidx;
      startinterval();
    };
    var advance = function () {
      setactive((active+1) % slides.length);
    }
    var goback = function () {
      if (active == 0) setactive(slides.length-1, true);
      else setactive(active-1, true);
    }
    var timer = 0;
    if (slider.is('.slow')) timer = 30;
    else if (slider.is('.medium')) timer = 20;
    else if (slider.is('.fast')) timer = 10;
    var interval;
    var startinterval = function () {
      clearInterval(interval);
      if (timer > 0) {
        interval = setInterval(advance, timer*1000);
      }
    }
    startinterval();

    slider.find('.back').click(function (e) {
      e.preventDefault();
      goback();
    });
    slider.find('.forward').click(function (e) {
      e.preventDefault();
      advance();
    });

  });
  $('.gato-heroslider .slide:not(:first-child)').each(function (idx, itm) {
    var slide = $(itm);
    var img = slide.find('img');
    img.attr('src', slide.data('src')).attr('srcset', slide.data('srcset'));
  });

  var checkimageratios = function () {
    $('.tall, .wide').each(function (idx, itm) {
      var $itm = $(itm);
      var $img = $itm.find('img');
      var container_ar = (1.0*$itm.outerWidth()) / $itm.outerHeight();
      var image_ar = (1.0*$img.attr('width')) / $img.attr('height');
      if (!isNaN(container_ar) && !isNaN(image_ar)) {
        animationframe(function () {
          if (image_ar > container_ar) $itm.removeClass('tall').addClass('wide');
          else $itm.removeClass('wide').addClass('tall');
        });
      }
    });
  }
  resizeTimeout(checkimageratios);

  // Make sure the footer is at the bottom of the window when the
  // page is shorter than one window
  var win = $(window);
  var header = $('.page-header');
  var footer = $('.page-footer');
  var herobanner = $('.gato-heroslider, .gato-herobanner');
  var pagecontent = $('.page_content');
  var pagecontentheightfix = function () {
    pagecontent.css('min-height', win.height() - header.outerHeight(true) - herobanner.outerHeight(true) - footer.outerHeight(true) - pagecontent.outerHeight(true) + pagecontent.outerHeight() - 1);
  }
  resizeTimeout(pagecontentheightfix);
  waitforselector('.navBlocks_add', '.mgnlEditor.mgnlPlaceholder', pagecontentheightfix);

});
