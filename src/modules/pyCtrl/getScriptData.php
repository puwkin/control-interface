<?php
$host = "http://192.168.1.242";
$port = 5001;

$cmd = "/script/list";
if(isset($_GET['cmd'])){
    $cmd = $_GET['cmd'];
}

echo file_get_contents($host.':'.$port.$cmd);