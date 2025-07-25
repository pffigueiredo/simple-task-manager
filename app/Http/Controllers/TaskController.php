<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Models\Task;
use Inertia\Inertia;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $tasks = Task::latest()->get();
        
        return Inertia::render('tasks', [
            'tasks' => $tasks
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTaskRequest $request)
    {
        Task::create($request->validated());

        $tasks = Task::latest()->get();
        
        return Inertia::render('tasks', [
            'tasks' => $tasks
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTaskRequest $request, Task $task)
    {
        $validated = $request->validated();
        
        // If marking as completed, set completed_at timestamp
        if (isset($validated['is_completed']) && $validated['is_completed'] && !$task->is_completed) {
            $validated['completed_at'] = now();
        }
        
        // If marking as incomplete, clear completed_at timestamp
        if (isset($validated['is_completed']) && !$validated['is_completed'] && $task->is_completed) {
            $validated['completed_at'] = null;
        }
        
        $task->update($validated);

        $tasks = Task::latest()->get();
        
        return Inertia::render('tasks', [
            'tasks' => $tasks
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task)
    {
        $task->delete();

        $tasks = Task::latest()->get();
        
        return Inertia::render('tasks', [
            'tasks' => $tasks
        ]);
    }
}