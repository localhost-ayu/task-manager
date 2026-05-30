import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../hooks/useAuth'
import { TaskModal } from '../components/TaskModal'
import api from '../api/axios'

export function Dashboard() {
  const { user, logout } = useAuth()

  const [tasks, setTasks]           = useState([])
  const [loadingTasks, setLoadingTasks] = useState(true)
  const [modalOpen, setModalOpen]   = useState(false)
  const [editingTask, setEditingTask] = useState(null)   // null = criar, objeto = editar
  const [savingTask, setSavingTask] = useState(false)

  // Buscar tarefas 
  const fetchTasks = useCallback(async () => {
    try {
      const response = await api.get('/tasks')
      setTasks(response.data)
    } catch (err) {
      console.error('Erro ao buscar tarefas:', err)
    } finally {
      setLoadingTasks(false)
    }
  }, [])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  // Abrir modal
  const handleNewTask = () => {
    setEditingTask(null)
    setModalOpen(true)
  }

  const handleEditTask = (task) => {
    setEditingTask(task)
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setEditingTask(null)
  }

  //Criar ou Editar
  const handleSaveTask = async (formData) => {
    setSavingTask(true)
    try {
      if (editingTask) {
        // PUT /api/tasks/{id}
        const response = await api.put(`/tasks/${editingTask.id}`, formData)
        setTasks(prev =>
          prev.map(t => t.id === editingTask.id ? response.data : t)
        )
      } else {
        // POST /api/tasks
        const response = await api.post('/tasks', formData)
        setTasks(prev => [response.data, ...prev])
      }
      handleCloseModal()
    } catch (err) {
      console.error('Erro ao salvar tarefa:', err)
    } finally {
      setSavingTask(false)
    }
  }

  //Deletar
  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Tem certeza que deseja excluir esta tarefa?')) return

    try {
      await api.delete(`/tasks/${taskId}`)
      // Remove da lista sem precisar rebuscar tudo
      setTasks(prev => prev.filter(t => t.id !== taskId))
    } catch (err) {
      console.error('Erro ao deletar tarefa:', err)
    }
  }

  //Helpers de formatação
  const formatDate = (dateStr) => {
    if (!dateStr) return null
    const [year, month, day] = dateStr.substring(0, 10).split('-')
    return `${day}/${month}/${year}`
  }

  const statusLabel = {
    pending:     'Pendente',
    in_progress: 'Em andamento',
    completed:   'Concluída',
  }

  return (
    <div className="dashboard-layout">
      {/* Header */}
      <header className="dashboard-header">
        <h1>✅ Task Manager</h1>
        <div className="header-user">
          <span>Olá, {user?.name?.split(' ')[0]}!</span>
          <button className="btn-logout" onClick={logout}>Sair</button>
        </div>
      </header>

      {/* Conteúdo */}
      <main className="dashboard-content">
        <div className="tasks-header">
          <h2>Minhas Tarefas</h2>
          <button className="btn-new-task" onClick={handleNewTask}>
            + Nova Tarefa
          </button>
        </div>

        {/* Lista */}
        {loadingTasks ? (
          <div className="loading-state">Carregando tarefas...</div>
        ) : tasks.length === 0 ? (
          <div className="empty-state">
            <p>📋</p>
            <p>Nenhuma tarefa ainda.</p>
            <p>Clique em "+ Nova Tarefa" para começar!</p>
          </div>
        ) : (
          <div className="task-list">
            {tasks.map(task => (
              <div key={task.id} className="task-card">
                {/* Bolinha de prioridade */}
                <div className={`task-priority priority-${task.priority}`} />

                {/* Informações */}
                <div className="task-info">
                  <div className={`task-title ${task.status === 'completed' ? 'completed' : ''}`}>
                    {task.title}
                  </div>
                  <div className="task-meta">
                    <span className={`task-status status-${task.status}`}>
                      {statusLabel[task.status]}
                    </span>
                    {task.due_date && (
                      <span className="task-due">
                        📅 {formatDate(task.due_date)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Ações */}
                <div className="task-actions">
                  <button
                    className="btn-icon"
                    onClick={() => handleEditTask(task)}
                    title="Editar"
                  >
                    ✏️
                  </button>
                  <button
                    className="btn-icon delete"
                    onClick={() => handleDeleteTask(task.id)}
                    title="Excluir"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal */}
      {modalOpen && (
        <TaskModal
          task={editingTask}
          onSave={handleSaveTask}
          onClose={handleCloseModal}
          loading={savingTask}
        />
      )}
    </div>
  )
}