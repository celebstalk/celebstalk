$(document).ready(function(){
    $("h1").mouseenter(function(){
       $('h1').addClass('animated zoomIn');
    });
     $("h1").mouseleave(function(){
       $('h1').removeClass('animated zoomIn');
    });
      $("button").mouseenter(function(){
       $('button').addClass('animated tada ');
    });
     $("button").mouseleave(function(){
       $('button').removeClass('animated tada infinite');
    });
     $("header").mouseleave(function(){
      $('iframe').addClass('animated slideInUp ');
     });
});