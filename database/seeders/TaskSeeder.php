<?php

namespace Database\Seeders;

use App\Models\Task;
use Illuminate\Database\Seeder;

class TaskSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create some sample tasks
        Task::factory()->count(5)->pending()->create();
        Task::factory()->count(3)->completed()->create();
    }
}