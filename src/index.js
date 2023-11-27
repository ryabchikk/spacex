import {SpaceX} from "./api/spacex";
import * as d3 from "d3";
import * as Geo from './geo.json'

document.addEventListener("DOMContentLoaded", setup)
const map= new Map()
function setup(){
    const spaceX = new SpaceX();
    spaceX.launches().then(data=>{
        const listContainer = document.getElementById("listContainer")
        renderLaunches(data, listContainer);
        //drawMap();
    })
    spaceX.launchpads().then(data=>{drawMap(data);})
}
function renderLaunches(launches, container){
    const list = document.createElement("ul");
    launches.forEach(launch=>{
        const item = document.createElement("li");
        item.innerHTML = launch.name;
        item.id = launch.id;
        item.onmouseover = selectRegion;
        item.onmouseout = freeRegion;
        list.appendChild(item);
        map.set(launch.id,launch.launchpad);
        
    })
    container.replaceChildren(list);
}
function selectRegion(obj){
    const id = map.get(obj.target.id);
    const elem = document.getElementById(id);
    elem.setAttribute("fill","red");
}

function freeRegion(obj){
    const id = map.get(obj.target.id);
    const elem = document.getElementById(id);
    elem.setAttribute("fill","black");
}

function drawMap(launchpads){
    const width = 640;
    const height = 480;
    const margin = {top: 20, right: 10, bottom: 40, left: 100};
    const svg = d3.select('#map').append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
    const projection = d3.geoMercator()
        .scale(70)
        .center([0,20])
        .translate([width / 2 - margin.left, height / 2]);
    svg.append("g")
        .selectAll("path")
        .data(Geo.features)
        .enter()
        .append("path")
        .attr("class", "topo")
        .attr("d", d3.geoPath()
            .projection(projection)
        )
        .style("opacity", .7)

    const array = new Array();

    launchpads.forEach(launchpad=>{
        array.push({"type":"Feature","id":launchpad.id,"geometry":{"type":"Point","coordinates":[launchpad.longitude,launchpad.latitude]}})
    })
    
    svg.append("g")
        .selectAll("path")
        .data(array)
        .enter()
        .append("path")
        .attr("class", "point")
        .attr("d", d3.geoPath()
            .projection(projection)
        )
        .attr("id",(elem) => elem.id);
    console.log(launchpads);
}
