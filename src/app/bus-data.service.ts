/*This is a service to fetch routes of buses */
/*Credits - functionality inspired by https://prettymuni.com/ */

import { Injectable } from '@angular/core';
/*Injectables allow the service name to be recognized across components*/
@Injectable()
export class BusDataService{

  routes:Array<Object>;//array of route name objects
  constructor() { } //empty constructor

  // Changes XML to JSON (for xml data fetched from next bus service servers)
  xmlToJson(xml) {
  //from https://davidwalsh.name/convert-xml-json
  // Create the return object
  var obj = {};

  if (xml.nodeType == 1) { // element
    // do attributes
    if (xml.attributes.length > 0) {
    obj["@attributes"] = {};
    for (var j = 0; j < xml.attributes.length; j++) {
      var attribute = xml.attributes.item(j);
      obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
    }
  }
} else if (xml.nodeType == 3) { // text
  obj = xml.nodeValue;
}

// do children
if (xml.hasChildNodes()) {
for(var i = 0; i < xml.childNodes.length; i++) {
  var item = xml.childNodes.item(i);
  var nodeName = item.nodeName;
  if (typeof(obj[nodeName]) == "undefined") {
    obj[nodeName] = this.xmlToJson(item);
  } else {
    if (typeof(obj[nodeName].push) == "undefined") {
      var old = obj[nodeName];
      obj[nodeName] = [];
      obj[nodeName].push(old);
    }
    obj[nodeName].push(this.xmlToJson(item));
  }
}
}
return obj;
}

//prepping URLs for the request to be made to nextbus servers
getProxyURL() {
if (window.location.hostname === 'localhost') {
  return 'proxy?url='
} else {

}

}

//Checks if protocol used is https or not based on which the appropriate URLs are constructed
isSecure() {
var _t = this;
if (window.location.protocol.indexOf('https:') > -1)
return _t.getProxyURL();

return "";
}

//This function fetches the route list for the bus data
fetchRouteList() {
var thisObject = this;

var routeListURL = thisObject.isSecure() + 'http://webservices.nextbus.com/service/publicXMLFeed?command=routeList&a=sf-muni';

var p = new Promise(function(resolve, reject) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', routeListURL);
  xhr.send(null);
  xhr.onerror = reject;
  xhr.onreadystatechange = function() {
    var DONE = 4;
    var OK = 200;
    if (xhr.readyState === DONE) {
      if (xhr.status === OK) {
        var parsedRouteList:any = thisObject.xmlToJson(xhr.responseXML);

        if (parsedRouteList.hasOwnProperty('body') && parsedRouteList.body.hasOwnProperty('Error')) {
          reject(parsedRouteList.body.Error)
        } else {
          thisObject.routes = parsedRouteList.body.route;
          resolve(parsedRouteList);

        }
      }
    }
  }
});

return p;//promise returned
}


/*root function for the service -  this is invoked by SidemenuComponent*/
invoker() {
  var thisObject = this;
  var p = thisObject.fetchRouteList()
  p.then(function(data) {
    return p;//returns the promise object to the calling component once it is done fetching routes.
  })
  .catch(function(err) {
    console.error('Error', err);//logging the error if promise is rejected
  });
  return p;//return a promise object anyway for correctness in function syntax.
}


}
