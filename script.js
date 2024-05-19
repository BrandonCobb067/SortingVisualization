document.addEventListener("DOMContentLoaded", resetArray);

let array = []; // Array value storage
let isSorting = false; // Flag variable to track insertion sort status
let arrayLength = 50; // default arrarysize
let algorithm = "Insertion Sort"; // default algorithm
let speed = 10; // default speed
let sortedNodes = []; // Storage of colored nodes

// DESC: choose algorithm
function chooseAlgorithm(alg) {
    algorithm = alg;
}

// DESC: Start sorting chosen algorithm
function startVisualization() {
    if (!isSorting) {
        switch (algorithm) {
            case "Insertion Sort":
                insertionSort();
                break;
            case "Merge Sort":
                mergeSort();
                break;
            case "Heap Sort":
                heapSort();
                break;
            case "Bubble Sort":
                bubbleSort();
                break;
            default:
                console.error("Invalid sorting algorithm selected");
        }
        
    }
}

// DESC: Change array size
function changeArrayLength(newLength) {
    if (isSorting) { // If insertion sort is running, stop it
        isSorting = false;
    }
    arrayLength = newLength;
    generateRandomArray();
    renderBarGraph();
}

// DESC: Change sorting speed
function changeSortingSpeed(newSpeed) {
    speed = 200 - newSpeed;
}

// DESC: Delay based on sorting speed
function delay() {
    return new Promise(resolve => {
        setTimeout(resolve, speed); // Adjust the delay as needed
    });
}

// DESC: Generates random array of size L
function generateRandomArray() {
    const min = 1;
    const max = 100;
    array = [];
    for (let i = 0; i < arrayLength; i++) {
        array.push(Math.floor(Math.random() * (max - min + 1) + min));
    }
}

// DESC: Stop Sorting, generate new array of size L
function resetArray() {
    if (isSorting) { // If sort is running, stop it
        isSorting = false;
    }
    generateRandomArray();
    renderBarGraph();
}

// DESC: Reset colors and render bar graph
function renderBarGraph() {
    const arrayContainer = document.getElementById('array-container');
    arrayContainer.innerHTML = '';
    array.forEach(value => {
        const bar = document.createElement('div');
        bar.classList.add('array-bar');
        bar.style.height = `${value*10}px`;
        arrayContainer.appendChild(bar);
    });
}

// DESC: Render bar graph and retain sorted node colors
function renderHeapSort(sortRender = []) {
    const arrayBars = document.querySelectorAll('.array-bar');
    array.forEach((value, index) => {
        const bar = arrayBars[index];
        if (bar) {
            bar.style.height = `${value * 10}px`;
            if (sortRender.includes(index)) {
                bar.classList.add('sorted');
            } else {
                bar.classList.remove('sorted');
            }
        }
    });
}

// DESC: Perform wave effect across nodes
function waveEffect() {
    const bars = document.querySelectorAll('.array-bar');
    bars.forEach((bar, index) => {
        setTimeout(() => {
            bar.classList.add('sorted');
        }, index * 20); // Adjust the delay as needed for the wave effect
    });
}

// DESC: INSERTION SORT
async function insertionSort() {
    isSorting = true; // Set flag to true when insertion sort starts
    for (let i = 1; i < array.length; i++) {
        if (!isSorting) return; // Exit the function if reset button was clicked
        let key = array[i];
        let j = i - 1;
        // Add class to key node
        document.querySelectorAll('.array-bar')[i].classList.add('key');
        while (j >= 0 && array[j] > key) {
            await insertionSwap(j + 1, j);
            j = j - 1;
        }
        // Remove class from key node before updating key
        document.querySelectorAll('.array-bar')[i].classList.remove('key');
        
        array[j + 1] = key; // next key
        renderBarGraph();
        
        document.querySelectorAll('.array-bar')[j + 1].classList.add('sorted');
    }

    renderBarGraph();

    isSorting = false; // Set flag to false when insertion sort completes
    waveEffect();
}

// DESC: Swap function to visual moving of nodes
async function insertionSwap(i, j) {
    return new Promise(resolve => {
        setTimeout(() => { // j is key, i is compare
            const temp = array[i];
            array[i] = array[j];
            array[j] = temp;
            renderBarGraph();
            // Add class back to the key node after swap
            document.querySelectorAll('.array-bar')[i-1].classList.add('key');
            resolve();
        }, speed); // Adjust the delay as needed
    });
}

// DESC: MERGE SORT
async function mergeSort() {
    isSorting = true;
    await mergeSortRecursive(0, array.length - 1);
    if (!isSorting) return;
    waveEffect();
}

// DESC: Recursize merge sort
async function mergeSortRecursive(start, end) {
    if (start >= end) return;

    const mid = Math.floor((start + end) / 2);
    if (!isSorting) return;
    await mergeSortRecursive(start, mid);
    await mergeSortRecursive(mid + 1, end);

    await merge(start, mid, end);
}

// DESC: Merge 2 sections of array in merge sort
async function merge(start, mid, end) {
    const leftArray = array.slice(start, mid + 1);
    const rightArray = array.slice(mid + 1, end + 1);

    let i = 0,
        j = 0,
        k = start;

    while (i < leftArray.length && j < rightArray.length) {
        if (!isSorting) return;
        if (leftArray[i] <= rightArray[j]) {
            array[k++] = leftArray[i++];
        } else {
            array[k++] = rightArray[j++];
        }
        renderBarGraph();
        await delay();
    }

    while (i < leftArray.length) {
        if (!isSorting) return;
        array[k++] = leftArray[i++];
        renderBarGraph();
        await delay();
    }

    while (j < rightArray.length) {
        if (!isSorting) return;
        array[k++] = rightArray[j++];
        renderBarGraph();
        await delay();
    }
}

async function heapSort() {
    isSorting = true; // Set flag to true when heap sort starts
    const n = array.length;
    sortedNodes = [];

    // Build max heap
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        await heapify(n, i);
        if (!isSorting) return;
    }

    renderHeapSort(sortedNodes);

    // Heap sort
    for (let i = n - 1; i > 0; i--) {
        if (!isSorting) return;
        await heapSwap(0, i);
        sortedNodes.push(i);

        document.querySelectorAll('.array-bar')[i].classList.add('sorted');
        await heapify(i, 0);
    }

    renderHeapSort(sortedNodes);

    // Set flag to false when heap sort completes
    isSorting = false;
    waveEffect();
}

// DESC: Maintain heap structure
async function heapify(n, i) {
    if (!isSorting) return;
    let largest = i;
    let left = 2 * i + 1;
    let right = 2 * i + 2;

    if (left < n && array[left] > array[largest]) {
        largest = left;
    }

    if (right < n && array[right] > array[largest]) {
        largest = right;
    }

    if (largest !== i) {
        await heapSwap(i, largest);
        await heapify(n, largest);
    }
}

// DESC: Swap Nodes and maintain colors for heapsort
async function heapSwap(i, j) {
    return new Promise(resolve => {
        setTimeout(() => { // j is key, i is compare
            const temp = array[i];
            array[i] = array[j];
            array[j] = temp;
            // document.querySelectorAll('.array-bar')[i].classList.add('key');
            renderHeapSort(sortedNodes);
            resolve();
        }, speed); // Adjust the delay as needed
    });
}

tmp = []

// DESC: BUBBLE SORT
async function bubbleSort() {
    sortedNodes = [];
    isSorting = true; // Set flag to true when bubble sort starts
    const n = array.length;

    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            if (!isSorting) return;
            // Highlight the bars being compared
            document.querySelectorAll('.array-bar')[j].classList.add('key');
            tmp.push(j);

            // Delay for visualization
            await delay();

            renderBubbleSort(sortedNodes, tmp);
            if (array[j] > array[j + 1]) {
                // Swap bars
                await bubbleSwap(j, j + 1);
            }
            renderBubbleSort(sortedNodes, tmp);
            // Remove highlight after comparison
            document.querySelectorAll('.array-bar')[j].classList.remove('key');
            tmp.pop(j);
        }
        // Mark the last element as sorted
        document.querySelectorAll('.array-bar')[n - i - 1].classList.add('sorted');
        sortedNodes.push(n - i - 1);
    }

    // Set flag to false when bubble sort completes
    isSorting = false;
    waveEffect();
}

// DESC: Swap Nodes and maintain colors for bubble sort
async function bubbleSwap(i, j) {
    return new Promise(resolve => {
        setTimeout(() => { // Add a delay for visualization
            const temp = array[i];
            array[i] = array[j];
            array[j] = temp;
            renderBubbleSort(sortedNodes, tmp); // Update the graph with specific nodes retaining class
            resolve();
        }, speed); // Adjust the delay as needed
    });
}

// DESC: Render for bubble sort to keep red color
async function renderBubbleSort(sortRender = [], compareRender = []) {
    const arrayBars = document.querySelectorAll('.array-bar');
    array.forEach((value, index) => {
        const bar = arrayBars[index];
        if (bar) {
            bar.style.height = `${value * 10}px`;
            if (compareRender.includes(index)) {
                bar.classList.add('key');
            } else {
                bar.classList.remove('key');
            }

            if (sortRender.includes(index)) {
                bar.classList.add('sorted');
            } else {
                bar.classList.remove('sorted');
            }
        }
    });
}