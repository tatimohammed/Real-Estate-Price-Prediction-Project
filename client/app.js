function getBathValue() {
  var uiBathrooms = document.getElementsByName("bath");
  console.log(uiBathrooms);
  for (var i in uiBathrooms) {
    if (uiBathrooms[i].checked) {
      return parseInt(i) + 1;
    }
  }
  return -1; // Invalid Value
}

function getBHKValue() {
  var uiBHK = document.getElementsByName("bhk");
  for (var i in uiBHK) {
    if (uiBHK[i].checked) {
      return parseInt(i) + 1;
    }
  }
  return -1; // Invalid Value
}

function onClickedEstimatePrice() {
  console.log("Estimate price button clicked");
  var sqft = document.getElementById("sqft");
  var bhk = getBHKValue();
  var bathrooms = getBathValue();
  var location = document.getElementById("select-location");
  var estPrice = document.getElementById("result");

  var url = "http://127.0.0.1:5000/predict_price";

  $.post(url, {
    total_sq_ft: parseFloat(sqft.value),
    bhk: bhk,
    bath: bathrooms,
    location: location.value
  }, function (data, status) {
    console.log(data.price_predicted);
    estPrice.innerHTML = "<h2>" + data.price_predicted.toString()
      + " <span style='color: green;'>Lakh</span> | "
      + (Math.round((data.price_predicted * 1207.26) / 1000)).toString()
      + "k<span style='color: green;'> $</span></h2>";
    console.log(status);
  });
}

function onPageLoad() {
  console.log("document loaded");
  var url = "http://127.0.0.1:5000/get_location";
  $.get(url, function (data, status) {
    console.log("got response for get_location_names request");
    if (data) {
      var locations = data.locations;
      var uiLocations = document.getElementById("select-location");
      $('#select-location').empty();
      for (var i in locations) {
        var opt = new Option(locations[i]);
        $('#select-location').append(opt);
      }
    }
  });
}

window.onload = onPageLoad;