$( document ).ready(function() {
	$( "#registraionForm" ).submit(function( e ) {
        if (e.isDefaultPrevented() === false) {
        	dataToAdd = {}
        	dataToAdd.name = $("#name").val();
        	dataToAdd.userName =  $("#userName").val();
        	dataToAdd.email = $("#email").val();
        	dataToAdd.password = $("#password").val();
        	dataToAdd.address =  $("#address").val();
        	dataToAdd.city =  $("#city").val();
        	dataToAdd.postNumber =  $("#postNumber").val();
        	dataToAdd.role = $("#role").val();
        
        	$.ajax({
                url: "/user",
                type: 'POST',
                data: JSON.stringify(dataToAdd),
                contentType: "application/json",
                dataType :"json"
            }).done(function (data) {
            	
            		$("#longitude").val(data.longitude); 
            		$("#latitude").val(data.latitude);
            		$("#randomKey").val(data.randomKey);
            	
            		if(data.role == 2){
            			addInputForCompany();
            			$("#buttonSave").removeClass("hiddenButton");
            			$("#submitSave").addClass("hiddenButton");
            		
            		}else if(data.role == 1 && data.valid == 1){
            			//validan
            			showMessage("Potvrdite Vasu registraciju na mail");
            			$("#registraionDiv").addClass("hiddenDiv");
            		}else if(data.role == 1 && data.valid == 0){
            			showErrors("Nevalidan username ili password");
            		}
            	
            })
            .fail(function (jqXHR, textStatus, errorThrown) {
                showErrors(errorThrown)
            })
        }
		e.preventDefault();
	});
	

	
});
	
$(document).on('click', '#buttonSave', function(e) {
    	dataToAdd = {}
    	dataToAdd.name = $("#name").val();
    	dataToAdd.userName =  $("#userName").val();
    	dataToAdd.email = $("#email").val();
    	dataToAdd.password = $("#password").val();
    	dataToAdd.address =  $("#address").val();
    	dataToAdd.city =  $("#city").val();
    	dataToAdd.postNumber =  $("#postNumber").val();
    	dataToAdd.role = $("#role").val();
    	dataToAdd.distance = $("#distance").val();
    	dataToAdd.randomKey = $("#randomKey").val();
    	dataToAdd.longitude = $("#longitude").val();
    	dataToAdd.latitude = $("#latitude").val();
    	choosenCategories = [];
    	choosenCategories.push($("#categories").val())
    	
    	dataToAdd.categories = choosenCategories;
    	
    	$.ajax({
            url: "/user/addCompany",
            type: 'POST',
            data: JSON.stringify(dataToAdd),
            contentType: "application/json",
            dataType:"json",
        }).done(function (data) {
        	  
        	if(data.valid == 1){
			//validan
        		showMessage("Potvrdite Vasu registraciju na mail");
				$("#registraionDiv").addClass("hiddenDiv");
        	}else{
				showErrors("Nevalidan username ili password");
			}

        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            showErrors(errorThrown)
        })

});
    

$(document).on('click', '#showRegistration', function(e) {
	$("#registraionDiv").removeClass("hiddenDiv");
	$("#logInDiv").addClass("hiddenDiv");
});

$(document).on('click', '#logOut', function(e) {
	$.ajax({
        url: "/user/logOut",
        type: 'GET'
    }).done(function (data) {
    		showMessage("Log out uspjesan");
    	
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
        showErrors(errorThrown)
    })
});

$(document).on('click', '#logIn', function(e) {
	dataToAdd = {}
	dataToAdd.userName = $("#username").val();
	dataToAdd.password =  $("#passwordLogIn").val();
	
	$.ajax({
        url: "/user/logIn",
        type: 'POST',
        data: JSON.stringify(dataToAdd),
        contentType: "application/json",
        dataType: "json",
    }).done(function (data) {
    	if(data.text == "Neispravni podaci" ){
    		showErrors("Neispravni podaci");
    	}else if(data.text == "Uspjesno" && data.role == 1){
    		showMessage("Uspjesno logovanje");
    		window.location.href= "request.html";
    	}else if(data.text == "Uspjesno" && data.role == 2){
    		showMessage("Uspjesno logovanje");
    		window.location.href= "offer.html";
    	}
    	
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
        showErrors(errorThrown)
    })
});

function addInputForCompany() {
    var selectBox = document.getElementById("role");
    var selectedValue = selectBox.options[selectBox.selectedIndex].value;
    $("#roleDiv").after('<div class="form-group"><label class="col-sm-3">Distance :</label>'+
	'<div class="col-sm-9"><input type="text" id="distance" class="form-control"  /></div></div>');
	
    if(selectedValue == 2){
    	$("#roleDiv").after('<div class="form-group"><label class="col-sm-3">Categories :</label>'+
    			' <div class="col-sm-9"><select class="form-control" id="categories" >'+
					'</select></div></div>');
    	$.ajax({
			type: 'GET',
			dataType: 'json',
			url : '/jobCategory',
			success : function(data){
				
				for (i = 0; i < data.length; i++) { 
					var p = document.createElement("option");
					p.setAttribute("value", data[i].id);
					var parent = document.getElementById("categories");
					parent.appendChild(p);
					var x = document.getElementById("categories").options.item(i).text = data[i].name;
				}
			},
			error : function(XMLHttpRequest, textStatus, errorThrown) {
				alert("First log ERROR: " + errorThrown);
			}	
		});
    	
    	
    }
   }

function showErrors(errors) {
    toastr.error(errors, "Errors");
}

function showMessage(message) {
    toastr.success(message, "Succesfull");
}