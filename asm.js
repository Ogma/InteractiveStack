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

/**
 * ITS EVERYTHING YO!!1!!one!
 * "Whatever your heart desires." - Meranda
 */
var globals = {
  'register' : {
    'eax' : 40,
    'ebx' : null,
    'ecx' : null,
    'edx' : null,
    'esi' : null,
    'edi' : null,
    'ebp' : null,
    'esp' : null,
    'eip' : null,
  },
  'flags' : {
    'OF' : 0,
    'DF' : 0,
    'IF' : 0,
    'TF' : 0,
    'SF' : 0,
    'ZF' : 0,
    'AF' : 0,
    'PF' : 0,
    'CF' : 0,
  },
  'stack' : {
    '0xdeadbeef' : '0xff',
    '0xff00ff00' : '0x0f',
  },
  'bss' : {},
  'data' : {},
};

/**
 * Push places the argument at the top of the stack.
 *
 * data string Can be int, register, memory location.
 */
hook.register('push', function(data) {
  globals['stack']['0xffffffff'] = getTrueData(data);
});

/**
 * Mov copies source data to the destination.
 *
 * dest string Can be register, memory location.
 * src string Can be int, register or memory location.
 */
hook.register('mov', function(dest, src) {
  src = getTrueData(src);
  type = dataType(dest);
  switch (type) {
    case 'register':
      globals['register'][dest] = src;
      break;
    case 'stack':
      globals['stack'][dest] = src;
      break;
  } 
});

/**
 * Sub takes the subtrahend and subtracts it from
 * the minuend, then stores it in minuend.
 *
 * minuend string Can be register or memory location.
 * subtrahend string Can be int, register or memory location.
 */
hook.register('sub', function(minuend, subtrahend) {
  minuendType = dataType(minuend);
  minuendValue = getTrueData(minuend);
  subtrahendValue = getTrueData(subtrahend);
  subtrahendType = dataType(subtrahend);
  if (subtrahendType == 'stack' || dataType(subtrahendValue) == 'stack') {
    subtrahend =  parseInt(subtrahendValue, 16);
  }
  switch (minuendType) {
    case 'stack':
      globals['stack'][minuend] = "0x" + (globals['stack'][minuend] - subtrahend).toString(16);
      break;
    case 'register':
      globals['register'][minuend] = "0x" + (minuendValue - subtrahend).toString(16);
      break;
  }
});

/**
 * Add takes the subtrahend and adds it to
 * the minuend, then stores it in minuend.
 *
 * minuend string Can be register or memory location.
 * subtrahend string Can be int, register or memory location.
 */
hook.register('add', function(minuend, subtrahend) {
  minuendType = dataType(minuend);
  minuendValue = getTrueData(minuend);
  subtrahendValue = getTrueData(subtrahend);
  subtrahendType = dataType(subtrahend);
  if (subtrahendType == 'stack' || dataType(subtrahendValue) == 'stack') {
    subtrahend =  parseInt(subtrahendValue, 16);
  }
  switch (minuendType) {
    case 'stack':
      if (dataType(globals['stack'][minuend]) == 'stack') {
        minuendValue = parseInt(globals['stack'][minuend], 16);
      }
      else {
        minuendValue = globals['stack'][minuend];
      }
      globals['stack'][minuend] = "0x" + (minuendValue + subtrahend).toString(16);
      break;
    case 'register':
      globals['register'][minuend] = "0x" + (minuendValue + subtrahend).toString(16);
      break;

  }
});

hook.register('call', function(data, moveAddr) {
  switch (dataType(data)) {
    case 'stack':
      globals['register']['eip'] = data;
      break;
    case 'stack_by_reference':
      globals['register']['eip'] = getTrueData(data);
      break;
  }
});

/**
 *  Figures out what data type the entry is
 *  then casts the var appropriately.
 *
 *  data string? either register, int, or memory location.
 */
function dataType(data) {
  data = data.toString();
  if (data in globals['register']) {
    return 'register';
  }
  if (data.match(/^0x([0-9a-fA-F]{2}){1,}$/)) {
    return 'stack';
  }
  if (data.match(/^\[0x([0-9a-fA-F]{2}){1,}\]$/)) {
    return 'stack_by_reference';
  }
  if (data.match(/[0-9]{1,}/)) {
    return 'int';
  }
  console.log(data, 'I AM ERROR');
  throw 'Could not process data see console log';
}

function getTrueData(data) {
  var trueData = null;
  var type = dataType(data);
  switch(type) {
    case 'register':
      trueData = globals['register'][data];
      break;
    case 'int':
      trueData = parseInt(data);
      break;
    case 'stack':
      trueData = String(data);
      break;
    case 'stack_by_reference':
      data = data.replace(/\[|\]/g, '');
      trueData = globals['stack'][data];
  }
  return trueData;
}
