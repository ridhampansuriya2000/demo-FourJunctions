function calculateWaterLevelStore(blockHeights) {
    let n = blockHeights.length;
    let leftMax = new Array(n).fill(0);
    let rightMax = new Array(n).fill(0);
    let filledWater = new Array(n).fill(0);

    let maxLeftBoundary = -1;
    for (let i = 0; i < n; i++) {
        leftMax[i] = maxLeftBoundary;
        maxLeftBoundary = Math.max(maxLeftBoundary, blockHeights[i]);
    }

    let maxRightBoundary = -1;
    for (let i = n - 1; i >= 0; i--) {
        rightMax[i] = maxRightBoundary;
        maxRightBoundary = Math.max(maxRightBoundary, blockHeights[i]);
    }

    for (let i = 0; i < n; i++) {
        let maxWaterLevel = Math.min(leftMax[i],rightMax[i])
        filledWater[i] = (i === 0 || (i === n -1) || (blockHeights[i] > maxWaterLevel) ) ? 0 : maxWaterLevel - blockHeights[i] ;
    }

    let tableMaxHeight = Math.max(...blockHeights);
    let waterGridTableArr = Array.from({ length: tableMaxHeight }, () => Array(n).fill(""));for (let i = 0; i < tableMaxHeight; i++) {
        for (let j = 0; j < n; j++) {
            const blockStart = tableMaxHeight - blockHeights[j];
            const waterStart = blockStart - filledWater[j];

            if (i >= blockStart) {
                waterGridTableArr[i][j] = "block";
            } else if (i >= waterStart) {
                waterGridTableArr[i][j] = "water";
            } else {
                waterGridTableArr[i][j] = "";
            }
        }
    }
    let totalWater = filledWater.reduce((a,b)=>a+b,0)

    return { leftMax, rightMax, filledWater, totalWater, waterGridTableArr };
}

function renderTable(heights, waterGridTableArr) {
    console.log("waterGridTableArr",waterGridTableArr)
    const tableContainer = document.getElementById("tableContainer");
    tableContainer.innerHTML = "";

    let table = document.createElement("table");
    table.style.borderCollapse = "collapse";

    for (let row of waterGridTableArr) {
        let tr = document.createElement("tr");
        for (let cell of row) {
            let td = document.createElement("td");
            td.style.width = "30px";
            td.style.height = "30px";
            td.style.border = "1px solid black";
            td.style.textAlign = "center";

            if (cell === "block") {
                td.style.backgroundColor = "yellow";
            } else if (cell === "water") {
                td.style.backgroundColor = "blue";
            }

            tr.appendChild(td);
        }
        table.appendChild(tr);
    }

    tableContainer.appendChild(table);
}

function simulateWaterTrap() {
    const input = document.getElementById("heightInput").value;
    const heights = input.split(",").map(Number);

    if (heights.some(isNaN)) {
        alert("Please enter valid numbers separated by commas.");
        return;
    }

    const { totalWater, waterGridTableArr } = calculateWaterLevelStore(heights);
    document.getElementById("output").textContent = `Trapped Water: ${totalWater} Units`;

    renderTable(heights, waterGridTableArr);
}


/** Explanation

 1.simulateWaterTrap:
 -  simulateWaterTrap get value from input and calculate Water LevelStore using calculateWaterLevelStore and render table to dome using renderTable

 2.calculateWaterLevelStore:
 - calculate how much total water should store and in which area
    logic :
        - we move lest to right for find in every colum how much total unit water should store
        - so we need to get left side maximum colum height and right side maximum column height for every column so we can get maximum level of water for every column
        - then we find maxWaterLevel by maxLevel of water for that point - that colum height
        - then we calculate waterGridTableArr two dimension array for render table for show column and stored water (follow top to bottom approach for fill vlaue)
 3.renderTable
 - renderTable take total max height of any column as table height and waterGridTableArr for render value in table


 */