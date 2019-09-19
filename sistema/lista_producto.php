<?php 
session_start();
include "../conexion.php";

 ?>
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<?php include "includes/scripts.php"; ?>
	<title>Lista Productos | Fruver</title>
</head>
<body>
	<?php include "includes/header.php"; ?>
	<section id="container">

		<h1>Lista de Productos</h1>
		<a href="registro_producto.php" class="btn_new">Registrar Producto</a>

		<form action="buscar_productos.php" method="GET" class="form_search">
			<input type="text" name="busqueda" id="busqueda" placeholder="Buscar...">
			<input type="submit" value="Buscar" class="btn_search">
		</form>
		<table>
			<tr>
						<th>Codigo</th>
						<th>Descripcion</th>
						<th>Precio</th>
						<th>Existencia</th>
						<th>
							<?php 
							$query_proveedor  = mysqli_query($conection,"SELECT codproveedor, proveedor FROM proveedor WHERE estatus = 1 ORDER BY proveedor ASC");
							$result_proveedor = mysqli_num_rows($query_proveedor); //3:38 video 48 parte 1

				 			?>

				<select name="proveedor" id="search_proveedor">
					<option value="" selected>Proveedor</option>
					<?php 

					if($result_proveedor > 0)
					{
						while ($proveedor = mysqli_fetch_array($query_proveedor)) {
							# code...
					?>

					<option value="<?php echo $proveedor['codproveedor']; ?>"><?php echo $proveedor['proveedor']; ?></option>

					<?php

						}
					}

					 ?>
					
				</select>
						</th>
						<th>Foto</th>
						<th>Acciones</th>
			</tr>

			<?php 

			//paginador
		$sql_registe = mysqli_query($conection,"SELECT COUNT(*) as total_registro FROM producto WHERE estatus = 1");
		$result_register = mysqli_fetch_array($sql_registe);
		$total_registro = $result_register['total_registro'];

		$por_pagina = 2;

		if(empty($_GET['pagina']))
		{
			$pagina = 1;
		}else{
			$pagina = $_GET['pagina'];
		}

		$desde = ($pagina -1) * $por_pagina;
		$total_paginas = ceil($total_registro/$por_pagina);

			$query = mysqli_query($conection,"SELECT p.codproducto,p.descripcion, p.precio, p.existencia, pr.proveedor, p.foto 
				FROM producto p 
				INNER JOIN proveedor pr
				ON p.proveedor = pr.codproveedor
				WHERE p.estatus = 1 ORDER BY p.codproducto DESC LIMIT $desde,$por_pagina");
			mysqli_close($conection);
			$result = mysqli_num_rows($query);

			if($result > 0)
			{
				while ($data = mysqli_fetch_array($query)) {
					if($data['foto'] != 'img_producto.png'){
						$foto = 'img/uploads/'.$data['foto'];
					}else{
						$foto = 'img/'.$data['foto'];
					}
			?>
				<tr class="row<?php echo $data["codproducto"]; ?>">
<!-- 					minuto 24:16 numero 39-->		
					<td><?php echo $data["codproducto"]; ?></td>
					<td><?php echo $data["descripcion"]; ?></td>
					<td class="celPrecio"><?php echo $data["precio"]; ?></td>
					<td class="celExistencia"><?php echo $data['existencia']; ?></td>
					<td><?php echo $data["proveedor"]; ?></td>
					<td class="img_producto"><img src="<?php echo $foto; ?>" alt="<?php echo $data["descripcion"]; ?>"></td>
					<td>
						<a class="link_add add_product" product="<?php echo $data["codproducto"]; ?>" href="#">Agregar</a>
						|
						<a class="link_edit" href="editar_producto.php?id=<?php echo $data["codproducto"]; ?>">Editar</a>
						<?php if($_SESSION['rol'] == 1){ ?>
						|
						<a class="link_delete del_product" href="#" product="<?php echo $data["codproducto"]; ?>">Eliminar</a>
						<?php } ?>
					</td>
				</tr>

			<?php

				}
			}

		 ?>

		</table>
		<div class="paginador">
			<ul>

				<?php 
					if($pagina != 1)

				 ?>
				<li><a href="?pagina=<?php echo 1; ?>">|<</a></li>
				<li><a href="?pagina=<?php echo $pagina-1; ?>"><<</a></li>
			<?php 
			for ($i=1; $i <= $total_paginas; $i++) { 
				if($i == $pagina)
				{
					echo '<li class="pageSelected">'.$i.'</li>';
				}else{
					echo '<li><a href="?pagina='.$i.'">'.$i.'</a></li>';
				}
			}
			if($pagina != $total_paginas)
			{


			?>
				<li><a href="?pagina=<?php $pagina+1; ?>">>></a></li>
				<li><a href="?pagina=<?php $total_paginas; ?>">>|</a></li>
				<?php } ?>
			</ul>
		</div>
	</section>

	<?php include "includes/footer.php"; ?>
</body>
</html>