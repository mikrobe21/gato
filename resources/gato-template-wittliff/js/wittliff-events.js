jQuery(document).ready(function($) {
  /** Expand/Collaps details **/
  $('.event-details').click(function(e){
    e.preventDefault();
    window.accordion.toggle($(this));
  });
  // if the url contains an anchor to an event, let's open that event
  if (document.location.hash.match(/^#event-\d+$/i)) {
    window.accordion.show($(document.location.hash).find('.event-details'));
  }

  /** Filtering **/
  var hide_event = function($evt) {
    animationframe(function() {
      $evt.hide();
      $evt.attr('aria-hidden', true);
    });
  }
  var show_event = function($evt) {
    animationframe(function() {
      $evt.show();
      $evt.attr('aria-hidden', false);
    });
  }

  var evaluate = function() {
    $catslct = $('.wittliff-event-filters select[name="category"]');
    $monthslct = $('.wittliff-event-filters select[name="month"]');
    $('.wittliff-event-list .event').each( function () {
      var $evt = $(this);
      var filtered = false;

      var specialcats = ['Music','Photography','Literary'];
      if (!isBlank($catslct.val())) {
        if ($catslct.val() == "Other") {
          if ($($evt.data('categories')).filter(specialcats).length > 0) filtered = true;
        } else {
          if (!$evt.data('categories').includes($catslct.val())) filtered = true;
        }
      }
      if (!isBlank($monthslct.val()) && $evt.data('month-key') != $monthslct.val()) filtered = true;

      if (filtered) hide_event($evt);
      else show_event($evt);
    });
    if ($('.wittliff-event-list .event:visible').length == 0) {
      $('.wittliff-event-list .events-empty').show();
    } else {
      $('.wittliff-event-list .events-empty').hide();
    }
  }

  $('.wittliff-event-filters select').change(function (e) {
    evaluate();
  });

});
