<?php
include('./functions.php');


function get_module_list(){
    $module_dir    = './modules';
    $modules = scandir($module_dir);
    $module_dict = array();
    foreach($modules as $module) {
        if($module != '.' && $module != '..'){
            $base_dir = $module_dir.'/'.$module.'/';
            $config = parse_ini_file($base_dir.'config.ini');
            $id = str2cml($config['name']);
            $index = $base_dir.$config['index'];
            $module_dict[$id] = ['id' => $id, 'name' => $config['name'], 'index' => $index, 'interval' => $config['interval']];
        }
    }
    return json_encode($module_dict);
} //END get_module_list()


?>
<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <title>Main Control Interface</title>
    <script>
        var moduleList = <?php echo get_module_list(); ?>;
    </script>

</head>
<body>


<div id="modulesContainer">
</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.7.0/underscore-min.js"></script>
<script src="./assets/js/init.js"></script>
</body>
</html>