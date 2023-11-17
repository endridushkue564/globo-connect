```javascript
/*
   Filename: sophisticated_code.js

   Description: This code implements a sophisticated and complex algorithm to solve the Traveling Salesman Problem (TSP) using the Ant Colony Optimization (ACO) technique. It utilizes various advanced data structures, algorithms, and heuristics to find an optimized solution for the TSP for a given set of cities.

   Author: [Your Name]

   Date: [Current Date]

*/

// Import libraries or required modules
const fs = require('fs');
const readline = require('readline');

// Define constants and global variables
const NUM_ANTS = 5;
const NUM_ITERATIONS = 100;
const INITIAL_PHEROMONE = 0.1;
const ALPHA = 1;
const BETA = 5;
const EVAPORATION_RATE = 0.1;

let cities = [];
let distances = [];
let pheromones = [];

// Define classes and data structures
class City {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  distanceTo(city) {
    const dx = Math.abs(this.x - city.x);
    const dy = Math.abs(this.y - city.y);
    return Math.sqrt(dx * dx + dy * dy);
  }
}

class Ant {
  constructor(startCity) {
    this.visitedCities = [];
    this.currentCity = startCity;
    this.visitedCities.push(this.currentCity);
  }

  moveToNextCity() {
    // Implementation of ACO pheromone-based city selection
    const possibleCities = cities.filter(city => !this.visitedCities.includes(city));
    const probabilities = [];
    let totalProbability = 0;

    possibleCities.forEach(city => {
      const pheromone = pheromones[this.currentCity][city];
      const distance = distances[this.currentCity][city];
      const probability = Math.pow(pheromone, ALPHA) * Math.pow(1 / distance, BETA);
      probabilities.push(probability);
      totalProbability += probability;
    });

    const random = Math.random() * totalProbability;
    let currSum = 0;
    let selectedCity;

    for (let i = 0; i < possibleCities.length; i++) {
      currSum += probabilities[i];
      if (random <= currSum) {
        selectedCity = possibleCities[i];
        break;
      }
    }

    this.currentCity = selectedCity;
    this.visitedCities.push(selectedCity);
  }

  calculateTourLength() {
    let tourLength = 0;

    for (let i = 0; i < this.visitedCities.length - 1; i++) {
      const currentCity = this.visitedCities[i];
      const nextCity = this.visitedCities[i + 1];
      tourLength += distances[currentCity][nextCity];
    }

    return tourLength;
  }
}

// Utility functions
function initializePheromones() {
  pheromones = new Array(cities.length);

  for (let i = 0; i < cities.length; i++) {
    pheromones[i] = new Array(cities.length);
    for (let j = 0; j < cities.length; j++) {
      pheromones[i][j] = INITIAL_PHEROMONE;
    }
  }
}

function updatePheromones(trails, bestAntIndex) {
  for (let i = 0; i < cities.length; i++) {
    for (let j = 0; j < cities.length; j++) {
      if (i !== j) {
        pheromones[i][j] += trails[bestAntIndex][i][j];
        pheromones[i][j] *= (1 - EVAPORATION_RATE);
      }
    }
  }
}

function solveTSP() {
  let bestTourLength = Infinity;
  let bestTour;
  let bestAntIndex;

  for (let iteration = 0; iteration < NUM_ITERATIONS; iteration++) {
    const ants = [];

    for (let i = 0; i < NUM_ANTS; i++) {
      const startCity = cities[Math.floor(Math.random() * cities.length)];
      ants.push(new Ant(startCity));
    }

    const trails = new Array(NUM_ANTS);
    for (let i = 0; i < NUM_ANTS; i++) {
      trails[i] = new Array(cities.length);
      for (let j = 0; j < cities.length; j++) {
        trails[i][j] = new Array(cities.length).fill(0);
      }
    }

    ants.forEach(ant => {
      for (let step = 0; step < cities.length - 1; step++) {
        ant.moveToNextCity();
      }

      const tourLength = ant.calculateTourLength();
      if (tourLength < bestTourLength) {
        bestTourLength = tourLength;
        bestTour = [...ant.visitedCities];
        bestAntIndex = ants.indexOf(ant);
      }

      for (let i = 0; i < cities.length - 1; i++) {
        const fromCity = ant.visitedCities[i];
        const toCity = ant.visitedCities[i + 1];
        trails[ants.indexOf(ant)][fromCity][toCity] += 1 / tourLength;
      }
    });

    updatePheromones(trails, bestAntIndex);
  }

  console.log(`Best tour length: ${bestTourLength}`);
  console.log(`Best tour: ${bestTour}`);
}

// Read city coordinates from a file
async function readCityCoordinates() {
  const fileStream = fs.createReadStream('city_coordinates.txt');
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    const coordinates = line.split(',');
    const city = new City(parseFloat(coordinates[0]), parseFloat(coordinates[1]));
    cities.push(city);
  }

  distances = new Array(cities.length);

  for (let i = 0; i < cities.length; i++) {
    distances[i] = new Array(cities.length);
    for (let j = 0; j < cities.length; j++) {
      distances[i][j] = cities[i].distanceTo(cities[j]);
    }
  }

  initializePheromones();
  solveTSP();
}

// Start program execution
readCityCoordinates();
```

This code implements the Ant Colony Optimization (ACO) algorithm to solve the Traveling Salesman Problem (TSP). It includes classes for City and Ant, utility functions for initializing pheromones and updating them, and a main function `solveTSP` that performs the optimization process. The program reads city coordinates from a `city_coordinates.txt` file and calculates the tour length and optimal tour using ACO. The code also demonstrates the use of advanced data structures like arrays and the readline module for file input.