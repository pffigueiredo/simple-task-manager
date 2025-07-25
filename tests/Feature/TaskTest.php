<?php

use App\Models\Task;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('displays tasks on home page', function () {
    Task::factory()->create(['title' => 'Test Task']);

    $response = $this->get('/');

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => 
        $page->component('tasks')
            ->has('tasks', 1)
            ->where('tasks.0.title', 'Test Task')
    );
});

it('can create a task', function () {
    $response = $this->post('/tasks', [
        'title' => 'New Task',
        'description' => 'Task description',
    ]);

    $response->assertStatus(200);
    $this->assertDatabaseHas('tasks', [
        'title' => 'New Task',
        'description' => 'Task description',
        'is_completed' => false,
    ]);
});

it('requires title when creating task', function () {
    $response = $this->post('/tasks', [
        'title' => '',
        'description' => 'Task description',
    ]);

    $response->assertSessionHasErrors(['title']);
});

it('can mark task as completed', function () {
    $task = Task::factory()->create(['is_completed' => false]);

    $response = $this->patch("/tasks/{$task->id}", [
        'title' => $task->title,
        'description' => $task->description,
        'is_completed' => true,
    ]);

    $response->assertStatus(200);
    $this->assertDatabaseHas('tasks', [
        'id' => $task->id,
        'is_completed' => true,
    ]);
    
    $task->refresh();
    expect($task->completed_at)->not->toBeNull();
});

it('can mark task as incomplete', function () {
    $task = Task::factory()->completed()->create();

    $response = $this->patch("/tasks/{$task->id}", [
        'title' => $task->title,
        'description' => $task->description,
        'is_completed' => false,
    ]);

    $response->assertStatus(200);
    $this->assertDatabaseHas('tasks', [
        'id' => $task->id,
        'is_completed' => false,
    ]);
    
    $task->refresh();
    expect($task->completed_at)->toBeNull();
});

it('can delete a task', function () {
    $task = Task::factory()->create();

    $response = $this->delete("/tasks/{$task->id}");

    $response->assertStatus(200);
    $this->assertDatabaseMissing('tasks', [
        'id' => $task->id,
    ]);
});