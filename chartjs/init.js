function initjs(){
	$('input.deletable').wrap('<span class="deleteicon" />').after($('<span/>').click(function() {
		 		 	resetbgkeyword();
		 		 	$("#tampilkeyword").animate({ top: "-50px"});
		 		 	$("#tampilkeyword").attr("title","");
                    $(this).prev('input').val('').focus();
                }));
	
		  
		  //$('#buton').popover({trigger: 'hover',
		  //		      placement: 'bottom',
		  //	      delay: {show: 2500, hide: 500}});

		  
		  
 		  var negopen = true,posopen = true,nonopen = true;
 		  $("#toggleNegatif").click(function(){
 		  	toggleLine("negatif");
 		  	if(tog[0].view){
	 		  	$(tog[0].eye).attr("class","icon-eye-close");
	 		  	tog[0].view = false; 
	 		  	}else{
	 		  	$(tog[0].eye).attr("class","icon-eye-open");
	 		  	tog[0].view = true;  	
 		  	}
 		  	isAlone();		  	
 		  });
 		   $("#togglePositif").click(function(){
 		  	toggleLine("positif");
 		  	if(tog[1].view){
	 		  	$(tog[1].eye).attr("class","icon-eye-close");
	 		  	tog[1].view = false; 
	 		  	}else{
	 		  	$(tog[1].eye).attr("class","icon-eye-open");
	 		  	tog[1].view = true;
 		  	}
 		  	isAlone();  	
 		  });
 		   $("#toggleNonopini").click(function(){
 		  	toggleLine("nonopini");
	 		if(tog[2].view){
	 		  	$(tog[2].eye).attr("class","icon-eye-close");
	 		  	tog[2].view = false; 
	 		  	}else{
	 		  	$(tog[2].eye).attr("class","icon-eye-open");
	 		  	tog[2].view = true;
	 		  }
	 		  isAlone();  	
 		  });
 		  
 		  function isAlone(){
 		  	var countrue=0;
 		  	var alone=0;
 		  	for (i=0; i < tog.length; i++){
 		  		if(tog[i].view == true){
 		  			countrue++;
 		  		}
 		  	}
 		  	if(countrue == 1){
 		  		for (i=0; i < tog.length; i++){
 		  			if(tog[i].view == true){
 		  			$(tog[i].id).attr("disabled","");
 		  			toggleMaxY(tog[i].orn);
 		  			}
 		  		}
 		  	}
 		  	if(countrue >1){
 		  		$("#viewcontrols button").removeAttr("disabled");
 		  		toggleMaxY("default");
 		  	}
 		  }
 		  
 		  $("#searchkeyword").keypress(function(k){
 		  	if(k.which == 13){
 		  		searchkeyword($("#searchkeyword").val());
 		  		$("#tampilkeyword").animate({ top: "0px"});
 		  		$("#tampilkeyword").attr("title",$("#searchkeyword").val());
 		  		return false;
 		  	}
 		  });
 		  
 		  $("#tampilkeyword").click(function(){
 		  	var key = $(this).attr("title");
 		  	if(key!=""){
 		  		resultkeyword(key);
 		  	}
 		  });
 		  
		  $("#zoombutton").click(function(){
		  	if(rectkeyword!=null){
		  	  $("#searchkeyword").val('');
		  	  $("#tampilkeyword").animate({ top: "-50px"});
		 	  $("#tampilkeyword").attr("title","");
		  	  resetbgkeyword("full");
		  	 }
		      $("#context").slideToggle(250,unzoom);
		     });

		  
		  $("#settingrentang").click(function(){
		  		$("#slider").hide();
		  		$("#rentangdatepicker").hide();
		  		$(".tampilsetting").slideToggle(250);
		  		if($("#ubahslider").attr("disabled")==null){
		  			$("#ubahslider").attr("disabled","");
		  		}else{
		  			$("#ubahslider").removeAttr("disabled");
		  		}
		  	
		  });
		 
		   
		  $("#ubahslider").click(function(){
		  		$(defaultrentang).slideToggle(250);
		     });
		     
		  $( "#calDate1" ).datepicker({
			minDate: new Date(date1),
			maxDate: new Date(date2),
			dateFormat: "yy-mm-dd",
			numberOfMonths: 2,
			onSelect: function( selectedDate ) {
				$( "#calDate2" ).datepicker( "option", "minDate", selectedDate );
				}
			});
		$( "#calDate2" ).datepicker({
			minDate: new Date(date1),
			maxDate: new Date(date2),
			dateFormat: "yy-mm-dd",
			numberOfMonths: 2,
			onSelect: function( selectedDate ) {
				$( "#calDate1" ).datepicker( "option", "maxDate", selectedDate );
				}
			});
		  
		  $("#fullkeyword").click(function(){
		  	topTweet(this);
		  });
		  
		
		



		  initbarchart();
		  initLineChart('perday',false);
		  //$("#controlers").draggable();
}
