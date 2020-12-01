/* eslint-disable */
// This is just for giggles, never do this
import{readFileSync as f}from'fs';import{join as n}from'path';var fyl=f(n(__dirname,'./input.txt'),'utf-8');var a=fyl.split('\n').map(Number);var l=console.log;
a.find((x,i)=>[...new Array(a.length-i-1)].find((_,j)=>{var y=a[i+j+1];(x+y==2020)?l(x*y):0;[...new Array(a.length-i-j-2)].find((_,k)=>{var z=a[i+j+k+1];(x+y+z==2020)?l(x*y*z):0})}))