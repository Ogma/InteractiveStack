<?php
/**
 * @file PHP script to compile and dump a c file
 * http://pastebin.com/EsPXgDUk
 */

echo process("#include <stdio.h>
// hax
// <script>alert('test');</script>
int main()
{
    printf(\"Hello pain\\n\");
    return 0;

}");

function build_flags() {
  $name = salted_md5(time() . rand());
  return array(
    'file' => full_file_path() . $name . '.c',
    'output' => full_file_path() . $name,
    'flags' => array(
      'm32',
      'g',
      'o' => array(
        full_file_path() . $name,
      ),
    ),
  );
}

function salted_md5($string, $salt = '__S@l713$--') {
  return md5($string . $salt);
}

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
function compile($code, $flags = NULL){
  if ($flags == NULL) {
    $flags = build_flags();
  }
  write_code_to_file($code, $flags);
  $compile_string = get_compile_command($flags);
  return array(
    'output' => run_command($compile_string . ' 2>&1'),
    'flags' => $flags,
    'filename' => $flags['file'],
    'output_file' => $flags['output'],
  );
}

function process($code) {
  echo 'compiling';
  // Should we save to the DB?
  $compile_results = compile($code);
  if ($compile_results['output'] != NULL
    || !file_exists($compile_results['output_file'])) {
    return 'ERROR';
  }
  echo 'compile successful';
  ?><pre><?php
  echo readfile($compile_results['filename'] . '.safe');
  ?></pre><?php
}

/**
 * @TODO
 */
function sanitize_c(&$code) {
  $code = htmlentities($code);
  return $code;
}

function write_code_to_file($code, $flags) {
  write_to_file($flags['file'], $code);
  $safe = $flags['file'] . '.safe';
  sanitize_c($code);
  write_to_file($safe, $code);
}

function write_to_file($file, $string) {
  create_file($file);
  $file_process = fopen($file, 'w') or die('Unable to open file!');
  fwrite($file_process, $string);
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
