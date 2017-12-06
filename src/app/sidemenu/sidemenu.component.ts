/*Sidemenu component for selection of routes on the map */

//angular imports
import { Component, OnInit } from '@angular/core';
//importing data service which gets all routes data (ToDo - Rename to RoutesDataService)
import { BusDataService } from '../bus-data.service';

@Component({
  selector:"app-sidemenu",
  templateUrl: "./sidemenu.component.html",
  styleUrls: ['./sidemenu.component.css']
})

export class SidemenuComponent implements OnInit {

 routes:Array<Object>; //This object will be initialized with data received from the bus data service

 constructor(private dataService:BusDataService){ //initialize class attribute with an instance of service

 }
 //*init function*/
  ngOnInit() {
    var thisObject = this;//local variable which holds the copy of the class' "this" object

    this.dataService.invoker() /*invoking data service's root function
    which returns a promise object once it is done fetching data*/
    .then(function(data:any){
    thisObject.routes = data.body.route; // if data is fetched successfully the routes class variable is assigned a value.
    console.log(thisObject.routes);//just for debugging for now.
    })
    .catch(function(err) {
      console.error('Error', err);//if the promise is rejected.
    });


    }




}
