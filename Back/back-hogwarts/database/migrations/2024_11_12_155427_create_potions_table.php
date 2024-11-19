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
            $table->string('description');
            $table->foreignId('creator')->constrained('users')->onDelete('cascade');
            $table->integer('good_level')->default(0);
            $table->integer('bad_level')->default(0);
            $table->boolean('approves_teacher')->default(false);
            $table->boolean('approves_dumbledore')->default(false);
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
