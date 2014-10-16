
var cmxurl = "http://10.10.30.24:8082"
var macpriority = [];
var macpriorityval = ""

$(document).ready(function() {
	//getHistoryData();
	getCmxData();
	createHeatmap();
	getTemp();
	getHumid();
	getTotalDevices()

	$("#temp").html("22 Degrees C")

	$("#humidity").html("33%")

});


/**
 *	Adds a new heatmap
 */
function createHeatmap() {
	var config = {
		"width": 5000,//window.screen.width,//$('#pane-center').width(),
		"height": 5000,//window.screen.height,//$('#pane-center').height(),
		"radius": 40,
		"element": document.getElementById("background"),
		"visible": true,
		"opacity": 40,
		"gradient": { 0.0: "rgb(0,0,197)", 0.3: "rgb(0,255,255)", 0.6: "rgb(0,255,0)", 0.8: "yellow", 1: "rgb(255,0,0)" }
	};

	heatmap = h337.create(config);

	heatmap.store.setDataSet({ max: 100, data: []});

}

function getTotalDevices() {
	var token;
	$.ajax({
	    url: cmxurl + "/apic-em",
	    type: "GET",
	    //data: '{"start_time":"2014-05-19T14:18:40.990-0700", "end_time":"2014-05-19T14:18:40.990-0700"}',
	    success: function( data ) {
	    		totals = JSON.parse(data);
	    		console.log
	    		
    			$("#today").html("Unique Devices Today: " + totals["unique_devices"]);
	    	}
	});
	setTimeout(getTotalDevices, 60000);
}

function getTemp() {
	$.ajax({
	    url: "http://10.10.20.120:8080/temp.txt",
	    type: "GET",
	    //data: '{"start_time":"2014-05-19T14:18:40.990-0700", "end_time":"2014-05-19T14:18:40.990-0700"}',
	    success: function( data ) {
	    		$("#temp").html(data)
	    	}
	});
}

function getHumid() {
	$.ajax({
	    url: "http://10.10.20.120:8080/temp.txt",
	    type: "GET",
	    //data: '{"start_time":"2014-05-19T14:18:40.990-0700", "end_time":"2014-05-19T14:18:40.990-0700"}',
	    success: function( data ) {
	    		$("#humidity").html(data)
	    	}
	});
}



function updateHeatmapReal(data) {
	heatmap.store.setDataSet({ max: 100, data: []});
	heatmap.store.addDataPoint(node_heat_x, node_heat_y, value);
	// This condition will never be met now, kept in in case.
	if (data) {
		util = JSON.parse(data);
		for (var i in util) {
			var node = "#circle" + i;
			//console.log(node);
			var node_heat_x = $(node).position()['left'] + offsetx;
			var node_heat_y = $(node).position()['top'] + offsety;
			heatmap.store.addDataPoint(node_heat_x, node_heat_y, util[i]/*getElementHeat(Object.keys(servers)[i])*/);
		}
	}
	else {
		for (var i in clusterdata["servers"]) {
			if (clusterdata["servers"][i]["statistics"]["cpu_util"] && clusterdata["servers"][i]["status"] != "SHUTOFF") {
				var node = "#circle" + i;
				var latestdate = Object.keys(clusterdata["servers"][i]["statistics"]["cpu_util"]).sort().pop()
				var value = clusterdata["servers"][i]["statistics"]["cpu_util"][latestdate];
				var node_heat_x = $(node).position()['left'] + offsetx;
				var node_heat_y = $(node).position()['top'] + offsety;
				heatmap.store.addDataPoint(node_heat_x, node_heat_y, value);
			}
		}
		//console.log(heatmap.store.exportDataSet())
		setTimeout(updateHeatmapReal, 1000);
	}
}


function getTotalDevices() {
	var token;
	$.ajax({
	    url: cmxurl + "/location/unique",
	    type: "GET",
	    //data: '{"start_time":"2014-05-19T14:18:40.990-0700", "end_time":"2014-05-19T14:18:40.990-0700"}',
	    success: function( data ) {
	    		totals = JSON.parse(data);
	    		
    			$("#today").html("Unique Devices Today: " + totals["unique_devices"]);
	    	}
	});
	setTimeout(getTotalDevices, 60000);
}

function getHistoryData() {
	var token;
	$.ajax({
	    url: cmxurl + "/location/history/bc:f5:ac:e3:1e:34",
	    type: "GET",
	    //data: '{"start_time":"2014-05-19T14:18:40.990-0700", "end_time":"2014-05-19T14:18:40.990-0700"}',
	    success: function( data ) {
	    	//console.log(data)
	    	var cmxdata = JSON.parse(data);
	    	console.log(cmxdata);
	    	//$("#devtotal").html("No. of Devices: " + cmxdata.length)
	    	heatmap.store.setDataSet({ max: 100, data: []});
	    	//console.log("new poll");
	    	var devlabs = 0
	    	for (i in cmxdata) {
	    		if (cmxdata[i]["x"] > 50 && cmxdata[i]["x"] < 100) {
	    			//console.log(cmxdata[i]);
	    		}
	    		//if (cmxdata[i]["mac"] == "40:b0:fa:c1:3a:85" /*|| cmxdata[i]["mac"] == "bc:f5:ac:e3:1e:34" && cmxdata[i]["currentlyTracked"] == true*/) {
	    			//console.log(cmxdata[i])
	    			heatmap.store.addDataPoint(cmxdata[i]["x"] * 9 - 300/* * 5 + 50*/, cmxdata[i]["y"] * 9 - 300 /** 5 - 80*/, 25)
	    		//}


	    		//console.log(cmxdata[i])
	    		
	    	}
	    	setTimeout(getHistoryData, 500);
	    	
	        // console.log(data);
	    }
	});
}

function getCmxData() {
	var token;
	$.ajax({
	    url: cmxurl + "/location",
	    type: "GET",
	    success: function( data ) {
	    	//console.log("New Data");
	    	var cmxdata = JSON.parse(data);
	    	
	    	heatmap.store.setDataSet({ max: 100, data: []});
	    	//console.log("new poll");
	    	macpriority = []
	    	var devlabs = 0;
	    	var springroll = 0;
	    	var arcade = 0;
	    	var theatre = 0
	    	$(".point").remove();
	    	for (i in cmxdata) {
	    		if (cmxdata[i]["x"] > 115 && cmxdata[i]["x"] < 165 && cmxdata[i]["y"] > 80 && cmxdata[i]["y"] < 100) {
	    			devlabs++
	    			if (macpriorityval = "labs") {
	    				macpriority.push(cmxdata[i]["mac"]);
	    			}
	    			//console.log(cmxdata[i])
	    		}
	    		if (cmxdata[i]["x"] > 175 && cmxdata[i]["x"] < 190 && cmxdata[i]["y"] > 80 && cmxdata[i]["y"] < 100) {
	    			springroll++
	    			if (macpriorityval = "spring") {
	    				macpriority.push(cmxdata[i]["mac"]);
	    			}
	    		}
	    		if (cmxdata[i]["x"] > 60 && cmxdata[i]["x"] < 110 && cmxdata[i]["y"] > 70 && cmxdata[i]["y"] < 120) {
	    			arcade++
	    			if (macpriorityval = "arcade") {
	    				macpriority.push(cmxdata[i]["mac"]);
	    			}
	    		}
	    		if (cmxdata[i]["x"] > 190 && cmxdata[i]["x"] < 250 && cmxdata[i]["y"] > 80 && cmxdata[i]["y"] < 100) {
	    			theatre++
	    			if (macpriorityval = "theat") {
	    				macpriority.push(cmxdata[i]["mac"]);
	    			}
	    		}
	    		//if (cmxdata[i]["mac"] == "40:b0:fa:c1:3a:85" /*|| cmxdata[i]["mac"] == "bc:f5:ac:e3:1e:34" && cmxdata[i]["currentlyTracked"] == true*/) {
	    			//console.log(cmxdata[i])
	    			heatmap.store.addDataPoint(cmxdata[i]["x"] * 9 - 300/* * 5 + 50*/, cmxdata[i]["y"] * 9 - 300 /** 5 - 80*/, 25)
	    		//}
	    		//console.log(cmxdata[i])
	    		
	    		if (cmxdata[i]["mac"] == "3c:a9:f4:4d:40:5c" || cmxdata[i]["mac"] == "4c:b1:99:55:7e:b4" || cmxdata[i]["mac"] == "8c:70:5a:c9:40:50" || cmxdata[i]["mac"] == "10:a5:d0:08:c3:57") {
	    			$("body").append("<div class='point glyphicon glyphicon-remove' style='left: " + Math.round(cmxdata[i]["x"] * 9 - 300) + "px; top: " + Math.round(cmxdata[i]["y"] * 9 - 300) + "px'> ")
	    		}
	    		
	    		
	    	}

	    	var list = ""

	    	for (i in macpriority) {
	    		list += macpriority[i] + "<br />"
	    	}

	    	$("#macpri").html(list);

			$("#devtotal").html("No. of Devices: " + cmxdata.length);
			$("#devlabs").html("Lab Space: " + devlabs);
			$("#springroll").html("Springroll: " + springroll);
			$("#arcade").html("Arcade: " + arcade);
			$("#theatre").html("Theatre: " + theatre);

	    	setTimeout(getCmxData, 500);
	    	
	        // console.log(data);
	    }
	});
}


// t https://10.10.20.21/api/contextaware/v1/location/clients/
// headers = {'Authorization': 'Basic ZGV2dXNlcjpkZXZ1c2Vy'}
//     headers['Accept'] = 'application/json'