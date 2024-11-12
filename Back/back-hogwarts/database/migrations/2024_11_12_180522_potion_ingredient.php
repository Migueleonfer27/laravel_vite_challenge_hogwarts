<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('potion_ingredient', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_potion')->constrained('potions')->onDelete('cascade');
            $table->foreignId('id_ingredient')->constrained('ingredients')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('potion_ingredient');
    }
};
