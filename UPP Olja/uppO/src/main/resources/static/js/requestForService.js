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
    	alert("Odlucivanje o nedovoljno");
    }
    
}