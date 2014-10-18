function AsmException(message, name, arguments) {
  console.log(name, 'error name');
  console.log(arguments, 'error arg');
  this.message = message;
  this.name = "AsmException";
}

/**
 * Super sexy hook system.
 */
var hook = {
  hooks : [],
  register : function (name, callback) {
    name = name.toUpperCase();
    if (typeof(hook.hooks[name]) == 'undefined') {
      hook.hooks[name] = [];
    }
    hook.hooks[name].push(callback);
  },
  call : function (name) {
    var success = false;
    name = name.toUpperCase();
    args = [];
    for(var i in arguments) { args[i] = arguments[i]; }
    args.shift();
    if (typeof(hook.hooks[name]) != 'undefined') {
      for (var i in hook.hooks[name]) {
        hook.hooks[name][i].apply(this, args);
        success = true;
      }
    }
    if (!success) {
      throw new AsmException(
        "Unknown instruction.  Please don't be angry...",
        name,
        arguments
      );
    }
  },
};

var register = {
  'eax' : null,
  'ebx' : null,
  'ecx' : null,
  'edx' : null,
  'esi' : null,
  'edi' : null,
  'ebp' : null,
  'esp' : null,
  'eip' : null,
};

var flags = {
  'OF' : 0,
  'DF' : 0,
  'IF' : 0,
  'TF' : 0,
  'SF' : 0,
  'ZF' : 0,
  'AF' : 0,
  'PF' : 0,
  'CF' : 0,
};

/**
 * ITS DA STACK YO!!1!!one!
 * obj of memory addresses.
 */
var stack = {};

/**
 * "Whatever your heart desires." - Meranda
 */
var globals = {};

/**
 * Push places the argument at the top of the stack.
 *
 * data string Can be int, register, memory location.
 */
var push = function(data) {
  register.eax = 'test';
};
hook.register('push', push);

/**
 * Mov copies source data to the destination.
 *
 * dest string Can be register, memory location.
 * src string Can be int, register or memory location.
 */
var mov = function(dest, src) {
  console.log('test');
};
hook.register('mov', mov);

/**
 * Sub takes the subtrahend and subtracts it from
 * the minuend, then stores it in minuend.
 *
 * minuend string Can be register or memory location.
 * subtrahend string Can be int, register or memory location.
 */
var sub = function(minuend, subtrahend) {
  console.log('test');
};
hook.register('sub', sub);

/**
 *  Figures out what data type the entry is
 *  then casts the var appropriately.
 *
 *  data string? either register, int, or memory location.
 */
function data_var(data) {
  if (data in register) {
    return 'register';
  }
  if (data.match(/[0-9]{1,}/)) {
    return 'int';
  }
  if (data.match(/0x[0-9a-fA-F]{7}/)) {
    return 'stack';
  }
  console.log(data, 'I AM ERROR');
  throw 'Could not process data see console log';
}
