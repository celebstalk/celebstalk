$(document).ready(function(){
    $("h1").mouseenter(function(){
       $('h1').addClass('animated zoomIn');
    });
     $("h1").mouseleave(function(){
       $('h1').removeClass('animated zoomIn');
    });
});