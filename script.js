const excelUrl = 'https://raw.githubusercontent.com/andrewvattuone/AWS-2024-Hackathon-Car-Search-Site/main/filtereddata.xlsx';

// const XLSX = require("xlsx");
// const fs = require("fs");
// const workbook = XLSX.readFile("./filtereddata.xlsx");
const YEAR_INDEX = 0;
const BRAND_INDEX = 1;
const MODEL_INDEX = 2;
const CONDITION_INDEX = 3;
const PRICE_INDEX = 4;
const SELLER_NAME_INDEX = 5;
const SELLER_RATING_INDEX = 6;
const STREET_INDEX = 7;
const STATE_INDEX = 8;
const COLOR_INDEX = 9;
const MIN_MPG_INDEX = 10;
const MAX_MPG_INDEX = 11;
const FUEL_INDEX = 12;
const MILEAGE_INDEX = 13;
console.log("Hello");

const submitButton = document.querySelector("button");
submitButton.addEventListener("click", generateValues);

// const sheet = workbook.Sheets[workbook.SheetNames[0]];
// const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

let excelData;

fetch(excelUrl)
  .then((response) => response.arrayBuffer())
  .then((data) => {
    // Read the Excel file
    const workbook = XLSX.read(new Uint8Array(data), { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Convert to a 2D array
    excelData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    console.log("Excel Data:", excelData);

    // Process the form inputs
    setupFormHandlers(excelData);
  })

let minprice, maxprice, mpg, electric, gas, hybrid, brand, red, black, white, grey, brown;
let colors, fuelTypes = [];

function generateValues(event) {
    console.log("Hello");
    event.preventDefault()
    minprice = document.getElementById("min").value;
    maxprice = document.getElementById("max").value;
    if(minprice > maxprice)
    {
        minprice = maxprice;
    }
    if(maxprice < minprice)
    {
        maxprice = minprice;
    }
    mpg = document.getElementById("mpg").value;
    electric = document.getElementById("Electric").checked;
    gas = document.getElementById("Gas").checked;
    hybrid = document.getElementById("Hybrid").checked;
    brand = document.getElementById("dropdownButton").textContent;
    red = document.getElementById("Red").checked;
    black = document.getElementById("Black").checked;
    white = document.getElementById("White").checked;
    grey = document.getElementById("Grey").checked;
    brown = document.getElementById("Brown").checked;
    if(electric||gas||hybrid)
    {
        if(electric)
            fuelTypes.push("Electric");
        if(gas)
            fuelTypes.push("Gas");
        if(hybrid)
            fuelTypes.push("Hybrid");
    }
    if(red||black||white||grey||brown)
    {
        if(red)
            colors.push("Red");
        if(black)
            colors.push("Black");
        if(white)
            colors.push("White");
        if(grey)
            colors.push("Gray");
        if(brown)
            colors.push("Brown");
    }
} 

console.log(minprice);
console.log(maxprice);
console.log(mpg);
console.log(colors);
console.log(fuelTypes);
console.log(brand);

function findCars(minprice, maxprice, mpg, brand, colors, fuelTypes) {
    let correctCars = [];
    for(let r = 1; r < excelData.length; r++)
    {
        if(carMatches(excelData[r], minprice, maxprice, mpg, brand, colors, fuelTypes))
        {
            correctCars.push(excelData[r]);
        }
    }

    return correctCars;
}

function carMatches(car, minprice, maxprice, mpg, brand, colors, fuelTypes)
{
    let containsColor = false;
    if(colors.length < 1)
    {
        containsColor = true;
    }
    else
    {
        for(let i = 0; i < colors.length; i++)
        {
            if(car[COLOR_INDEX].includes(colors[i]))
            {
                containsColor = true;
                break;
            }
        }
    }
    
    let correctFuelType = false;
    if(fuelTypes.length < 1)
    {
        correctFuelType = true;
    }
    else
    {
        for(let i = 0; i < fuelTypes.length; i++)
        {
            if(car[FUEL_INDEX] == fuelTypes[i])
            {
                correctFuelType = true;
                break;
            }
        }
    }

    if(car[PRICE_INDEX] >= minprice && car[PRICE_INDEX] <= maxprice && car[MIN_MPG_INDEX] >= mpg && car[BRAND_INDEX] == brand && containsColor && correctFuelType)
    {
        console.log("started1");
        return true;
    }
    else
    {
        return false;
    }
}

console.log(findCars(19000, 21000, 24, "Honda", [], ["Gasoline", "Electric"]));