var InstructionAddress = {
  '0x00' : {
    'func' : 'sub',
    'args' : ['0xdeadbeef', 1],
  },
  '0x00000001' : {
    'func' : 'call',
    'args' : ['0x00000003'],
  },
  '0x00000002' : {
    'func' : 'sub',
    'args' : ['0xdeadbeef', 1],
  },
  '0x00000003' : {
    'func' : 'add',
    'args' : ['0xdeadbeef', 1],
  },
  '0x00000004' : {
    'func' : 'call',
    'args' : ['0x00000002'],
  },
};
var InstructionList = [];
for (var memory in InstructionAddress) {
  InstructionAddress[memory];
}

function callInstruction(address) {
  var insArgs = InstructionAddress[address].args;
  insArgs.unshift(InstructionAddress[address].func);
  hook.call.apply(0, insArgs);
  insArgs.shift();
  UpdateInstructionList(address);
  if (InstructionAddress[address].func != 'call') {
    globals.register.eip = getNextInstruction(globals.register.eip);
  }
}

function UpdateInstructionList(address) {
  InstructionList.push({
    'address' : address,
    'globals' : globals,
  });
}

function init() {
  for (first in InstructionAddress) break;
  globals.register.eip = first;
  nextStep();
}

function getNextInstruction(pos) {
  next = false;
  for (item in InstructionAddress) {
    if (next) { break; }
    next = (item == pos ? true : false);
  }
  return item;
}

function nextStep() {
  console.log(globals.register.eip, 'current eip');
  callInstruction(globals.register.eip);
}
init();
