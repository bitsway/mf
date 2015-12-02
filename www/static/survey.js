
//-------GET GEO LOCATION
function getLocationInfo() { //location
	navigator.geolocation.getCurrentPosition(onSuccess, onError);
}

// onSuccess Geolocation
function onSuccess(position) {
	$("#latitude").val(position.coords.latitude);
	$("#longitude").val(position.coords.longitude);	
}

// onError Geolocation
function onError(error) {
	$("#latitude").val(0);
	$("#longitude").val(0);	
	}

// -------------- If Not synced, Show login
function first_page(){
	if (localStorage.synced!='YES'){	
		var url = "#login";
		$.mobile.navigate(url);		
	}else{
		var url = "#pageHome";
		$.mobile.navigate(url);		
		};
}

function get_login() {
	var url = "#login";
	$.mobile.navigate(url);
	}

function setFocusPoint(){
	var memID=$("#focusMemID").val();
	$("input[id='totalAmount"+memID+"']").focus();	
	}

//================= Clear authorization
function clear_autho(){	
	//alert(localStorage.user_pass);
	
	if (localStorage.cid=="" || localStorage.cid==undefined || localStorage.user_id=="" || localStorage.user_id==undefined){
		$("#error_login").html('Already Logout');	
	}else{
		$.ajax({
			 type: 'POST',
			 url: localStorage.base_url+'sync_api/syncLogout?cid='+localStorage.cid+'&repid='+localStorage.user_id+'&password='+localStorage.user_pass,
			 success: function(result) {											
					if (result==''){
						$("#wait_image_login").hide();
						$("#loginButton").show();
						$("#error_login").html('Sorry Network not available');
						
					}else{							
						var resultArray = result.split('<SYNCDATA>');			
						if (resultArray[0]=='FAILED'){
							$("#wait_image_login").hide();
							$("#loginButton").show();								
							$("#error_login").html(resultArray[1]);							
						}else if (resultArray[0]=='SUCCESS'){													
							res_string=resultArray[1];
														
							//---------------
							$("#error_login").html(res_string);
							$("#wait_image_login").hide();
							$("#loginButton").show();
							
							//----------------
							localStorage.base_url='';
							localStorage.photo_url='';
							localStorage.photo_submit_url='';
							
							localStorage.cid='';
							localStorage.user_id='';
							localStorage.user_pass='';
							localStorage.synced=''							
							localStorage.samity_cmb_list=''
							
							var url = "#login";
							$.mobile.navigate(url);	
							
						}else{
							$("#wait_image_login").hide();
							$("#loginButton").show();
							$("#error_login").html('Server Error');							
							}
					}
				  },
			  error: function(result) {					 
				  $("#wait_image_login").hide();
				  $("#loginButton").show();
				  $("#error_login").html('Invalid Request');
				  
				  var url = "#login";
				  $.mobile.navigate(url);	
			  }
		  });//end ajax
	
	}
	
}

//========================= Longin: Check user
function check_user() {	
	var cid=$("#cid").val().toUpperCase();
	//cid=$.trim(cid);
	//var  apipath_base_photo_dm='http://127.0.0.1:8000/welcome/dmpath/get_path?CID='+cid +'&HTTPPASS=e99business321cba'
	var apipath_base_photo_dm ='http://e.businesssolutionapps.com/welcome/dmpath_mf/get_path?CID='+cid +'&HTTPPASS=e99business321cba'
	
	var user_id=$("#user_id").val().toUpperCase();
	var user_pass=$("#user_pass").val();
	
	user_id=$.trim(user_id);
	
	var base_url='';
	var photo_url='';
	
	//-----
	if (cid=="" || cid==undefined || user_id=="" || user_id==undefined || user_pass=="" || user_pass==undefined){
		var url = "#login";      
		$.mobile.navigate(url);
		
		$("#error_login").html("Required CID, User ID and Password");	
	}else{
		//-----------------
		localStorage.base_url='';
		localStorage.photo_url='';
		localStorage.photo_submit_url='';
		
		localStorage.cid='';
		localStorage.user_id='';
		localStorage.user_pass='';
		
		
		//alert(apipath_base_photo_dm);
		
		//----
		$.ajax({
			 type: 'POST',
			 url: apipath_base_photo_dm,
			 success: function(result) {					
				if (result==''){
					$("#wait_image_login").hide();
					$("#loginButton").show();
					$("#error_login").html('Base URL not available');						
				}else{
					var startIndex=result.indexOf('<start>')
					var endIndex=result.indexOf('<end>')
					
					var urlResult=result.substring(startIndex+7,endIndex);
					
					var resultArray = urlResult.split('<fd>');		
					if(resultArray.length==3){
						base_url=resultArray[0]
						photo_url=resultArray[1]
						photo_submit_url=resultArray[2]
						
						//-------------
						if(base_url=='' || photo_url==''){	
							$("#wait_image_login").hide();
							$("#loginButton").show();
							$("#error_login").html('Base URL not available');	
						}else{
							//$("#error_login").html(base_url);
							//clear_autho();
							
							//--------------------------
							$("#error_login").html("");		
							$("#loginButton").hide();
							$("#wait_image_login").show();
							
							localStorage.base_url=base_url;
							localStorage.photo_url=photo_url;
							localStorage.photo_submit_url=photo_submit_url;
							
							localStorage.synced='NO'
							
							//alert(localStorage.base_url+'sync_api/syncRepMob?cid='+cid+'&repid='+user_id+'&password='+user_pass+'&synccode='+localStorage.synccode);
							//alert(localStorage.base_url+'sync_api/syncRepMob?cid='+localStorage.cid+'&repid='+localStorage.user_id+'&password='+localStorage.user_pass+'&synccode='+localStorage.synccode);
							//$("#error_login").html(localStorage.base_url+'syncRepMob?cid='+localStorage.cid+'&repid='+localStorage.user_id+'&password='+localStorage.user_pass+'&synccode='+localStorage.synccode);
							
							$.ajax({
									 type: 'POST',
									 url: localStorage.base_url+'sync_api/syncRepMob?cid='+cid+'&repid='+user_id+'&password='+user_pass+'&synccode='+localStorage.synccode,
									 success: function(result) {											
											if (result==''){
												$("#wait_image_login").hide();
												$("#loginButton").show();
												$("#error_login").html('Sorry Network not available');
												
											}else{							
												var resultArray = result.split('<SYNCDATA>');			
												if (resultArray[0]=='FAILED'){
													$("#wait_image_login").hide();
													$("#loginButton").show();								
													$("#error_login").html(resultArray[1]);
													
												}else if (resultArray[0]=='SUCCESS'){													
													samity_string=resultArray[1];
													syncCode=resultArray[2];
													
													//------------ Delivery Distributor Combo
													
													var samityList = samity_string.split('<rd>');
													var samityListLength=samityList.length
													
													var samityCombo='';													
													for (var i=0; i < samityListLength; i++){
														var samityListArray = samityList[i].split('<fd>');
														samityID=samityListArray[0];
														samityName=samityListArray[1];														
														if (samityID!=''){
															samityCombo+='<li class="ui-btn ui-shadow ui-corner-all ui-btn-icon-left ui-icon-location" style="border-bottom-style:solid; border-color:#CBE4E4;border-bottom-width:thin"><a onClick="memberList(\''+samityID+'\')">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+samityName+' ('+samityID+')'+'</a></li>';
															}
													}
													localStorage.samity_cmb_list=samityCombo
													
													//---------------
													$("#error_login").html('');
													$("#wait_image_login").hide();
													$("#loginButton").show();
													
													//----------------
													localStorage.cid=cid;
													localStorage.user_id=user_id;
													localStorage.user_pass=user_pass;
													
													
													localStorage.synced='YES';
													localStorage.synccode=syncCode;
													
													var url = "#pageHome";
													$.mobile.navigate(url);								
													location.reload();
													
												}else{
													$("#wait_image_login").hide();
													$("#loginButton").show();
													$("#error_login").html('Server Error');							
													}
											}
										  },
									  error: function(result) {					 
										  $("#wait_image_login").hide();
										  $("#loginButton").show();
										  $("#error_login").html('Invalid Request');
										  
										  var url = "#login";
										  $.mobile.navigate(url);	
									  }
								  });//end ajax
								}//base url check
						
						//-------------		
					}else{
						$("#wait_image_login").hide();
						$("#loginButton").show();
						$("#error_login").html('Base URL Settings Incorrect');	
					}					
				}
			  },
			  error: function(result) {			  	   
				  $("#wait_image_login").hide();
				  $("#loginButton").show();
				  $("#error_login").html('Invalid Request to get Base URL');				  	
			  }
		});//end ajax
		
		  }//end else	
	}//function



//------------------------------ Samity List
function addSamityList() {
	$("#samity_combo_id").val('');
	$("#wait_image_samity").hide();
	
	var samity_cmb_list=localStorage.samity_cmb_list;	
	//---		
	var samity_combo_ob=$('#samity_combo_id_lv');
	samity_combo_ob.empty()
	samity_combo_ob.append(samity_cmb_list);
	
	//-------
	localStorage.doubleSubmit='0'	
	var url = "#pageSamity";
	$.mobile.navigate(url);
	
	samity_combo_ob.listview("refresh");
}


//==================Samity > Member List
function memberList(samId) {						
		$("#memberErrMsg").text("");
		$("#err_samity_next").text("");
		
		
		$("#wait_image_samity").show();
		$("#samity_combo_id_lv").hide();
		
		var synccode=localStorage.synccode;
		if (synccode==undefined || synccode=="" || synccode=="None"){
			 synccode="0";
			 }
		
		
		//alert(localStorage.base_url+'sync_api/loanSavCollection?cid='+localStorage.cid+'&repid='+localStorage.user_id+'&samityid='+samId+'&synccode='+synccode);
		$.ajax({
		  url: localStorage.base_url+'sync_api/loanSavCollection?cid='+localStorage.cid+'&repid='+localStorage.user_id+'&samityid='+samId+'&synccode='+synccode,
		  success: function(memResult) {			
			if (memResult==''){
				$("#err_samity_next").text("'Check vaid CID Or Network connectivity")
				$("#samity_combo_id_lv").show();
				$("#wait_image_samity").hide();				
			}else{	
				//alert(memResult);			
				
				var resultArray = memResult.split('rdrd');			
				if (resultArray[0]!=''){
					$("#memberErrMsg").text(resultArray[0]);
				};
				
				$("#samID").val(samId);				
				$('#memberListDiv').empty();
				$('#memberListDiv').append(resultArray[1]).trigger('create');
				
				
				localStorage.doubleSubmit='0'
				
				var url = "#pageMember";
				$.mobile.navigate(url);
				
				$("#wait_image_samity").hide();
				$("#samity_combo_id_lv").show();
				
				//getLocationInfo();
				
				}			
		  },
		  error: function(errror_str) {
			$("#err_samity_next").text(errror_str)
			$("#samity_combo_id_lv").show();
			$("#wait_image_samity").hide();
		  }
		});
}

//========================== Final Submit
function finalSubmit(memId) {		
		var submitMemId=memId.replace('.', '_');		
		$('#btn_submit'+submitMemId).hide();
		
		if (localStorage.doubleSubmit=='1'){
			$("#memberErrMsg").text("Please wait...");
			$('#btn_submit'+submitMemId).show();
			alert("Please wait...");			
		}else{
			localStorage.doubleSubmit='1'
			
			var loanAccStr=$("input[id='"+memId+"loanId']").val();//$("#"+memId+"loanId").val();
			var savAccStr=$("input[id='"+memId+"savId']").val();//$("#"+memId+"savId").val();
			
			var loan_array=new Array();
			var sav_array=new Array();
			
			loan_array=loanAccStr.split('_');
			sav_array=savAccStr.split('_');
			
			var totalAmtShow=0
			var submitStr='';
			var loanStr='';
			var savStr='';
			
			//---------- Loan
			var loanAcc=''
			var loanAmt=0			
			var i=0;
			while (i < loan_array.length){
				loanAcc=loan_array[i];					
				loanAmt=$("#L"+loanAcc).val();
				
				if (loanAmt==""){
					loanAmt=0;
				}else{
						if (isNaN(loanAmt)){
							loanAmt=0;
						}
					};
				
				if (eval(loanAmt)>0){	
					totalAmtShow=totalAmtShow+eval(loanAmt)
					if (loanStr==''){
						loanStr=loanAcc+'_'+loanAmt
					}else{
						loanStr=loanStr+','+loanAcc+'_'+loanAmt
						}
				}
				i=i+1;
			};
			
			//----------- Savings
			var savAcc=''
			var savAmt=0			
			var j=0;
			while (j < sav_array.length){
				savAcc=sav_array[j];					
				savAmt=$("#S"+savAcc).val();
				
				if (savAmt==""){
					savAmt=0;
				}else{
					if (isNaN(savAmt)){
						savAmt=0;
					}
					};
				
				if (eval(savAmt)>0){	
					totalAmtShow=totalAmtShow+eval(savAmt)
					if (savStr==''){
						savStr=savAcc+'_'+savAmt
					}else{
						savStr=savStr+','+savAcc+'_'+savAmt
						}
				}
				j=j+1;
			};
			
			var memTag='confirmSubmit'+memId;		
			var confirmStatus=$("input[name='"+memTag+"']:checked").val();
			var confirmFlag=0
			if (confirmStatus=='YES'){
				confirmFlag=1;
				}
			
			//var confirmFlag=$("input[id='confirmSubmit"+memId+"']").attr('checked') ? 1 : 0;
			var totalAmount=$("input[id='totalAmount"+memId+"']").val();
			totalAmount=eval(totalAmount);
			
			//alert(confirmFlag);
			
			if (totalAmtShow==0){
				localStorage.doubleSubmit='0'
				$("#memberErrMsg").text("");
				$('#btn_submit'+submitMemId).show();				
				alert("Required amount");
			}else{			
				if (totalAmtShow!=totalAmount){
					localStorage.doubleSubmit='0'
					$("#memberErrMsg").text("");
					$('#btn_submit'+submitMemId).show();
					alert("Required valid Total Amount");
				}else{
					if (confirmFlag!=1){
						localStorage.doubleSubmit='0'
						$("#memberErrMsg").text("");
						$('#btn_submit'+submitMemId).show();
						alert("Required checked confirmation");
					}else{
						//---------
						var samId=$("#samID").val();
						submitStr=loanStr+'fdfd'+savStr;
							
						var synccode=localStorage.synccode;
						if (synccode==undefined || synccode=="" || synccode=="None"){
							 synccode="0";
							 }
						
						var errorStr='Required Value';
						var latitude=$("#latitude").val();
						var longitude=$("#longitude").val();
						
						//http://127.0.0.1:8000/mrepmobile/mf/dataSubmitMf?cid=MFDEMO&repid=101&samityid=1&memberid=1.04&totalAmount=120&mLatitude=&mLongitude=&data=4_100fdfd4_20&synccode=105906
						//alert (apipath+'loanSavCollection?cid='+cidValue+'&repid='+repid+'&samityid='+samId+'&memberid='+memId+'&totalAmount='+totalAmtShow+'&mLatitude='+latitude+'&mLongitude='+longitude+'&data='+encodeURI(submitStr)+'&synccode='+synccode+'&btnSubmit=YES');
						$.ajax({
								 url: localStorage.base_url+'sync_api/loanSavCollection?cid='+localStorage.cid+'&repid='+localStorage.user_id+'&samityid='+samId+'&memberid='+memId+'&totalAmount='+totalAmtShow+'&mLatitude='+latitude+'&mLongitude='+longitude+'&data='+encodeURI(submitStr)+'&synccode='+synccode+'&btnSubmit=YES',
								  success: function(result) {									 
									if (result==''){
										localStorage.doubleSubmit='0';
										$('#btn_submit'+submitMemId).show();
										alert ('Check Network connectivity');
									}else{							 
										var resultArray = result.split('rdrd');			
										if (resultArray[0]!=''){
											$("#memberErrMsg").text(resultArray[0]);
										};
										
										$("#samID").val(samId);										
										$('#memberListDiv').empty();
										$('#memberListDiv').append(resultArray[1]).trigger('create');
										
										$("#focusMemID").val(resultArray[2]);
										
										localStorage.doubleSubmit='0';
										var url = "#pageMember";      
										$.mobile.navigate(url);										
										
									}
								  },
								  error: function(result) {
									localStorage.doubleSubmit='0';
									$('#btn_submit'+submitMemId).show();							
									alert(errror_str);
								  }
						});
					
					//--------
					}
				}
			}
	}
}

//============= Amount sum on blur
function sumTotal(memId){	
		var loanAccStr=$("input[id='"+memId+"loanId']").val();//$("#"+memId+"loanId").val();
		var savAccStr=$("input[id='"+memId+"savId']").val();//$("#"+memId+"savId").val();
		
		var loan_array=new Array();
		var sav_array=new Array();
		
		loan_array=loanAccStr.split('_');
		sav_array=savAccStr.split('_');
		
		var totalAmtShow=0
		
		//---------- Loan
		var loanAcc=''
		var loanAmt=0			
		var i=0;
		while (i < loan_array.length){
			loanAcc=loan_array[i];					
			loanAmt=$("#L"+loanAcc).val();
			
			if (loanAmt==""){
				loanAmt=0;
			}else{
				if (isNaN(loanAmt)){
					loanAmt=0;
				}
				};					
			totalAmtShow=totalAmtShow+eval(loanAmt)					
			i=i+1;
		};
		//----------- Savings
		var savAcc=''
		var savAmt=0			
		var j=0;
		while (j < sav_array.length){
			savAcc=sav_array[j];					
			savAmt=$("#S"+savAcc).val();
			
			if (savAmt==""){
				savAmt=0;
			}else{
				if (isNaN(savAmt)){
					savAmt=0;
				}
				};					
			totalAmtShow=totalAmtShow+eval(savAmt)					
			j=j+1;
		};	
		//$("input[id='"+memId+"AMT']").val(totalAmtShow);
		$("span[id='"+memId+"AMT']").text(totalAmtShow);
}

function getReportList() {	
	$("#error_report").html('');
	$('#report_data_show').empty();
	
	var url = "#pageReport";
	$.mobile.navigate(url);
	}


//------------------------------ Report
function rpt_samity_wise_summary() {
			
		$("#error_report").html('');
		$('#report_data_show').empty();
		$('#wait_report').hide();
		
		var user_id=localStorage.user_id
		
		if (user_id=="" || user_id==undefined || user_id=="None"){
			$("#error_report").html('Invalid authorization');
		}else{
			
			$('#wait_report').show();
			
			var synccode=localStorage.synccode;
			if (synccode==undefined || synccode=="" || synccode=="None"){
				 synccode="0";
				 }
			
			//alert(localStorage.base_url+'sync_api_report/getSamitySummaryReport?cid='+localStorage.cid+'&repid='+localStorage.user_id+'&synccode='+synccode)
			
			//====== 
			$.ajax({
				type: 'POST',
				url: localStorage.base_url+'sync_api_report/getSamitySummaryReport?cid='+localStorage.cid+'&repid='+localStorage.user_id+'&synccode='+synccode,
				success: function(result){
						if (result==''){
							$("#error_report").html('Sorry Network not available');												
							$('#wait_report').hide();							
						}else{
							var resultRetArray = result.split('<rdrd>');
							if (resultRetArray[0]=='FAILED'){
								$("#error_report").html(resultArray[1]);
								$('#wait_report').hide();								
							}else if(resultRetArray[0]=='SUCCESS'){
									
									var resultStr = resultRetArray[1];								
									
									$('#report_data_show').empty();
									$('#report_data_show').append(resultStr).trigger('create');
									
									//==========
									$('#wait_report').hide();	
									
									//=====
									var url = "#pageReport";
									$.mobile.navigate(url);
									
								}else{
									$("#error_report").html("Result Error");
					 				$('#wait_report').hide();
									}
						};
						
					},error: function(result) {	  
					  $("#error_report").html("Connectivity Error.Please Check Your Network Connection and Try Again");
					  $('#wait_report').hide();				  
				  }
				  
			  });//end ajax
		  
		};

}



//---------------------- Exit Application
function exit() {	
	navigator.app.exitApp();
}

// -------