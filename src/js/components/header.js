const header = $('.js-header');
const scrollLink = $('.js-scroll-link');
const section =  $('.js-section');
const burger =  $('.js-burger');
const body =  $('body');

$(window).scroll(function() {
  section.each(function() {
    const id = $(this).find('.js-title').attr('id');
    if ( $(window).scrollTop() >= $(this).find('.js-title').offset().top - header.outerHeight() - 10
      && ($(window).scrollTop() < $(this).find('.js-title').offset().top - header.outerHeight() + $(this).height()) ) {
      $(`.js-scroll-link[href="#${id}"]`).addClass('is-active');
    } else {
      $(`.js-scroll-link[href="#${id}"]`).removeClass('is-active');
    }
  });
  if ($('.js-main-page').length) {
    if ($(this).scrollTop() > 50) {
      header.addClass('is-fixed');
    } else {
      header.removeClass('is-fixed');
    }
  }
});

scrollLink.on('click', function(e) {
  e.preventDefault();
  // scrollLink.removeClass('is-active');
  // $(this).addClass('is-active');
  if (burger.hasClass('is-active')) {
    burger.removeClass('is-active');
    header.removeClass('menu-open');
    body.removeClass('is-overflow');
  }
  $('html, body').stop().animate({
    scrollTop: $( $(this).attr('href') ).offset().top - header.outerHeight()
  }, 600);
});

burger.on('click', function() {
  $(this).toggleClass('is-active');
  header.toggleClass('menu-open');
  body.toggleClass('is-overflow');
});



