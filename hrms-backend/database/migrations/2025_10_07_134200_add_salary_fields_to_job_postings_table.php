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
        Schema::table('job_postings', function (Blueprint $table) {
            $table->decimal('salary_min', 10, 2)->nullable()->after('position');
            $table->decimal('salary_max', 10, 2)->nullable()->after('salary_min');
            $table->string('salary_notes')->nullable()->after('salary_max');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('job_postings', function (Blueprint $table) {
            $table->dropColumn(['salary_min', 'salary_max', 'salary_notes']);
        });
    }
};