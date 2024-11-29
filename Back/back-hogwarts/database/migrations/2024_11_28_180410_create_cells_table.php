<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    //Monica
    public function up(): void
    {
        Schema::create('cells', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('map_id');
                $table->integer('posicion_x');
                $table->integer('posicion_y');
                $table->string('content')->nullable();
                $table->string('second_content')->nullable();
                $table->timestamps();

                $table->foreign('map_id')->references('id')->on('maps')->onDelete('cascade');
            });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cells');
    }
};
