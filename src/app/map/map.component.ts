/*This component allows for drawing of the map layers */
/*Credits - Inspired by https://prettymuni.com/ */

// angular imports
import { Component, ElementRef} from '@angular/core';
//other imports
import * as d3 from 'd3';

@Component({
	selector: 'sf-map', //selector which represents this component
	template: `
	<div class="map-container"></div>`, //template the selector will follow
	styleUrls: ['./map.component.css', './map.component.svg.css'] //stylesheets separated for svg and html styling
})

//This component draws and initializes the map
export class MapComponent{
/*class attributes declarations */
svgWidth:number = window.innerWidth; //initializing width for map container
svgHeight:number = window.innerHeight;//initializing height for map container
svgContainer=null; //svg element for map container
svgProjection = null; //map projection object
projectionScale:number = 350000; //map projection scale
mapCenter:[number, number] = [-122.433701, 37.767683]; //center positions for the map`
mapLayerNames:Array<string> = ["neighborhoods", "arteries", "freeways", "streets"]; /*array for all
map file names*/
mapLayersGeoJsons = null; //this object will hold all parsed geojsons corresponding to the different maps
private parentNativeElement: any; // a native Element to access this component's selector for drawing the map
baseMapGroups=[]; //this array holds all map layer objects primarily used for zooming purposes
zoom = null; //class attribute pointing at zoom function for the map Component
constructor(element: ElementRef) {
this.parentNativeElement = element.nativeElement; //to get native parent element of this component
}

/*this function draws the base svg container*/
drawContainer(){

var thisObject = this;
	//initializing zoom
	this.zoom = d3.zoom()
	.scaleExtent([1, 10])
	.on("zoom", function() {
		thisObject.zoomed()
	})

	//initializing svg container
	this.svgContainer = d3.select(this.parentNativeElement).select("div").append("svg")
	.attr("preserveAspectRatio", "xMidYMid slice")
	.attr("viewBox", "0 0 " + this.svgWidth + " " + this.svgHeight)
	.classed("svg-content-responsive", true)
	.call(this.zoom)

	//initializing projection
	this.svgProjection = d3.geoMercator()
	.scale(this.projectionScale)
	.rotate([0,0])
	.center(this.mapCenter)


}

/* This function opens the map geojsons and draws them on the base container */
drawMapLayers(){
	var temp = this;//temporary local variable to hold value of class' "this" object
	//getting map names, parsing them and then drawing them
	this.mapLayerNames.forEach(function(mapName:Object){

	d3.json("assets/sfmaps/"+mapName+".json", function(error,data:any){
		//adding svg elements
		var mapSVG = temp.svgContainer.append("g")
		.attr("class", "layer_"+mapName);

		var geoPath = d3.geoPath()
		.projection(temp.svgProjection);

		//getting feature objects from the map and drawing them as paths on the svg container
		var features:any = data.features;
		//console.log(features);
		mapSVG.selectAll("path")
		.data(features)
		.enter()
		.append("path")
		.style("fill", "gray")
		.style("stroke", "black")
		.attr("d", geoPath)

		//adding map SVGs to an array to be used later for zooming purposes
		temp.baseMapGroups.push(mapSVG);

	})
})

}

/*This function adds zoom functionality on the map SVG layers */
zoomed(){
	var thisObject = this;//local variable to hold value of "this" object so that it can be accessed in inner function declarations
	thisObject.baseMapGroups.forEach(function(mapGroup) {
	mapGroup.attr("transform", d3.event.transform); //applying a event transform on map svg layers.
});



}
/*init function*/
ngOnInit(){
	this.drawContainer();//draws SVG container
	this.drawMapLayers();//draws Map layers

}
}
