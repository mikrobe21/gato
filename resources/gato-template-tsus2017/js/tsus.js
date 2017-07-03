jQuery(document).ready(function($) {

    //toggle menu
    $(".btn-menu").click(function(e){
        e.preventDefault();
        $('.main-menu').slideToggle(300);
        $('.btn-menu').toggleClass('menu-open');
    });


    function setWidth($logoVar,$column){
      var $logoWidth;//in order to force column count
      $logoWidth=100.0/$column;//100% divided by column count.
      $logoVar.css("width",$logoWidth+"%");
      console.log('columns:'+$column);// for testing
      console.log('width of columns:'+$logoWidth);// for testing
    }
    function setColumn($divider,$tCount){
      var $column;
      var $optimize = $tCount/$divider;// what we will flip by if needed
      if(($optimize)>4)//max of 4 columns if more than 4 divide again
      {
        $column=($tCount/$divider)/$divider;
        if($column<2)
        {
          console.log("optimizing grid structure.....");
          $column=($tCount/$optimize);

        }
      }
      else{
          $column=$tCount/$divider;
      }
      console.log("2nd func is working")
      return $column;
    }
    function setGrid($logoVar,$tCount){
      var $gridSet=false;
      var $column;
      if($tCount%2==0){
          $column = setColumn(2,$tCount);
          setWidth($logoVar,$column);
          $gridSet=true;
          return $gridSet;
      }
      else if ($tCount%3==0) {
        $column = setColumn(3,$tCount);
        setWidth($logoVar,$column);
        $gridSet=true;
        return $gridSet;
      }
    }

    resizeTimeout(function(){
        var $logoVar=$('.tsus-institution-logos li');
        var $tCount=$logoVar.length;
        var $gridSet = false;
      	if ($(window).width() <= 768){
            $gridSet=setGrid($logoVar,$tCount);
          if(!$gridSet)// meaning its prime
            {
              console.log('prime detected!....resolving');
              $tCount=$tCount + 1;// add 1 then call again.
              $gridSet=setGrid($logoVar,$tCount);

            }
      	}
        else{
            $logoVar.css("width","auto");
        }
      });

      /*Logic to switch between different background color on progress section*/
      if($(".performance").hasClass("alternating")){
        var class_index=1;
        setInterval(function(){
          if(class_index===8){
            class_index=1;
          }
          var $element=$(".performance").attr('class').split(' ')[1];
          var addClass='color'+class_index;
          $( ".performance" ).removeClass($element).addClass(addClass);
          class_index++;
        },5000);
      }
////////masonry layout settings
  // Masonry grid setup
  var grid = $(".grid").masonry({
    itemSelector: ".gato-card",
    columnWidth: ".grid__sizer",
    gutter: 25,
    percentPosition: true
  });
//to add img-box class so we can target it
  $('.grid').find('figure').addClass('img-box');

  $(".img-box > img").each(function(index) {
      console.log("test pass");
      var $img = new Image();
      $img.src=$(this).attr('src');
      var width = $img.width;
      if (width > 1000) {
        $(this).closest(".gato-card").addClass("gato-card-lg").addClass("gato-card-height-lg");
      }
      else if (width >= 400) {
        $(this).closest(".gato-card").addClass("gato-card-md").addClass("gato-card-height-lg");
      }
      else {
        $(this).closest(".gato-card").addClass("gato-card-sm").addClass("gato-card-height-sm");
      }
      grid.masonry()
  });

  //if the image is large turn it to a background for easier cropping.
   $(".img-box").each(function() {
      $(this)
        .css("background-image", "url(" + $(this).find("> img").attr("src") + ")")
        .find("> img")
        .hide();


    });




});