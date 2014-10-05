#include <stdio.h>

/* Implementation of the C strcpy function */
char *badstrcopy(char *dest, const char *src)
{
      unsigned i;
        for (i=0; src[i] != '\0'; ++i)
                dest[i] = src[i];
          dest[i] = '\0';
            return dest;
}

int main ( int argc, char *argv[] )
{
        char buf[16];
            badstrcopy(buf, argv[1]);
                
                return 0;
}

