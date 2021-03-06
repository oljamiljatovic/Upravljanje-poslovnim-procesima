$( document ).ready(function() {
	
	$.ajax({
        url: "/task/getTaskForUser",
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


/*otvaranje forme za dodavanje request-a*/
$(document).on('click', '#fillRequest', function(e) {
	$("#requestDiv").removeClass("hiddenDiv");
	
	$.ajax({
		url: "/jobCategory",
		type: 'GET',
		dataType: "json"
	}).done(function (data) {
		var parent = document.getElementById("jobCategoryID");
		for(var i = 0; i < data.length; i++) {
		    var opt = document.createElement('option');
		    opt.innerHTML = data[i].name;
		    opt.value = data[i].id;
		    parent.appendChild(opt);
		}
		showMessage("find all");  
	}).fail(function (jqXHR, textStatus, errorThrown) {
		showErrors(errorThrown)
	})
});

/*nakon popunjavanja zahtjeva*/
$(document).on('click', '#sendRequest', function(e) {
	
  	dataToAdd = {}
	dataToAdd.jobCategoryIDProp = $("#jobCategoryID").val();
	dataToAdd.descriptionProp =  $("#description").val();
	dataToAdd.maxValuationProp = $("#maxValuation").val();
	dataToAdd.timeLimitForOffersProp = $("#timeLimitForOffers").val();
	dataToAdd.maxNumberOffersProp =  $("#maxNumberOffers").val();
	dataToAdd.timeLimitForCarryOutProp =  $("#timeLimitForCarryOut").val();

	$.ajax({
        url: "/requestForFavour",
        type: 'POST',
        data: JSON.stringify(dataToAdd),
        contentType: "application/json"
    }).done(function (data) {
    	
    	$("#requestID").val(data); // OVJDE CU U HIDDEN POLJE UBACITI ID
    	showMessage("Poslat zahtjev"); 
    	$("#requestDiv").addClass("hiddenDiv");
    	document.location.reload();
    }).fail(function (jqXHR, textStatus, errorThrown) {
        showErrors(errorThrown)
    })

});


$(document).on('click', '#confirmNotEnoughCompanies', function(e) {
	var id = $("#requestID").val();
	var task = {}
	task.id = $("#taskIdChooseDiv").val();
	task.name = $("#taskNameChooseDiv").val();
	$.ajax({
        url: "/requestForFavour/confirmNotEnoughCompanies",
        type: 'POST',
        data: JSON.stringify(task),
        contentType: "application/json"
    }).done(function () {
    	showMessage("Poslat zahtjev"); 
    	$("#requestDiv").addClass("hiddenDiv");
    	$("#chooseDiv").addClass("hiddenDiv");
    }).fail(function (jqXHR, textStatus, errorThrown) {
        showErrors(errorThrown)
    })

});


$(document).on('click', '#rejectNotEnoughCompanies', function(e) {
	var task = {}
	task.id = $("#taskIdChooseDiv").val();
	task.name = $("#taskNameChooseDiv").val();
  
	$.ajax({
        url: "/requestForFavour/rejectNotEnoughCompanies",
        type: 'GET',
        data: JSON.stringify(task),
        contentType: "application/json"
    }).done(function (data) {
    	showMessage("Poslat zahtjev"); 
    	$("#requestDiv").addClass("hiddenDiv");
    	$("#chooseDiv").addClass("hiddenDiv");
    }).fail(function (jqXHR, textStatus, errorThrown) {
        showErrors(errorThrown)
    })

});

$(document).on('click', '#decide', function(e) {
	var task = {}
	task.id = $("#taskIdDecideOrExtend").val();
	task.name = $("#taskNameDecideOrExtend").val();


	$.ajax({
        url: "/offer/chooseDecide",
        type: 'POST',
        data: JSON.stringify(task),
        contentType: "application/json"
    }).done(function (data) {
    	showMessage("cHOOSE DECIDE"); 
    	$("#decideOrExtendNotEnoughDiv").addClass("hiddenDiv");
    	document.location.reload();
    }).fail(function (jqXHR, textStatus, errorThrown) {
        showErrors(errorThrown)
    })

	

});
$(document).on('click', '#askForMore', function(e) {
	
	$("#decideOrExtendNotEnoughDiv").addClass("hiddenDiv");
	$("#dateNotEnoughDiv").removeClass("hiddenDiv");
	$("#taskIdDateNotEnough").val($("#taskIdDecideOrExtend").val());
	$("#taskNameDateNotEnough").val($("#taskNameDecideOrExtend").val());

});

$(document).on('click', '#sendDateNotEnough', function(e) {
	taskWithDate = {}
	taskWithDate.date = $("#dateNotEnough").val()
	taskWithDate.id = $("#taskIdDateNotEnough").val();
	taskWithDate.name = $("#taskNameDateNotEnough").val();
	
	$.ajax({
        url: "/offer/sendDateNotEnough",
        type: 'POST',
        data: JSON.stringify(taskWithDate),
        contentType: "application/json"
    }).done(function (data) {
    	showMessage("cHOOSE DECIDE"); 
    	$("#decideOrExtendNotEnoughDiv").addClass("hiddenDiv");
    	document.location.reload();
    }).fail(function (jqXHR, textStatus, errorThrown) {
        showErrors(errorThrown)
    })

});
//kada nema ni jedne ponude
$(document).on('click', '#cancel', function(e) {
	var task = {}
	task.id = $("#taskIdNoOffers").val();
	task.name = $("#taskNameNoOffers").val();


	$.ajax({
        url: "/offer/cancelNoOffers",
        type: 'POST',
        data: JSON.stringify(task),
        contentType: "application/json"
    }).done(function (data) {
    	showMessage("cHOOSE DECIDE"); 
    	$("#decideOrExtendNotEnoughDiv").addClass("hiddenDiv");
    	document.location.reload();
    }).fail(function (jqXHR, textStatus, errorThrown) {
        showErrors(errorThrown)
    })

	

});

$(document).on('click', '#askForMoreOffers', function(e) {
	
	$("#cancelOrExtendDiv").addClass("hiddenDiv");
	$("#dateNoOffersDiv").removeClass("hiddenDiv");
	$("#taskIdDateNoOffers").val($("#taskIdNoOffers").val());
	$("#taskNameDateNoOffers").val($("#taskNameNoOffers").val());

});

$(document).on('click', '#sendDateNoOffers', function(e) {
	taskWithDate = {}
	taskWithDate.date = $("#dateNoOffers").val()
	taskWithDate.id = $("#taskIdDateNoOffers").val();
	taskWithDate.name = $("#taskNameDateNoOffers").val();
	
	$.ajax({
        url: "/offer/sendDateNoOffers",
        type: 'POST',
        data: JSON.stringify(taskWithDate),
        contentType: "application/json"
    }).done(function (data) {
    	showMessage("cHOOSE DECIDE"); 
    	$("#decideOrExtendNoOffersDiv").addClass("hiddenDiv");
    	document.location.reload();
    }).fail(function (jqXHR, textStatus, errorThrown) {
        showErrors(errorThrown)
    })

});

/*metode za rang listu*/


$(document).on('click', '#cancelAllRangDiv', function(e) {
	task = {}
	task.id = $("#taskIdRangDiv").val();
	task.name = $("#taskNameRangDiv").val();
	
	$.ajax({
        url: "/task/cancelAllOffers",
        type: 'POST',
        data: JSON.stringify(task),
        contentType: "application/json"
    }).done(function() {
    	$("#rangListDiv").addClass("hiddenDiv");
    	document.location.reload();
    }).fail(function (jqXHR, textStatus, errorThrown) {
        showErrors(errorThrown)
    })

});

$(document).on('click', '#openDateForRepeatProcess', function(e) {
	//treba da se otvori dijalog za unosenje datuma
	//$("#dateRepeatProcessDiv").removeClass("hiddenDiv");
	task = {}
	task.id = $("#taskIdRangDiv").val();
	task.name = $("#taskNameRangDiv").val();
	$.ajax({
        url: "/task/chooseRepeatProcess",
        type: 'POST',
        data: JSON.stringify(task),
        contentType: "application/json"
    }).done(function() {
    	$("#rangListDiv").addClass("hiddenDiv");
    	document.location.reload();
    }).fail(function (jqXHR, textStatus, errorThrown) {
        showErrors(errorThrown)
    })
	
});


$(document).on('click', '#sendDateRepeatProcess', function(e) {
	//treba da se otvori dijalog za unosenje datuma
	task = {}
	task.id = $("#taskIdDateRepeatProcess").val();
	task.name = $("#taskNameDateRepeatProcess").val();
	task.date = $("#dateRepeatProcess").val();
	
	$.ajax({
        url: "/task/repeatProcess",
        type: 'POST',
        data: JSON.stringify(task),
        contentType: "application/json"
    }).done(function() {
    	$("#dateRepeatProcessDiv").removeClass("hiddenDiv");
    	document.location.reload();
    }).fail(function (jqXHR, textStatus, errorThrown) {
        showErrors(errorThrown)
    })
});


$(document).on('click', '#sendRequiredExplain', function(e) {
	
	var taskId = $("#taskIdRequiredExplain").val();
	var offerId = $("#offerIdRequiredExplain").val();
	var text  = $("#textArea").val();
	
	task = {}
	task.taskId = taskId;
	task.offerId = offerId;
	task.text = text;
	$.ajax({
        url: "/task/sendRequiredExplain",
        type: 'POST',
        data: JSON.stringify(task),
        contentType: "application/json"
    }).done(function() {
    	alert("send required");
    	/*$("#dateRepeatProcessDiv").removeClass("hiddenDiv");
    	document.location.reload();*/
    }).fail(function (jqXHR, textStatus, errorThrown) {
        showErrors(errorThrown)
    })
});


$(document).on('click', '#withoutRequiredExplain', function(e) {
	
	var taskId = $("#taskIdRequiredExplain").val();
	var offerId = $("#offerIdRequiredExplain").val();
	
	
	task = {}
	task.taskId = taskId;
	task.offerId = offerId;

	$.ajax({
        url: "/task/withoutRequiredExplain",
        type: 'POST',
        data: JSON.stringify(task),
        contentType: "application/json"
    }).done(function() {
    	alert("without");
    	/*$("#dateRepeatProcessDiv").removeClass("hiddenDiv");
    	document.location.reload();*/
    }).fail(function (jqXHR, textStatus, errorThrown) {
        showErrors(errorThrown)
    })
});



$(document).on('click', '#otherOffers', function(e) {
	
	var taskId = $("#taskIdDisplayResponse").val();


	$.ajax({
        url: "/task/otherOffers/"+taskId,
        type: 'GET',
    }).done(function() {
    	alert("other offers");
    	/*$("#dateRepeatProcessDiv").removeClass("hiddenDiv");
    	document.location.reload();*/
    }).fail(function (jqXHR, textStatus, errorThrown) {
        showErrors(errorThrown)
    })
});


$(document).on('click', '#acceptThisOffer', function(e) {
	
	var taskId = $("#taskIdDisplayResponse").val();


	$.ajax({
        url: "/task/acceptThisOffer/"+taskId,
        type: 'GET',
    }).done(function() {
    	alert("other offers");
    	/*$("#dateRepeatProcessDiv").removeClass("hiddenDiv");
    	document.location.reload();*/
    }).fail(function (jqXHR, textStatus, errorThrown) {
        showErrors(errorThrown)
    })
});

$(document).on('click', '#rateCompany', function(e) {
	task = {}
	task.id =  $("#taskIdRatingCompany").val();
	task.name = $("#taskNameRatingCompany").val();

	var ocjena = $('input[name=gender]:checked').val();
	

	$.ajax({
		url: "/task/rateClient/"+ocjena,
		type: 'POST',
		data: JSON.stringify(task),
        contentType: "application/json"
	}).done(function () {
	
		document.location.reload();
		
	}).fail(function (jqXHR, textStatus, errorThrown) {
		showErrors(errorThrown)
	})
});
/////////////////////////////////////////////////////

function showErrors(errors) {
    toastr.error(errors, "Errors");
}

function showMessage(message) {
    toastr.success(message, "Succesfull");
}
function openTask(id,name) {
    if(name == "Odabir o nedovoljno broju firmi"){
    	$("#chooseDiv").removeClass("hiddenDiv");	
    	$("#taskIdChooseDiv").val(id);
    	$("#taskNameChooseDiv").val(name);
    }else if(name == "Odlucivanje klijenta o nepostojecem broju ponuda"){
    	$("#cancelOrExtendDiv").removeClass("hiddenDiv");
    	$("#taskIdNoOffers").val(id);
    	$("#taskNameNoOffers").val(name);
    }else if(name == "Odlucivanje klijenta o nedovoljnom broju ponuda"){
    	$("#decideOrExtendNotEnoughDiv").removeClass("hiddenDiv");
    	$("#taskIdDecideOrExtend").val(id);
    	$("#taskNameDecideOrExtend").val(name);
    	
    }else if(name == "Donosenje odluke na osnovu rang liste"){
    	$("#rangListDiv").removeClass("hiddenDiv"); 
    	$("#taskIdRangDiv").val(id);
    	$("#taskNameRangDiv").val(name);
    	fillRangList(id,name);
    }else if(name == "Postavljanje roka za ponavljanje ponude"){
    	$("#taskIdDateRepeatProcess").val(id);
    	$("#taskNameDateRepeatProcess").val(name);
    	$("#dateRepeatProcessDiv").removeClass("hiddenDiv");
    }else if(name == "Zahtjevanje objasnjenja"){
    	 $("#requiredExplainDiv").removeClass("hiddenDiv");
    	 $("#taskIdRequiredExplain").val(id);
    	 
    	 $.ajax({
 	        url: "/task/getCurrentOfferFromTask/"+id,
 	        type: 'GET',
 	        dataType :"json",
 	    }).done(function(data) {
 	    	alert("dobio offer id");
 	    	 $("#offerIdRequiredExplain").val(data.id);
 	    	
 	    	//document.location.reload();
 	    }).fail(function (jqXHR, textStatus, errorThrown) {
 	        showErrors(errorThrown)
 	    })
    	
    }else if(name == "Prikaz objasnjenja"){
    	 $("#displayResponseDiv").removeClass("hiddenDiv");
    	 $("#taskIdDisplayResponse").val(id);
    	
    	 task = {}
    	 task.id = id;
    	 task.name = name;
    	 $.ajax({
    		 url: "/task/getTextFromTask",
             type: 'POST',
             data: JSON.stringify(task),
             contentType: "application/json",
             dataType :"json",
  	    }).done(function(data) {
  	    	alert("dobio offer id");
  	    	 $("#textAreaResponse").val(data.text);
  	    	
  	    	
  	    }).fail(function (jqXHR, textStatus, errorThrown) {
  	        showErrors(errorThrown)
  	    })
    	//prikazati objasnjenje i imati mogucnost da potvrdi da se odlucio za tu firmu ili da se vrati 
    	//na biranje neke druge ponude
    }else if(name == "Ocjenjivanje firme"){
    	$("#ratingCompanyDiv").removeClass("hiddenDiv");
    	$("#taskIdRatingCompany").val(id);
    	$("#taskNameRatingCompany").val(name);
    }
    
} 
function fillRangList(id,name){
    task = {}
    task.id = id;
    task.name = name;
    $.ajax({
        url: "/offer/getRangList",
        type: 'POST',
        dataType: "json",
        data: JSON.stringify(task),
        contentType: "application/json"
    }).done(function (data) {
    	var tableRef = document.getElementById("rangList");
     	 for (i = 0; i < data.length; i++) { 
     		 var newRow1 = tableRef.insertRow(i+1);
     		
     		 var newCell1 = newRow1.insertCell(0);
     		 var date = new Date(data[i].timeLimit);
     		 var newText1 = document.createTextNode(date);
        	 newCell1.appendChild(newText1);
        	 
        	 var newCell2 = newRow1.insertCell(1);
     		 var newText2 = document.createTextNode(data[i].price);
        	 newCell2.appendChild(newText2);
        	
        	 var newCell3 = newRow1.insertCell(2);
     		 var newText3 = document.createTextNode(data[i].company.name);
        	 newCell3.appendChild(newText3);
        	
           	 var newCell4 = newRow1.insertCell(3);
           	 var input = document.createElement('input');
           	 input.setAttribute("type", "button");
           	 var dataId = data[i].id;
           	 input.setAttribute("onClick", 'choosenOfferFromRangList('+id+',"'+dataId+'")');
           	 input.setAttribute("value", "Pregled");
           	 input.setAttribute("class", "btn btn-primary");
           	 newCell4.appendChild(input);
      	
      }
    }).fail(function (jqXHR, textStatus, errorThrown) {
        showErrors(errorThrown)
    })
	
	
}
 function choosenOfferFromRangList(taskId, offerId){
	//treba pozvati ajax da bi uopste postavio na dalji task
	 
	 taskOffer = {}
	 taskOffer.taskId = taskId;
	 taskOffer.offerId = offerId;
		 
	 $.ajax({
	        url: "/task/openRequiredExplainTask",
	        type: 'POST',
	        data: JSON.stringify(taskOffer),
	        contentType: "application/json"
	    }).done(function() {
	    	//document.location.reload();
	    }).fail(function (jqXHR, textStatus, errorThrown) {
	        showErrors(errorThrown)
	    }) 
	 
 }
 
