const fs = require('fs');

let maxNumber = 0;
let minNumber = 0;
let arithmetic = 0;
let median = 0;
let incrementSequence;
let decrementSequence;

const startTime = performance.now();

async function readFileAndCalculateValues() {
    await fs.readFile('./10m.txt', {encoding: 'utf-8'}, (err, data) => {
        const formattedData = data.split('\n').map(el => Number(el));

        incrementSequence = getSequence(formattedData);
        decrementSequence = getSequence(formattedData, false);

        formattedData.sort((a, b) => a - b);

        median = findMedian(formattedData);

        for (let char of formattedData) {
            maxNumber = Math.max(maxNumber, char);
            minNumber = Math.min(minNumber, char);

            arithmetic += char;
        }

        arithmetic = arithmetic / formattedData.length;

        const calculatedTime = ((performance.now() - startTime) / 1000).toFixed(2);

        console.log(`Calculated in ${calculatedTime} seconds`, {
            'максимальне число в файлі': maxNumber,
            'мінімальне число в файлі': minNumber,
            'середнє арифметичне значення': arithmetic,
            'медіана': median,
            'найбільшу послідовність чисел, яка збільшується': incrementSequence,
            'найбільшу послідовність чисел, яка зменьшується': decrementSequence
        });
    });
}

function findMedian(arr) {
    const middleIndex = Math.floor(arr.length / 2);

    if (arr.length % 2 === 0) {
        return Number(arr[middleIndex - 1] + arr[middleIndex]) / 2;
    } else {
        return Number(arr[middleIndex]);
    }
}

function getSequence(arr, isAsk = true) {
    const result = [];
    const maxSequence = [];
    let lastNumberInSequence = 0;
    let biggestSequenceLength = 0;

    for (let i = 0; i < arr.length; i++) {
        const condition = isAsk ? arr[i] <= arr[i + 1] : arr[i] >= arr[i + 1];

        if (condition) {
            lastNumberInSequence = arr[i + 1];

            maxSequence.push(arr[i]);
        } else {
            if (lastNumberInSequence === +arr[i]) {
                maxSequence.push(lastNumberInSequence);

                const lastSequenceLength = result[result.length - 1]?.length || 0;

                if (maxSequence.length > lastSequenceLength) {
                    result.push([...maxSequence]);

                    biggestSequenceLength = Math.max(biggestSequenceLength, maxSequence.length);
                }

                maxSequence.length = 0;
            }
        }
    }

    return result.find(el => el.length === biggestSequenceLength);
}

readFileAndCalculateValues();