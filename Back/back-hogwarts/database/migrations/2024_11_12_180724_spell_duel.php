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
        Schema::create('spell_duel', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_spell')->constrained('spells')->onDelete('cascade');
            $table->foreignId('id_duel')->constrained('duels')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('spell_duel');
    }
};
