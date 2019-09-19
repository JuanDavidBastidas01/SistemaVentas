<?php 

	$host = 'localhost';
	$user = 'root';
	$password = '';
	$db = 'factu';

	$conection = @mysqli_connect($host,
								$user,
								$password,
								$db);

	// mysqli_close($conection);

	if(!$conection){
		echo "error";
	}
 ?>