<head>
<meta charset="utf-8" />
<title>Straight line</title>
<link rel="shortcut icon" href="/boltlogo.png">
<script type="text/javascript" src="jquery.js"></script>
<script src='https://cdn1.kongregate.com/javascripts/kongregate_api.js'></script>

<link href="buttons.css" rel="stylesheet">
<link href="style.css" rel="stylesheet">
<?php 
foreach (glob("game/*.js") as $filename)
{
    echo '<script type="text/javascript" src='.$filename.'></script>
';
} 
?>
<script> window.onload = main; </script>
</head>
<body style="margin: 0">
<canvas style="background-color:#eeeeee;" class="unselectable" id="canvas" draggable="false" align="center" width="960" height="640" onmousedown="click()">Your browser does not support canvas. Use Chrome instead.</canvas>
</div>
</body>