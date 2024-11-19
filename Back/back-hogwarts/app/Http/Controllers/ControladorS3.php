<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

/**
 * Necesario instalar: composer require league/flysystem-aws-s3-v3 "^3.0"
 */
class ControladorS3 extends Controller
{
    public function cargarImagenS3(Request $request){

        $messages = [
            'max' => 'El campo se excede del tamaño máximo'
        ];

        $validator = Validator::make($request->all(), [
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ], $messages);
        if ($validator->fails()){
            return response()->json($validator->errors(),422);
        }

        if ($request->hasFile('image')) {
            $file = $request->file('image');

            try {
                $filename = $file->getClientOriginalName();
                $path = $file->storeAs('perfiles', $filename, 's3');

                // if (!$path) {
                //     return response()->json(['error' => 'Error al guardar en S3. Ruta de archivo vacía.'.$filename], 500);
                // }

                $url = Storage::disk('s3')->url($path);
                return response()->json(['path' => $path, 'url' => $url], 200);
            } catch (\Exception $e) {
                return response()->json(['error' => 'Hubo un error al subir la imagen: ' . $e->getMessage()], 500);
            }
        }

        return response()->json(['error' => 'No se recibió ningún archivo.'], 400);

    }
}
