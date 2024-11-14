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
        Schema::create('ingredients', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->integer('healing')->check('healing >= 0 and healing <= 100');
            $table->integer('poisoning')->check('poisoning >= 0 and poisoning <= 100');
            $table->integer('analgesic')->check('analgesic >= 0 and analgesic <= 100');
            $table->integer('pain')->check('pain >= 0 and pain <= 100');
            $table->integer('curative')->check('curative >= 0 and curative <= 100');
            $table->integer('sickening')->check('sickening >= 0 and sickening <= 100');
            $table->integer('inflammatory')->check('inflammatory >= 0 and inflammatory <= 100');
            $table->integer('deinflammatory')->check('de_inflammatory >= 0 and de_inflammatory <= 100');
            $table->string('url_photo')->nullable(); // Cambiar por que necesita foto por defecto si no elige foto
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ingredients');
    }
};
