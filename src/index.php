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
            $module_dict[$id] = ['id' => $id,
                                 'index' => $index,
                                 'config' => $config
            ];
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
    <link href="http://fonts.googleapis.com/css?family=Lato:300,400,700,400italic" rel='stylesheet' type='text/css'>
    <link href="https://code.jquery.com/ui/1.11.2/themes/smoothness/jquery-ui.css" rel='stylesheet' type='text/css'>
    <link href="./assets/css/styles.css" rel="stylesheet" type="text/css">
    <script>
        var moduleList = <?php echo get_module_list(); ?>;
    </script>

</head>
<body>


<div id="modulesContainer">
</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
<script src="https://code.jquery.com/ui/1.11.2/jquery-ui.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.7.0/underscore-min.js"></script>
<script src="./assets/js/init.js"></script>
</body>
</html>