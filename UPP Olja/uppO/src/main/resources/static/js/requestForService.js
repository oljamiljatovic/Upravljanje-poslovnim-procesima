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
	dataToAdd.jobCategoryID = $("#jobCategoryID").val();
	dataToAdd.description =  $("#description").val();
	dataToAdd.maxValuation = $("#maxValuation").val();
	dataToAdd.timeLimitForOffers = $("#timeLimitForOffers").val();
	dataToAdd.maxNumberOffers =  $("#maxNumberOffers").val();
	dataToAdd.timeLimitForCarryOut =  $("#timeLimitForCarryOut").val();

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
    	alert("data ima " + data.length);
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
           	 input.setAttribute("onClick", 'choosenOfferFromRangList('+id+',"'+data.id+'")');
           	 input.setAttribute("value", "Pregled");
           	 input.setAttribute("class", "btn btn-primary");
           	 newCell4.appendChild(input);
      	
      }
    }).fail(function (jqXHR, textStatus, errorThrown) {
        showErrors(errorThrown)
    })
	
	
}
 function choosenOfferFromRangList(taskId, offerId){
	 alert("choosen one");
 }