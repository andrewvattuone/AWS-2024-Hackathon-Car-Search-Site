async function fetchCarData(minprice, maxprice, mpg, brand, colors, fuelTypes) {
    const url = 'https://raw.githubusercontent.com/andrewvattuone/AWS-2024-Hackathon-Car-Search-Site/refs/heads/main/filteredcardata.csv';
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch the CSV file');
        }
        const csvData = await response.text();
        const cars = parseCSV(csvData);
        const filteredCars = findCars(cars, minprice, maxprice, mpg, brand, colors, fuelTypes);
        console.log(filteredCars);
        updateTable(filteredCars);
    } catch (error) {
        console.error('Error:', error);
    }
}


function parseCSV(csvData) {
    const rows = csvData.split('\n');
    const headers = rows[0].split(',');
    const cars = [];
    
    for (let i = 1; i < rows.length; i++) {
        const row = rows[i].split(',');
        if (row.length === headers.length) {
            let car = {};
            for (let j = 0; j < headers.length; j++) {
                car[headers[j].trim()] = row[j].trim();
            }
            cars.push(car);
        }
    }
    
    return cars;
}

function findCars(cars, minprice, maxprice, mpg, brand, colors, fuelTypes) {
    let correctCars = [];
    for(let i = 0; i < cars.length; i++)
    {
        if(carMatches(cars[i], minprice, maxprice, mpg, brand, colors, fuelTypes))
        {
            correctCars.push(cars[i]);
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
            if(car.ExteriorColor.includes(colors[i]))
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
            if(car.FuelType.includes(fuelTypes[i]))
            {
                correctFuelType = true;
                break;
            }
        }
    }

    if(Number(car.Price) >= minprice && Number(car.Price) <= maxprice && Number(car.MinMPG) >= mpg && car.Make == brand && containsColor && correctFuelType)
    {
        return true;
    }
    else
    {
        return false;
    }
}

function updateTable(cars)
{   
    // puts cars with highest minimum miles per gallon at the top of the list
    cars.sort((a, b) => b.MinMPG - a.MinMPG);

    // puts electric cars higher than other cars at the top of the list
    cars.sort((a, b) => {
        if (a.FuelType === "electric" && b.FuelType !== "electric") {
          return -1; 
        } else if (b.FuelType === "electric" && a.FuelType !== "electric") {
          return 1;
        } else {
          return 0;
        }
    });

    for(let i = 0; i < 10; i++)
    {
        if(i < cars.length)
        {
            updateCarDetails(i + 1, cars[i]);
        }
        else
        {
            updateCarDetails(i + 1, null);
        }
    }
}

function updateCarDetails(carNumber, car) {
    if(car == null)
    {
        clearCarDetails(carNumber);
        return;
    }

    const carRow = document.querySelector(`.carRow[data-car-number="${carNumber}"]`);
    if (carRow) {
        carRow.querySelector('.year').textContent = car.Year;
        carRow.querySelector('.make').textContent = car.Make;
        carRow.querySelector('.model').textContent = car.Model;
        carRow.querySelector('.condition').textContent = car.Condition;
        carRow.querySelector('.price').textContent = '$' + car.Price;
        carRow.querySelector('.seller').textContent = car.SellerName;
        carRow.querySelector('.rating').textContent = car.SellerRating;
        carRow.querySelector('.street').textContent = car.StreetName;
        carRow.querySelector('.state').textContent = car.State;
        carRow.querySelector('.color').textContent = car.ExteriorColor;
        carRow.querySelector('.minMPG').textContent = car.MinMPG;
        carRow.querySelector('.maxMPG').textContent = car.MaxMPG;
        carRow.querySelector('.fuel').textContent = car.FuelType;
        carRow.querySelector('.mileage').textContent = car.Mileage;
    } else {
        console.error(`Car with number ${carNumber} not found.`);
    }
}

function clearCarDetails(carNumber)
{
    const carRow = document.querySelector(`.carRow[data-car-number="${carNumber}"]`);
    if (carRow) {
        carRow.querySelector('.year').textContent = 'NA';
        carRow.querySelector('.make').textContent = 'NA';
        carRow.querySelector('.model').textContent = 'NA';
        carRow.querySelector('.condition').textContent = 'NA';
        carRow.querySelector('.price').textContent = 'NA';
        carRow.querySelector('.seller').textContent = 'NA';
        carRow.querySelector('.rating').textContent = 'NA';
        carRow.querySelector('.street').textContent = 'NA';
        carRow.querySelector('.state').textContent = 'NA';
        carRow.querySelector('.color').textContent = 'NA';
        carRow.querySelector('.minMPG').textContent = 'NA';
        carRow.querySelector('.maxMPG').textContent = 'NA';
        carRow.querySelector('.fuel').textContent = 'NA';
        carRow.querySelector('.mileage').textContent = 'NA';
    } else {
        console.error(`Car with number ${carNumber} not found.`);
    }
}

const submitButton = document.getElementById("nextButton");
submitButton.addEventListener("click", generateValues);
function generateValues() {
    let minprice = document.getElementById("min").value;
    let maxprice = document.getElementById("max").value;
    const mpg = document.getElementById("mpg").value;
    const electric = document.getElementById("Electric").checked;
    const gas = document.getElementById("Gas").checked;
    const hybrid = document.getElementById("Hybrid").checked;
    const brand = document.getElementById("dropdownButton").textContent;
    const red = document.getElementById("Red").checked;
    const black = document.getElementById("Black").checked;
    const white = document.getElementById("White").checked;
    const grey = document.getElementById("Grey").checked;
    const brown = document.getElementById("Brown").checked;
    let colors = [];
    let fuelTypes = [];

    if(minprice >= maxprice)
    {
        minprice = maxprice - 4000;
    }

    if(electric||gas||hybrid)
    {
        if(electric)
            fuelTypes.push("Electric");
        if(gas)
            fuelTypes.push("Gasoline");
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

    fetchCarData(minprice, maxprice, mpg, brand, colors, fuelTypes)
}

function selectOption(option) {
    event.preventDefault();
    const dropdownButton = document.getElementById("dropdownButton");
    dropdownButton.textContent = option; 
    document.getElementById("myDropdown").classList.remove("show");
}

    function myfunction(event) {
    event.preventDefault()
    const dropdownContent = document.getElementById("myDropdown");
    dropdownContent.classList.toggle("show");
}