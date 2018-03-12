var loc = location.search;
var spl = loc.split('=');
var req = new XMLHttpRequest();

req.onreadystatechange = function(){
  if (this.readyState == 4 && this.status == 200){
    console.log(req.responseText);
    make_cur_mood_chart(req.responseText, "currentMood");
    getTrends(req.responseText);
    make_chart(req.responseText, "myChart");
    document.getElementById('currentCity').innerHTML = spl[1];
    var id = spl[1]+"-red";
    document.getElementById(id).style.display = 'block';
  }
}
var get_req = '/cgi-bin/get.py'+loc;
console.log(loc);
req.open('GET', get_req, true );
console.log(get_req);
req.send();

var targetSVG = "M9,0C4.029,0,0,4.029,0,9s4.029,9,9,9s9-4.029,9-9S13.971,0,9,0z M9,15.93 c-3.83,0-6.93-3.1-6.93-6.93S5.17,2.07,9,2.07s6.93,3.1,6.93,6.93S12.83,15.93,9,15.93 M12.5,9c0,1.933-1.567,3.5-3.5,3.5S5.5,10.933,5.5,9S7.067,5.5,9,5.5 S12.5,7.067,12.5,9z";
var map = AmCharts.makeChart( "chartdiv", {
  type: "map",
  "theme": "light",
  "showDescriptionOnHover": false,
  dataProvider: {
    map: "canadaLow",
        "images":[{
        id: "vancouver",
        color: "#ff0000",
        svgPath: targetSVG,
        label: "Vancouver",
        latitude: 49.280517,
        longitude: -123.115634,
        scale: 0.5,
        title: "Vancouver",
        description: "<h1 style='display:none'></h1>"
      },
	{
        id: "montreal",
        color: "#000066",
        svgPath: targetSVG,
        label: "Montreal",
        latitude: 47.5737,
        longitude: -72.6487,
        scale: 0.5,
        title: "Montreal",
        description: "<h1 style='display:none'></h1>"
      },
	{
        id: "toronto",
        color: "#ff0066",
        svgPath: targetSVG,
        label: "Toronto",
        latitude: 43.654687,
        longitude: -79.380689,
        scale: 0.5,
        title: "Toronto",
        description: "<h1 style='display:none'></h1>"
      },
	{
        id: "calgary",
        color: "#006600",
        svgPath: targetSVG,
        label: "Calgary",
        latitude: 51.047348,
        longitude: -114.069098,
        scale: 0.5,
        title: "Calgary",
        description: "<h1 style='display:none'></h1>"
      },
      {
        id: "ottawa",
        color: "#660066",
        svgPath: targetSVG,
        label: "Ottawa",
        latitude: 45.4215,
        longitude: -75.6972,
        scale: 0.5,
        title: "Ottawa",
        description: "<h1 style='display:none'></h1>"
      },
      {
        id: "kitchener",
        color: "#ff9900",
        svgPath: targetSVG,
        label: "Kitchener",
        latitude: 43.4503,
        longitude: -80.4832,
        scale: 0.5,
        title: "Kitchener",
        description: "<h1 style='display:none'></h1>"
      },
      {
        id: "winnipeg",
        color: "#cc0099",
        svgPath: targetSVG,
        label: "Winnipeg",
        latitude: 49.8951,
        longitude: -97.1384,
        scale: 0.5,
        title: "Winnipeg",
        description: "<h1 style='display:none'></h1>"
      },
      {
        id: "edmonton",
        color: "#003366",
        svgPath: targetSVG,
        label: "Edmonton",
        latitude: 53.5444,
        longitude: -113.4909,
        scale: 0.5,
        title: "Edmonton",
        description: "<h1 style='display:none'></h1>"
      },
      {
        id: "hamilton",
        color: "#000000",
        svgPath: targetSVG,
        label: "Hamilton",
        latitude: 43.2557,
        longitude: -79.8711,
        scale: 0.5,
        title: "Hamilton",
        description: "<h1 style='display:none'></h1>"
      }
    ]
  },

  listeners: [{
	"event": "clickMapObject",
	"method": function(event){
    var ajaxReq = new XMLHttpRequest();
    ajaxReq.onreadystatechange = function(){
      if (this.readyState == 4 && this.status == 200) {
      var this_week_data = ajaxReq.responseText;
      make_cur_mood_chart(this_week_data, "myChart");
      document.getElementById('chart_loc').style.display='inline-block';
      document.getElementById('chartdiv').blur();
      }}
      var get_req = "/cgi-bin/get.py?city=" + event.mapObject.id;

        ajaxReq.open('GET', get_req, true);
        ajaxReq.send();

		}
}],

  areasSettings: {
    unlistedAreasColor: "rgb(64,170,244)"
  },

  imagesSettings: {
    color: "#CC0000",
    rollOverColor: "#CC0000",
    selectedColor: "#000000",
    balloonText: "City: <strong>[[title]]</strong>"
  }

} );

function clickObject(id){
			map.clickMapObject(map.getObjectById(id));
}

function addData(chart, data) {
	var obj = JSON.parse(data);
	var city = obj.City;
  var arr = obj.Mood;
	var y_axis = [arr[6][1], arr[5][1], arr[4][1], arr[3][1], arr[2][1], arr[1][1], arr[0][1]];
    chart.data.datasets.push({label: city,
				backgroundColor: 'rgba(230,130,230,0.3)',
				borderColor: 'rgb(230,130,230)',
				pointBackgroundColor: 'rgb(250,250,250)',
				data: y_axis});
    chart.update({easing: 'easeInOutCubic'});
}


function compareMood(city){
  var req = new XMLHttpRequest();

  req.onreadystatechange = function(){
    if (req.readyState == 4 && req.status == 200){
      var chart_old = eval(make_chart(req.responseText,"myChart"));
      var ajaxReq = new XMLHttpRequest();
      ajaxReq.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200) {
            var this_week_data = ajaxReq.responseText;
            addData(chart_old, this_week_data );
        }
      }
    var get_req1 = '/cgi-bin/get.py?city=' + city;
    ajaxReq.open('GET', get_req1, true);
    ajaxReq.send();
    }
  }
  var loc = location.search;
  var get_req = "/cgi-bin/get.py"+loc;
  req.open('GET', get_req, true);
  req.send();
}


function make_chart(data_obj, canvasID){

  	var c = document.getElementById(canvasID).getContext("2d");
  	var obj = JSON.parse(data_obj);
  	var city = obj.City;
    var arr = obj.Mood;
  	var y_axis = [arr[6][1], arr[5][1], arr[4][1], arr[3][1], arr[2][1], arr[1][1], arr[0][1]];
    var x_axis = [arr[6][0], arr[5][0], arr[4][0], arr[3][0], arr[2][0], arr[1][0], arr[0][0]]
  	var myChart = new Chart(c, {

  		type: 'line',

  		data: {

  			labels: x_axis,

  			datasets: [{
  				label: city,
  				backgroundColor: 'rgba(64,170,244,0.3)',
  				borderColor: 'rgb(64,170,244)',
  				pointBackgroundColor: 'rgb(250,250,250)',
  				data: y_axis,
  				}]

  			},
  	});
  	return myChart;

  }

  function getTrends(data_obj){
    var obj = JSON.parse(data_obj);
    var tags = obj.Hashtag;

    document.getElementById('hashtag-1').innerHTML = tags[0];
    document.getElementById('hashtag-2').innerHTML = tags[1];
    document.getElementById('hashtag-3').innerHTML = tags[2];

  }


  function make_cur_mood_chart(data_obj, canvasID){
  	var obj = JSON.parse(data_obj);
  	var city = obj.City;
  	var arr = [obj.Mood];

    y_axis = [arr[0][1]];

    var c = document.getElementById(canvasID).getContext("2d");
  	var myChart = new Chart(c, {
  		type: 'horizontalBar',
  		data: {

  			datasets: [{
          label: city,
  				backgroundColor: 'rgb(64,170,244)',
  				scale: 1,
  				scaleStartValue:0,
  				data: y_axis,
  				}]

  			},

  			options: { scales: {xAxes: [{ ticks:{beginAtZero:true}, gridLines:{display:false}}], yAxes:[{categorySpacing:0, barThickness: 50, gridLines:{display:false}}]}}
  	});

  	return myChart;

  }
