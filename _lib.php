<?php
/*
 * Läd das Framework
 * 
 * (A) Mario XEdP3X
 * (c) GPL
 */

include 'config.php';

define("lib",true);

if ($handle = scandir('lib/')) {
    while( list ( $key, $val ) = each ( $handle ) ){
        if ($val[0] != ".") {
        	include_once ("lib/$val");
        }
    }
}