<?php
function human_size($bytes){
    // Get human readable format
    // Truncate to one dec place (this is the number windows will show)
    $type = array('B', 'KB', 'MB', 'GB', 'TB', 'EB', 'ZB', 'YB');
    $index = 0;
    while($bytes >= 1024){
        $bytes /= 1024;
        $index++;
    }

    $bytes = floor($bytes*10.0)/10.0;
    $bytes = sprintf('%.1f', $bytes);
    return($bytes." ".$type[$index]);
}

function get_hdd_info($hdd_list){
    $hdd_return = array();
    foreach($hdd_list as $hdd){
        $hdd_free = disk_free_space($hdd[0]);
        $hdd_total = disk_total_space($hdd[0]);
        array_push($hdd_return, [$hdd[0], $hdd[1], $hdd_free, $hdd_total]);
    }
    return json_encode($hdd_return);
}
?>
<style>
    .hddBox{
        padding: 0 0 10px 0 ;
    }
    .hddBox-title{

    }
    .hddBox-progressbar{
        height: 15px;
    }
    .hddBox-progressbar div{

    }
    .hddBox-size{

    }

</style>
<script>
    var hddList = <?php echo get_hdd_info([['C:','Server_OS']]); ?>;
    var HDD = {
        _template: _.template(
            '<div id="hdd-{{name}}" class="hddBox">' +
            '<div class="hddBox-title"></div>' +
            '<div class="hddBox-progressbar"></div>' +
            '<div class="hddBox-size"></div>' +
            '</div>'
        ),
        init: function(){
            _.each(hddList, function(hdd){
                var hddData = {
                    'location': hdd[0],
                    'name': hdd[1],
                    'free': parseFloat(hdd[2]),
                    'total': parseFloat(hdd[3])
                };
                $('#hddContainer').append(HDD._template(hddData));
                var hddPerc = ((hddData.total-hddData.free)/hddData.total)*100;
                var $hddName = $('#hdd-'+hddData.name);
                $hddName.find('.hddBox-title').html(hddData.name+' ('+hddData.location+')');
                $hddName.find('.hddBox-progressbar').progressbar({ value: hddPerc });
                $hddName.find('.hddBox-size').html(HDD.readableBytes(hddData.free)+' free of '+HDD.readableBytes(hddData.total));
                var percColor = '#3399FF';
                if(hddPerc >= 100){
                    percColor = 'black';
                }else if (hddPerc > 95){
                    percColor = 'red';
                }else if (hddPerc > 90){
                    percColor = 'orange';
                }
                $hddName.find('.hddBox-progressbar div').css({
                    background: percColor
                });
            });
        },
        readableBytes: function(bytes){
            // Get human readable format
            // Truncate to one dec place (this is the number windows will show)
            var s = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
            var e = Math.floor(Math.log(bytes) / Math.log(1024));
            bytes = bytes / Math.pow(1024, e);
            var size = Math.floor(bytes * 10) / 10;
            return (size + " " + s[e]);
        }
    };
    HDD.init();


</script>

<div id="hddContainer"></div>



