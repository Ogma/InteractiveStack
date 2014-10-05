<?php
/**
 * @file PHP script to compile and dump a c file
 */

$flags = array(
  'file' => full_file_path() . 'whateverBAH2.c',
  'flags' => array(
    'm32',
    'g',
    'o' => array(
      full_file_path() . 'whatever2',
    ),
  ),
);

echo compile("#include <stdio.h>

int main()
{
    printf(\"Hello Wasdorld\");
    return 0;

}", $flags);


/**
 * creates string for the compiler
 * $flags array of flags
 */
function get_compile_command($flags) {
  $flagstring = '';
  foreach ($flags['flags'] as $key => $flag) {
    if (is_array($flag)) {
      $flagstring .= ' ' . '-' . $key . ' ' . implode(' ', $flag); 
    }
    else {
      $flagstring .= ' ' . '-' . $flag;
    }
  }
  $flagstring .= ' ';
  return compiler() . $flagstring . $flags['file'];
}

/**
 *  Compile code using compiler().
 *  $code long of C code.
 *  $flags array of flags and settings.
 */
function compile($code, $flags){
  create_file($flags['file']);
  $file_process = fopen($flags['file'], 'w') or die('Unable to open file!');
  fwrite($file_process, $code);
  fclose($file_process);
  $compile_string = get_compile_command($flags);
  echo $compile_string;
  return shell_exec($compile_string);
}

/**
 *  Create file and set permissions
 */
function create_file($filename) {
  $file_process = fopen($filename, 'w') or die('Cannot create file');
  fclose($file_process);
  chmod($file_name, 0777);
}

/**
 * Full folder path of where files
 * should be uploaded and compiled.
 */
function full_file_path() {
  return 'tmp/';
}

/**
 *  Compiler to use.
 */
function compiler() {
  return 'gcc';
}
