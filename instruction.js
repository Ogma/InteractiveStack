var InstructionAddress = {
  '0x00' : {
    'func' : 'sub',
    'args' : ['0xdeadbeef', 1],
  },
  '0xHA' : [],
  '0x01' : [],
};
var InstructionList = [];
for (var memory in InstructionAddress) {
  console.log(InstructionAddress[memory]);
}

function callInstruction(address) {
  var insArgs = InstructionAddress[address].args;
  insArgs.unshift(InstructionAddress[address].func);
  hook.call.apply(this, insArgs);
  UpdateInstructionList(address);
}

function UpdateInstructionList(address) {
  InstructionList.push({
    'address' : address,
    'globals' : globals,
  });
}

console.log(globals.stack);
callInstruction('0x00');
console.log(globals.stack);
console.log(InstructionList);