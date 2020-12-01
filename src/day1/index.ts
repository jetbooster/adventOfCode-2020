import {readFileSync} from 'fs';
import {join} from 'path';

const fyl = readFileSync(join(__dirname,'./input.txt'), 'utf-8');

const array = fyl.split('\n').map(Number);

// Part 1
array.find((num1,index)=>
    [...new Array(array.length-index-1)].find((_,index2)=>{
        const num2 = array[index+index2+1];
        return (num1+num2===2020)?console.log(`2Product: ${num1*num2}`):false
    })
)

// Part 2
array.find((num1,index)=>
    [...new Array(array.length-index-1)].find((_,index2)=>{
        const num2 = array[index+index2+1];
        return [...new Array(array.length-index-index2-2)].find((_,index3)=>{
            const num3 = array[index+index2+index3+1]
            return (num1+num2+num3===2020)?console.log(`3Product: ${num1*num2*num3}`):false
        })
    })
)

// Both parts combined
array.find((num1,index)=>
    [...new Array(array.length-index-1)].find((_,index2)=>{
        const num2 = array[index+index2+1];
        (num1+num2===2020)?console.log(`2Product: ${num1*num2}`):false;
        return [...new Array(array.length-index-index2-2)].find((_,index3)=>{
            const num3 = array[index+index2+index3+1]
            return (num1+num2+num3===2020)?console.log(`3Product: ${num1*num2*num3}`):false
        })
    })
)