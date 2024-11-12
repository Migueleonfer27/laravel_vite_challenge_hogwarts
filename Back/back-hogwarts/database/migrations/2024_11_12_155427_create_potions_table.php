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
        Schema::create('potions', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->foreignId('creator')->constrained('users')->onDelete('cascade');
            $table->integer('good_level')->default(0)->unsigned()->check('good_level >= 0 and good_level <= 100');
            $table->integer('bad_level')->default(0)->unsigned()->check('bad_level >= 0 and bad_level <= 100');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('potions');
    }
};
