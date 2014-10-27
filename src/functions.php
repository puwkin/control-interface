<?php

function str2cml($text){
    return preg_replace('/\s/', '', $text);
}