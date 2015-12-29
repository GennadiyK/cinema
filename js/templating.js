
var peopleTemplate = _.template(document.getElementById('cinemaTemplate').innerHTML);

var peoplesObjData = JSON.parse(peoplesData);

var resultingHtml = peopleTemplate({peoples : peoplesObjData});

document.getElementById('peoplesTable').tBodies[0].innerHTML = resultingHtml;