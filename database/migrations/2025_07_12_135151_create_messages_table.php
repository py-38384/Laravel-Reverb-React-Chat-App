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
        Schema::create('messages', function (Blueprint $table) {
            $table->id();
            $table->uuid("sender_id")->constrained("users")->onDelete("set null");
            $table->uuid("receiver_id")->constrained("users")->onDelete("set null");
            $table->text("message")->nullable();
            $table->string("file_name")->nullable();
            $table->string("file_original_name")->nullable();
            $table->string("folder_path")->nullable();
            $table->boolean("is_read")->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('messages');
    }
};
