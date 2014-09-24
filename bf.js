var util = require('util');

var command_list = '><+-.,[]';
var src = "++++++++[>++++[>++>+++>+++>+<<<<-]>+>+>->>+[<]<-]>>.>---.+++++++..+++.>>.<-.<.+++.------.--------.>>+.>++.";
var pc = 0;
//------------------
var user_in = "";
var user_in_ptr = 0;
//------------------
var data_ptr = 0;
var data = new Array();

while (pc < src.length) {
    var instruction = src.charAt(pc++);
    if (command_list.indexOf(instruction) > -1) {
        execute(instruction);
        //console.log("instruction " + instruction);
        //console.log("data_ptr " + data_ptr);
        //console.log(data);
    }
}
console.log(data);

function execute(instruction) {
    switch (instruction) {
        case '>': incPointer();
                  break;
        case '<': decPointer();
                  break;
        case '+': incData();
                  break;
        case '-': decData();
                  break;
        case '.': outData();
                  break;
        case ',': inData();
                  break;
        case '[': conditionStart();
                  break;
        case ']': conditionEnd();
                  break;
    }
}


function incPointer() {
    data_ptr++;
}

function decPointer() {
    data_ptr--;
    if (data_ptr < 0 ){
        error("Cannot point to left of index 0");
    }
}

function incData() {
    initCell();
    data[data_ptr]++;
}

function decData() {
    initCell();
    if (data[data_ptr] > 0 ){
        data[data_ptr]--;
    }
    if (data[data_ptr] < 0 ){
        error("Cannot have data less than 0");
    }
}

function outData() {
    initCell();
    putc(String.fromCharCode(data[data_ptr]));
}

function inData() {
    var c = getc();
    data[data_ptr] = c.charCodeAt(0);
}

function conditionStart() {
    initCell();
    if (data[data_ptr] === 0) {
        jumpToMatchingEnd();
    }
}

function conditionEnd() {
    initCell();
    if (data[data_ptr] !== 0) {
        jumpToMatchingStart();
    }
}

function jumpToMatchingEnd() {
    var loop_start = pc - 1;
    var current = loop_start + 1;
    var stack_count = 1;
    while ((current < src.length) && (stack_count !== 0)) {
        if (src[current] === '[') {
            stack_count++;
        } else if (src[current] === ']') {
            stack_count--;
        }
        current++;
    }
    if (stack_count === 0) {
        pc = current;
    } else {
        error("Error: Unbalanced [ at character: " + loop_start);
    }
}

function jumpToMatchingStart() {
    var loop_end = pc - 1;
    var current = loop_end - 1;
    var stack_count = 1;
    while ((current > -1) && (stack_count !== 0)) {
        if (src[current] === ']') {
            stack_count++;
        } else if (src[current] === '[') {
            stack_count--;
        }
        current--;
    }
    if (stack_count === 0) {
        pc = current + 2;
    } else {
        error("Error: Unbalanced ] at character: " + loop_end);
    }
}

function error(msg) {
    console.error(msg);
    console.log(data);
    process.exit(1);
}

function initCell() {
    if (typeof data[data_ptr] === 'undefined') {
        data[data_ptr] = 0;
    }
}

function putc(str) {
    util.print(str);
}

function getc() {
    var c = user_in.charAt(user_in_ptr++);
    if (c === '') {
        error('End of user input');
    } else {
        return c;
    }
}

