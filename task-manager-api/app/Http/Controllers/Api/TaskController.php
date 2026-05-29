<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    // GET /api/tasks
    public function index(Request $request)
    {
        // Cada usuário vê APENAS suas próprias tarefas
        $tasks = $request->user()
                         ->tasks()
                         ->orderBy('created_at', 'desc')
                         ->get();

        return response()->json($tasks);
    }

    // POST /api/tasks
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'status'      => 'in:pending,in_progress,completed',
            'priority'    => 'in:low,medium,high',
            'due_date'    => 'nullable|date',
        ]);

        // Associa automaticamente ao usuário logado
        $task = $request->user()->tasks()->create($validated);

        return response()->json($task, 201);
    }

    // GET /api/tasks/{id}
    public function show(Request $request, Task $task)
    {
        // Garante que o usuário só acessa tarefa própria
        $this->authorize_ownership($request->user(), $task);

        return response()->json($task);
    }

    // PUT /api/tasks/{id}
    public function update(Request $request, Task $task)
    {
        $this->authorize_ownership($request->user(), $task);

        $validated = $request->validate([
            'title'       => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'status'      => 'sometimes|in:pending,in_progress,completed',
            'priority'    => 'sometimes|in:low,medium,high',
            'due_date'    => 'nullable|date',
        ]);

        $task->update($validated);

        return response()->json($task);
    }

    // DELETE /api/tasks/{id}
    public function destroy(Request $request, Task $task)
    {
        $this->authorize_ownership($request->user(), $task);

        $task->delete();

        return response()->json(null, 204); // 204 = No Content
    }

    // Helper privado — evita repetição de código
    private function authorize_ownership($user, Task $task)
    {
        if ($task->user_id !== $user->id) {
            abort(403, 'Acesso negado.');
        }
    }
}