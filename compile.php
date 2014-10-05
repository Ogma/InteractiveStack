<?php
/**
 * @file PHP script to compile and dump a c file
 * http://pastebin.com/EsPXgDUk
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
    printf(\"Hello pain\");
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
  sanitize_c($code);
  write_code_to_file($code, $flags);
  $compile_string = get_compile_command($flags);
  return run_command($compile_string . ' 2>&1');
}

/**
 * @TODO
 */
function sanitize_c($code) {
  return $code;
}

function write_code_to_file($code, $flags) {
  create_file($flags['file']);
  $file_process = fopen($flags['file'], 'w') or die('Unable to open file!');
  fwrite($file_process, $code);
  fclose($file_process);
}

/**
 * shell_exec wrapper to fix the env.
 */
function run_command($command) {
  putenv('PATH="/usr/sbin:/usr/bin:/sbin"');
  shell_exec($command);
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
