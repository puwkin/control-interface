<?php
$host = "http://localhost";
$port = 5001;

$cmd = "/script/list";
if(isset($_GET['cmd'])){
    $cmd = $_GET['cmd'];
}

echo file_get_contents($host.':'.$port.$cmd);