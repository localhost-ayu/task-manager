import { useState, useEffect, useCallback, useMemo } from 'react'
import { useAuth } from '../hooks/useAuth'
import { TaskModal } from '../components/TaskModal'
import api from '../api/axios'

const STATUS_LABEL = {
  pending:     'Pendente',
  in_progress: 'Em andamento',
  completed:   'Concluída',
}

const PRIORITY_LABEL = {
  low:    'Baixa',
  medium: 'Média',
  high:   'Alta',
}

export function Dashboard() {
  const { user, logout } = useAuth()

  const [tasks, setTasks]             = useState([])
  const [loadingTasks, setLoadingTasks] = useState(true)
  const [modalOpen, setModalOpen]     = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [savingTask, setSavingTask]   = useState(false)

  //Filtros
  const [search, setSearch]           = useState('')
  const [filterStatus, setFilterStatus]   = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')

  //Buscar tarefas
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

  useEffect(() => { fetchTasks() }, [fetchTasks])

  //Filtragem local (sem nova chamada à API) 
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchSearch   = task.title.toLowerCase()
                              .includes(search.toLowerCase())
      const matchStatus   = filterStatus   === 'all' || task.status   === filterStatus
      const matchPriority = filterPriority === 'all' || task.priority === filterPriority
      return matchSearch && matchStatus && matchPriority
    })
  }, [tasks, search, filterStatus, filterPriority])

  //Stats para o resumo do topo
  const stats = useMemo(() => ({
    total:       tasks.length,
    pending:     tasks.filter(t => t.status === 'pending').length,
    in_progress: tasks.filter(t => t.status === 'in_progress').length,
    completed:   tasks.filter(t => t.status === 'completed').length,
  }), [tasks])

  //Modal
  const handleNewTask     = () => { setEditingTask(null); setModalOpen(true) }
  const handleEditTask    = (task) => { setEditingTask(task); setModalOpen(true) }
  const handleCloseModal  = () => { setModalOpen(false); setEditingTask(null) }

  //CRUD 
  const handleSaveTask = async (formData) => {
    setSavingTask(true)
    try {
      if (editingTask) {
        const response = await api.put(`/tasks/${editingTask.id}`, formData)
        setTasks(prev => prev.map(t => t.id === editingTask.id ? response.data : t))
      } else {
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

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Tem certeza que deseja excluir esta tarefa?')) return
    try {
      await api.delete(`/tasks/${taskId}`)
      setTasks(prev => prev.filter(t => t.id !== taskId))
    } catch (err) {
      console.error('Erro ao deletar tarefa:', err)
    }
  }

  //Formatação
  const formatDate = (dateStr) => {
    if (!dateStr) return null
    const [year, month, day] = dateStr.substring(0, 10).split('-')
    return `${day}/${month}/${year}`
  }

  const isOverdue = (dateStr, status) => {
    if (!dateStr || status === 'completed') return false
    return new Date(dateStr) < new Date(new Date().toDateString())
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

      <main className="dashboard-content">

        {/* Stats */}
        <div className="stats-row">
          <div className="stat-card">
            <span className="stat-number">{stats.total}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat-card">
            <span className="stat-number pending">{stats.pending}</span>
            <span className="stat-label">Pendentes</span>
          </div>
          <div className="stat-card">
            <span className="stat-number in-progress">{stats.in_progress}</span>
            <span className="stat-label">Em andamento</span>
          </div>
          <div className="stat-card">
            <span className="stat-number completed">{stats.completed}</span>
            <span className="stat-label">Concluídas</span>
          </div>
        </div>

        {/* Toolbar */}
        <div className="toolbar">
          <input
            type="text"
            className="search-input"
            placeholder="🔍  Buscar tarefas..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />

          <select
            className="filter-select"
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
          >
            <option value="all">Todos os status</option>
            <option value="pending">Pendente</option>
            <option value="in_progress">Em andamento</option>
            <option value="completed">Concluída</option>
          </select>

          <select
            className="filter-select"
            value={filterPriority}
            onChange={e => setFilterPriority(e.target.value)}
          >
            <option value="all">Todas as prioridades</option>
            <option value="high">🔴 Alta</option>
            <option value="medium">🟡 Média</option>
            <option value="low">🟢 Baixa</option>
          </select>

          <button className="btn-new-task" onClick={handleNewTask}>
            + Nova Tarefa
          </button>
        </div>

        {/* Contador de resultados */}
        {(search || filterStatus !== 'all' || filterPriority !== 'all') && (
          <p className="results-count">
            {filteredTasks.length} tarefa{filteredTasks.length !== 1 ? 's' : ''} encontrada{filteredTasks.length !== 1 ? 's' : ''}
            {' '}<button className="btn-clear-filters" onClick={() => {
              setSearch(''); setFilterStatus('all'); setFilterPriority('all')
            }}>Limpar filtros</button>
          </p>
        )}

        {/* Lista */}
        {loadingTasks ? (
          <div className="loading-state">Carregando tarefas...</div>
        ) : filteredTasks.length === 0 ? (
          <div className="empty-state">
            <p>{tasks.length === 0 ? '📋' : '🔍'}</p>
            <p>{tasks.length === 0
              ? 'Nenhuma tarefa ainda.'
              : 'Nenhuma tarefa encontrada com esses filtros.'
            }</p>
            {tasks.length === 0 && (
              <p>Clique em "+ Nova Tarefa" para começar!</p>
            )}
          </div>
        ) : (
          <div className="task-list">
            {filteredTasks.map(task => (
              <div key={task.id} className="task-card">
                <div className={`task-priority priority-${task.priority}`} />

                <div className="task-info">
                  <div className={`task-title ${task.status === 'completed' ? 'completed' : ''}`}>
                    {task.title}
                  </div>
                  <div className="task-meta">
                    <span className={`task-status status-${task.status}`}>
                      {STATUS_LABEL[task.status]}
                    </span>
                    <span className="task-status" style={{
                      background: '#f3f4f6', color: '#6b7280'
                    }}>
                      {PRIORITY_LABEL[task.priority]}
                    </span>
                    {task.due_date && (
                      <span className={`task-due ${isOverdue(task.due_date, task.status) ? 'overdue' : ''}`}>
                        📅 {formatDate(task.due_date)}
                        {isOverdue(task.due_date, task.status) && ' • Atrasada'}
                      </span>
                    )}
                  </div>
                  {task.description && (
                    <p className="task-description">{task.description}</p>
                  )}
                </div>

                <div className="task-actions">
                  <button className="btn-icon" onClick={() => handleEditTask(task)} title="Editar">✏️</button>
                  <button className="btn-icon delete" onClick={() => handleDeleteTask(task.id)} title="Excluir">🗑️</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

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