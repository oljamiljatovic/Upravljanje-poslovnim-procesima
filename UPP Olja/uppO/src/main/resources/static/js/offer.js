$( document ).ready(function() {
	
	$.ajax({
        url: "/task/getTaskForCompany",
        type: 'GET',
        dataType: "json"
    }).done(function (data) {
    	 showMessage("find all task");
    	 
    	 var tableRef = document.getElementById("tableOfTasks");
    	 
    	 for (i = 0; i < data.length; i++) { 
    		 var newRow1 = tableRef.insertRow(i+1);
    		
    		 var newCell1 = newRow1.insertCell(0);
    		 var newText1 = document.createTextNode(data[i].name);
       	     newCell1.appendChild(newText1);
       	     
       	     var newCell2 = newRow1.insertCell(1);
       	     var input = document.createElement('input');
       	     input.setAttribute("type", "button");
       	     input.setAttribute("onClick", 'openTask('+data[i].id+',"'+data[i].name+'")');
       	     input.setAttribute("value", "Pregled");
       	     input.setAttribute("class", "btn btn-primary");
       	  
       	     newCell2.appendChild(input);
       	     
    	 }
    	  
    }).fail(function (jqXHR, textStatus, errorThrown) {
        showErrors(errorThrown)
    })

});

/*nakon popunjavanja ponude za zahtjev*/
$(document).on('click', '#sendOffer', function(e) {
	var offer = {}
	offer.idRequest = $("#idRequestFillOfferDiv").val();
	offer.price = $("#priceFillOfferDiv").val();
	offer.timeLimit= $("#timeLimitFillOfferDiv").val();
	
	var taskId = $("#idTaskFillOfferDiv").val();
	$.ajax({
		url: "/offer/addOfferToRequest/"+taskId,
		type: 'POST',
		data: JSON.stringify(offer),
        contentType: "application/json"
	}).done(function (data) {
		$("#fillOfferDiv").addClass("hiddenDiv");
		$("#rankLabel").removeClass("hiddenButton");
		$("#rankLabel").val("Rank is : "+data);
		//document.location.reload();
		
	}).fail(function (jqXHR, textStatus, errorThrown) {
		showErrors(errorThrown)
	})
});

$(document).on('click', '#confirmFinalOffer', function(e) {
	
	var task = {}
	task.id = $("#taskIdFinalDesicionDiv").val();
	task.name = $("#taskNameFinalDesicionDiv").val();
	
	$.ajax({
		url: "/offer/confirmFinalOffer",
		type: 'POST',
		data: JSON.stringify(task),
        contentType: "application/json"
	}).done(function (data) {
		
		/*var parent = document.getElementById("jobCategoryID");
		for(var i = 0; i < data.length; i++) {
		    var opt = document.createElement('option');
		    opt.innerHTML = data[i].name;
		    opt.value = data[i].id;
		    parent.appendChild(opt);
		}
		
		$("#fillOfferDiv").addClass("hiddenDiv");
		//$("#finalDecisionDiv").removeClass("hiddenDiv");
		$("#rankLabel").val("Rank is : "+data);*/
		
	}).fail(function (jqXHR, textStatus, errorThrown) {
		showErrors(errorThrown)
	})
});

$(document).on('click', '#returnToCorrection', function(e) {
	var task = {}
	task.id = $("#taskIdFinalDesicionDiv").val();
	task.name = $("#taskNameFinalDesicionDiv").val();
	
	$.ajax({
		url: "/offer/returnToCorrection",
		type: 'POST',
		data: JSON.stringify(task),
        contentType: "application/json"
	}).done(function (data) {
	
		/*var parent = document.getElementById("jobCategoryID");
		for(var i = 0; i < data.length; i++) {
		    var opt = document.createElement('option');
		    opt.innerHTML = data[i].name;
		    opt.value = data[i].id;
		    parent.appendChild(opt);
		}
		
		$("#fillOfferDiv").addClass("hiddenDiv");
		//$("#finalDecisionDiv").removeClass("hiddenDiv");
		$("#rankLabel").val("Rank is : "+data);*/
		
	}).fail(function (jqXHR, textStatus, errorThrown) {
		showErrors(errorThrown)
	})
});

$(document).on('click', '#confirmExplanation', function(e) {
	taskOffer = {}
	taskOffer.taskId =  $("#taskIdFillRequiremenDiv").val();
	taskOffer.offerId = $("#offerIdFillRequirement").val();
	taskOffer.text = $("#textAreaResponse").val(); 

	$.ajax({
		url: "/task/confirmExplanation",
		type: 'POST',
		data: JSON.stringify(taskOffer),
        contentType: "application/json"
	}).done(function (data) {
	document.location.reload();
	}).fail(function (jqXHR, textStatus, errorThrown) {
		showErrors(errorThrown)
	})
});


$(document).on('click', '#sendTimeStart', function(e) {
	taskDate = {}
	taskDate.id =  $("#taskIdDeterminationTimeStart").val();
	taskDate.name = $("#taskNameDeterminationTimeStart").val();
	taskDate.date = $("#dateDeterminationTimeStart").val(); 

	$.ajax({
		url: "/task/determinationTimeStart",
		type: 'POST',
		data: JSON.stringify(taskDate),
        contentType: "application/json"
	}).done(function () {
		document.location.reload();
	}).fail(function (jqXHR, textStatus, errorThrown) {
		showErrors(errorThrown)
	})
});

$(document).on('click', '#confirmEndExecution', function(e) {
	task = {}
	task.id =  $("#taskIdEndExecutionDiv").val();
	task.name = $("#taskNameEndExecutionDiv").val();


	$.ajax({
		url: "/task/confirmEndExecution",
		type: 'POST',
		data: JSON.stringify(task),
        contentType: "application/json"
	}).done(function () {
		document.location.reload();
	}).fail(function (jqXHR, textStatus, errorThrown) {
		showErrors(errorThrown)
	})
});

$(document).on('click', '#rateClient', function(e) {
	task = {}
	task.id =  $("#taskIdRatingClient").val();
	task.name = $("#taskNameRatingClient").val();

	var ocjena = $('input[name=gender]:checked').val();
	
	$.ajax({
		url: "/task/confirmEndExecution",
		type: 'POST',
		data: JSON.stringify(task),
        contentType: "application/json"
	}).done(function () {
		document.location.reload();
	}).fail(function (jqXHR, textStatus, errorThrown) {
		showErrors(errorThrown)
	})
});
///////////////////////////////////////////functions
function showErrors(errors) {
    toastr.error(errors, "Errors");
}

function showMessage(message) {
    toastr.success(message, "Succesfull");
}

function openTask(id,name) {
    if(name == "Popunjavanje ponude"){
    	$("#requestFromTaskDiv").removeClass("hiddenDiv");	
    	fillRequestFormTask(id);
    	/*$("#chooseDiv").removeClass("hiddenDiv");	
    	$("#taskIdChooseDiv").val(id);
    	$("#taskNameChooseDiv").val(name);*/
    }else if(name == "Odlucivanje o konacnosti ponude"){
    	$("#finalDecisionDiv").removeClass("hiddenDiv");
    	//$("#finalDecisionDiv").removeClass("hiddenDiv");
    	$("#taskIdFinalDesicionDiv").val(id);
    	$("#taskNameFinalDesicionDiv").val(name);
    
    }else if(name == "Popunjavanje zahtjeva"){
    	$("#fillRequirementDiv").removeClass("hiddenDiv");
    	$("#taskIdFillRequiremenDiv").val(id);
    	task = {}
    	task.id = id;
    	task.name = name;
    	$.ajax({
            url: "/task/getRequestFromTask",
            type: 'POST',
            data: JSON.stringify(task),
            contentType: "application/json",
            dataType :"json",
        }).done(function(data) {
        	$("#textAreaRequest").val(data.text);
        	$("#requestIdFillRequirement").val(data.request.id);
        	$("#offerIdFillRequirement").val(data.offer.id);
        	$("#userNameFillRequirement").val(data.request.user.name);
    
        }).fail(function (jqXHR, textStatus, errorThrown) {
            showErrors(errorThrown)
        })
    }else if(name == "Utvrdjivanje termina pocetka"){
    	$("#determinationTimeStartDiv").removeClass("hiddenDiv");
    	$("#taskIdDeterminationTimeStart").val(id);
    	$("#taskNameDeterminationTimeStart").val(name);
    }else if(name == "Potvrda o izvrsenju posla"){
    	$("#endExecutionDiv").removeClass("hiddenDiv");
    	$("#taskIdEndExecutionDiv").val(id);
    	$("#taskNameEndExecutionDiv").val(name);
    }else if(name == "Ocjenjivanje klijenta"){
    	$("#ratingClientDiv").removeClass("hiddenDiv");
    	$("#taskIdRatingClient").val(id);
    	$("#taskNameRatingClient").val(name);
    }
    
}

function fillRequestFormTask(id){
		$.ajax({
	        url: "/task/getRequestFromTask/"+id,
	        type: 'GET',
	        dataType: "json"
	    }).done(function (data) {
	    	 showMessage("find all task");
	    	 
	    	 var tableRef = document.getElementById("requestFromTaskTable");
	    	 
	    	 
	    		 var newRow1 = tableRef.insertRow(1);
	    		
	    		 var newCell1 = newRow1.insertCell(0);
	    		 var newText1 = document.createTextNode(data.jobCategory.name);
	       	     newCell1.appendChild(newText1);
	       	     
	       	     var newCell2 = newRow1.insertCell(1);
	    		 var newText2 = document.createTextNode(data.description);
	       	     newCell2.appendChild(newText2);
	       	     
	       	     var newCell3 = newRow1.insertCell(2);
	    		 var newText3 = document.createTextNode(data.maxValuation);
	       	     newCell3.appendChild(newText3);
	       	     
	       	     var newCell4 = newRow1.insertCell(3);
	    		 var newText4 = document.createTextNode(data.timeLimitForCarryOut);
	       	     newCell4.appendChild(newText4);
	       	     
	       	     var newCell5 = newRow1.insertCell(4);
	       	     var input = document.createElement('input');
	       	     input.setAttribute("type", "button");
	       	     input.setAttribute("onClick", 'fillOfferDiv('+data.id+',"'+id+'")');
	       	     input.setAttribute("value", "Fill offer");
	       	     input.setAttribute("class", "btn btn-primary");
	       	     newCell5.appendChild(input);
	       	     
	       	  
	       	     
	       	     var newCell6 = newRow1.insertCell(5);
	       	     var input3 = document.createElement('input');
	       	     input3.setAttribute("type", "button");
	       	     input3.setAttribute("onClick", 'giveUp('+data.id+',"'+id+'")');
	       	     input3.setAttribute("value", "Give up");
	       	     input3.setAttribute("class", "btn btn-primary");
	       	     newCell6.appendChild(input3);
	    	  
	    }).fail(function (jqXHR, textStatus, errorThrown) {
	        showErrors(errorThrown)
	    })
}

function fillOfferDiv(idRequest, idTask){
	
	$("#fillOfferDiv").removeClass("hiddenDiv");	
	$("#idRequestFillOfferDiv").val(idRequest);
	$("#idTaskFillOfferDiv").val(idTask);
	
	
}
function giveUp(idRequest, idTask){
	alert("give up");
	//$("#fillOfferDiv").removeClass("hiddenDiv");	
	
	$.ajax({
        url: "/task/giveUpOffer/"+idTask,
        type: 'GET'
    }).done(function() {
    	document.location.reload();

    }).fail(function (jqXHR, textStatus, errorThrown) {
        showErrors(errorThrown)
    })
	
}
