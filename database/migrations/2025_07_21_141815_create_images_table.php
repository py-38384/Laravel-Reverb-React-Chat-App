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
        Schema::create('images', function (Blueprint $table) {
            $table->ulid("id")->primary();
            $table->ulid("user_id")->constrained("users")->onDelete("set null")->nullable();
            $table->foreignId("message_id")->constrained("messages")->onDelete("set null")->nullable();
            $table->string('original_name');
            $table->string('mime_type');
            $table->string('full_path');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('images');
    }
};
