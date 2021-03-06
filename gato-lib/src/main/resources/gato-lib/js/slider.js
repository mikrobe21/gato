(function ($) {
  var $window = $(window);
  window.GatoSlider = function (opts) {
    var slider = this;
    opts = opts || {};
    slider.current = opts.current || 0;
    slider.container = opts.container instanceof jQuery ? opts.container : $(opts.container);
    if (slider.container.length > 1) {
      console.log('GatoSlider container should contain exactly one element, multiple sliders should be given separate GatoSlider instances. Only the first slider on the page will be functional.');
      slider.container = slider.container.eq(0);
    }
    slider.slides = opts.slides instanceof jQuery ? opts.slides : slider.container.find(opts.slides);
    slider.leftarrow = opts.leftarrow instanceof jQuery ? opts.leftarrow : slider.container.find(opts.leftarrow);
    slider.rightarrow = opts.rightarrow instanceof jQuery ? opts.rightarrow : slider.container.find(opts.rightarrow);
    resizeTimeout(function () {
      slider.verticaldragthreshold = 0.2*slider.container.outerHeight();
      slider.horizontaldragthreshold = 0.2*slider.container.outerWidth();
    });
    var get_single_touch = function(e) {
      var oe = e.originalEvent;
      if (oe.touches && oe.touches.length == 1) return oe.touches[0];
      if (e.pageX) return e;
      return undefined;
    };
    slider.container.on('touchstart mousedown', function (e) {
      var t = get_single_touch(e);
      slider.tracking = typeof(t) != 'undefined' && slider.slides.length > 1;
      if (!slider.tracking) return;
      slider.pauseschedule();
      slider.touchX = t.pageX;
      slider.touchY = t.pageY - $window.scrollTop();
      if (e.type == 'mousedown') e.preventDefault();
    });
    slider.container.on('touchmove mousemove', function (e) {
      if (!slider.tracking) return;
      var t = get_single_touch(e);
      if (typeof(t) == 'undefined') return;
      slider.xdiff = t.pageX - slider.touchX;
      slider.ydiff = t.pageY - $window.scrollTop() - slider.touchY;
      if (Math.abs(slider.ydiff) > slider.verticaldragthreshold) {
        slider.tracking = false;
        slider.dragging = false;
        if (Math.abs(slider.xdiff) > slider.horizontaldragthreshold) slider.finishdrag(slider.xdiff)
        else slider.reset();
      } else if (slider.dragging || (Math.abs(slider.xdiff) > Math.abs(slider.ydiff) && Math.abs(slider.xdiff) > 10)) {
        slider.dragging = true;
        slider.drag(slider.xdiff);
        e.preventDefault();
      }
    });
    $window.on('touchend mouseup', function (e) {
      if (!slider.tracking) return;
      if (slider.dragging) {
        slider.stopclick = e.type == 'mouseup';
        e.preventDefault();
        if (Math.abs(slider.xdiff) < slider.horizontaldragthreshold) slider.reset();
        else slider.finishdrag(slider.xdiff);
      }
      slider.tracking = false;
      slider.dragging = false;
    });
    $window.blur(function (e) { slider.pauseschedule(); });
    $window.focus(function (e) { slider.schedule(); });
    slider.container.click(function(e) { if (slider.stopclick) e.preventDefault(); slider.stopclick = false; });
    slider.leftarrow.click(function(e) { e.preventDefault(); slider.left(); });
    slider.rightarrow.click(function(e) { e.preventDefault(); slider.right(); });
    slider.reset();
    slider.container.find('img[data-src]').each(function () {
      var img = $(this);
      $window.load(function () {
        img.attr('src', img.data('src')).removeAttr('data-src');
        img.attr('srcset', img.data('srcset')).removeAttr('data-srcset');
      });
    });
    slider.rotationtime = opts.rotationtime*1000 || 0;
    slider.rotationminimum = opts.rotationminimum*1000 || 0;
    slider.schedule();
  }
  window.GatoSlider.prototype.cleanindex = function (index) {
    var size = this.slides.length;
    if (index < 0) return index % size == 0 ? 0 : size + index % size;
    return index % size;
  }
  window.GatoSlider.prototype.nextidx = function (direction) {
    return this.cleanindex(direction < 0 ? this.current - 1 : this.current + 1);
  }
  window.GatoSlider.prototype.next = function (direction) {
    return this.slides.eq(this.nextidx(direction));
  }
  window.GatoSlider.prototype.left = function (speed) { this.activate(this.current-1, speed); }
  window.GatoSlider.prototype.right = function (speed) { this.activate(this.current+1, speed); }
  window.GatoSlider.prototype.activate = function(index, speed) {
    var slider = this;
    speed = speed || 150;

    // figure this out before wrapping so that we still slide from the correct direction
    var slidefromright = index > slider.current;

    index = slider.cleanindex(index);
    if (index == slider.current) return;
    var curr = slider.slides.eq(slider.current);
    var next = slider.slides.eq(index);
    slider.synchronizestate();
    if (slidefromright) { // sliding from the right
      next.velocity({translateX: ['0%','100%']}, {duration: speed});
      curr.velocity({translateX: ['-100%','0%']}, {duration: speed});
    } else { // sliding from the left
      next.velocity({translateX: ['0%','-100%']}, {duration: speed});
      curr.velocity({translateX: ['100%','0%']}, {duration: speed});
    }
    slider.current = index;
    slider.schedule();
  }
  window.GatoSlider.prototype.schedule = function () {
    var slider = this;
    if (slider.slides.length > 1 && slider.rotationtime > 0 && !window.isEditMode) {
      var delay = slider.rotationtime;
      if (slider.rotationminimum) delay = Math.floor(Math.random() * (slider.rotationtime - slider.rotationminimum) + slider.rotationminimum);
      clearTimeout(slider.rotationtimer);
      slider.rotationtimer = setTimeout(function () { slider.right(300); }, delay);
    }
  }
  window.GatoSlider.prototype.pauseschedule = function () {
    var slider = this;
    clearTimeout(slider.rotationtimer);
  }
  window.GatoSlider.prototype.synchronizestate = function () {
    var slider = this;
    slider.slides.velocity('stop');
    var curr = slider.slides.eq(slider.current);
    animationframe(function () {
      curr.css('transform', 'translateX(0)');
      slider.slides.not(':eq('+slider.current+')').css('transform', 'translateX(-100%)');
    });
  }
  window.GatoSlider.prototype.drag = function(xdiff) {
    var slider = this;
    var curr = slider.slides.eq(slider.current);
    var next = slider.next(xdiff);

    cancelanimationframe(slider.dragtimer);
    slider.dragtimer = animationframe(function () {
      curr.css('transform', 'translateX('+xdiff+'px)');
      next.css('transform', 'translateX('+((xdiff < 0 ? 1 : -1)*next.outerWidth() + xdiff)+'px)');
    });
  }
  window.GatoSlider.prototype.finishdrag = function (xdiff) {
    var slider = this;
    cancelanimationframe(slider.dragtimer);
    var curr = slider.slides.eq(slider.current);
    var next = slider.next(xdiff);
    next.velocity({translateX: [0, ((xdiff < 0 ? 1 : -1)*next.outerWidth() + xdiff)+'px']}, {duration: 150});
    curr.velocity({translateX: [(xdiff < 0 ? -1 : 1)*next.outerWidth()+'px', xdiff+'px']}, {duration: 150});
    slider.current = slider.nextidx(xdiff);
    slider.schedule();
  }
  window.GatoSlider.prototype.reset = function () {
    var slider = this;
    cancelanimationframe(slider.dragtimer);
    slider.synchronizestate();
    slider.schedule();
  }
})(jQuery);
