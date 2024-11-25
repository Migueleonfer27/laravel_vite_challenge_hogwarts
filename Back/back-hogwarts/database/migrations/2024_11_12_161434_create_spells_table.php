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
        Schema::create('spells', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->integer('attack')->check('attack >= 0 and attack <= 100');
            $table->integer('defense')->check('defense >= 0 and defense <= 100');
            $table->integer('healing')->check('healing >= 0 and healing <= 100');
            $table->integer('damage')->check('damage >= 0 and damage <= 100');
            $table->integer('summon')->check('summon >= 0 and summon <= 100');
            $table->integer('action')->check('action >= 0 and action <= 100');
            $table->foreignId('creator')->nullable()->constrained('users')->onDelete('cascade');
            $table->integer('level')->check('level >= 1 and level <= 5');
            $table->string('validation_status')->default('pending');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('spells');
    }
};
