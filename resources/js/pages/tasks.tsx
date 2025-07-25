import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { router } from '@inertiajs/react';

interface Task {
    id: number;
    title: string;
    description: string | null;
    is_completed: boolean;
    completed_at: string | null;
    created_at: string;
    updated_at: string;
}

interface Props {
    tasks: Task[];
    [key: string]: unknown;
}

export default function Tasks({ tasks }: Props) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        router.post(route('tasks.store'), {
            title: title.trim(),
            description: description.trim() || null,
        }, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                setTitle('');
                setDescription('');
            }
        });
    };

    const handleToggleComplete = (task: Task) => {
        router.patch(route('tasks.update', task.id), {
            title: task.title,
            description: task.description,
            is_completed: !task.is_completed,
        }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const handleDelete = (task: Task) => {
        if (confirm('Are you sure you want to delete this task?')) {
            router.delete(route('tasks.destroy', task.id), {
                preserveState: true,
                preserveScroll: true
            });
        }
    };

    const pendingTasks = tasks.filter(task => !task.is_completed);
    const completedTasks = tasks.filter(task => task.is_completed);

    return (
        <AppLayout>
            <div className="container mx-auto p-6 max-w-4xl">
                <h1 className="text-3xl font-bold mb-8">Daily Tasks</h1>
                
                {/* Add New Task Form */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Add New Task</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Input
                                    type="text"
                                    placeholder="Task title..."
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full"
                                />
                            </div>
                            <div>
                                <Textarea
                                    placeholder="Task description (optional)..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full"
                                    rows={3}
                                />
                            </div>
                            <Button type="submit" disabled={!title.trim()}>
                                Add Task
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Task Lists */}
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Pending Tasks */}
                    <div>
                        <h2 className="text-xl font-semibold mb-4">
                            Pending Tasks ({pendingTasks.length})
                        </h2>
                        <div className="space-y-3">
                            {pendingTasks.length === 0 ? (
                                <p className="text-gray-500 italic">No pending tasks</p>
                            ) : (
                                pendingTasks.map((task) => (
                                    <Card key={task.id}>
                                        <CardContent className="p-4">
                                            <div className="flex items-start gap-3">
                                                <Checkbox
                                                    checked={task.is_completed}
                                                    onCheckedChange={() => handleToggleComplete(task)}
                                                    className="mt-1"
                                                />
                                                <div className="flex-1">
                                                    <h3 className="font-medium">
                                                        {task.title}
                                                    </h3>
                                                    {task.description && (
                                                        <p className="text-sm text-gray-600 mt-1">
                                                            {task.description}
                                                        </p>
                                                    )}
                                                </div>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleDelete(task)}
                                                    className="text-red-600 hover:text-red-700"
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Completed Tasks */}
                    <div>
                        <h2 className="text-xl font-semibold mb-4">
                            Completed Tasks ({completedTasks.length})
                        </h2>
                        <div className="space-y-3">
                            {completedTasks.length === 0 ? (
                                <p className="text-gray-500 italic">No completed tasks</p>
                            ) : (
                                completedTasks.map((task) => (
                                    <Card key={task.id} className="opacity-75">
                                        <CardContent className="p-4">
                                            <div className="flex items-start gap-3">
                                                <Checkbox
                                                    checked={task.is_completed}
                                                    onCheckedChange={() => handleToggleComplete(task)}
                                                    className="mt-1"
                                                />
                                                <div className="flex-1">
                                                    <h3 className="font-medium line-through text-gray-600">
                                                        {task.title}
                                                    </h3>
                                                    {task.description && (
                                                        <p className="text-sm text-gray-500 mt-1 line-through">
                                                            {task.description}
                                                        </p>
                                                    )}
                                                </div>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleDelete(task)}
                                                    className="text-red-600 hover:text-red-700"
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}