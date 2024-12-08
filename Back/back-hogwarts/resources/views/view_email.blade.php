<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>Laravel</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,600&display=swap" rel="stylesheet" />
</head>
<body class="antialiased">
<p>Hola, {{ $nameUser }}</p>
<p>Tu solicitud para cambiar la contraseña ha sido exitosa.</p>
<p>Esta es tu nueva contraseña: <strong>{{ $password }}</strong></p>
<p>Por favor, guárdala en un lugar seguro y cámbiala cuanto antes.</p>
</body>
</html>
