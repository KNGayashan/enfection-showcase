import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useProjects, CATEGORIES } from '../../context/ProjectContext'

const emptyForm = { title: '', description: '', tags: '', category: CATEGORIES[0], imageUrl: '', link: '' }

function ProjectForm({ initial, onSubmit, onCancel, label }) {
  const [form, setForm] = useState(initial)
  const f = k => e => setForm(prev => ({ ...prev, [k]: e.target.value }))

  function handleSubmit(e) {
    e.preventDefault()
    onSubmit({ ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) })
  }

  return (
    <form className="project-form" onSubmit={handleSubmit}>
      <input placeholder="Title *" value={form.title} onChange={f('title')} required />
      <textarea placeholder="Description *" value={form.description} onChange={f('description')} rows={3} required />
      <input placeholder="Tags (comma separated, e.g. React, Node.js)" value={form.tags} onChange={f('tags')} />
      <select value={form.category} onChange={f('category')}>
        {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
      </select>
      <input placeholder="Image URL" value={form.imageUrl} onChange={f('imageUrl')} />
      <input placeholder="Project link" value={form.link} onChange={f('link')} />
      <div className="form-actions">
        <button type="submit" className="btn btn-primary">{label}</button>
        <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  )
}

export default function Dashboard() {
  const { logout } = useAuth()
  const { projects, addProject, updateProject, deleteProject } = useProjects()
  const navigate = useNavigate()

  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState(null)

  function handleLogout() {
    logout()
    navigate('/admin')
  }

  function handleAdd(data) {
    addProject(data)
    setShowAddForm(false)
  }

  function handleUpdate(data) {
    updateProject(editingId, data)
    setEditingId(null)
  }

  function handleEditClick(project) {
    setEditingId(editingId === project.id ? null : project.id)
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <div className="header-actions">
          <a href="/" target="_blank" rel="noopener noreferrer" className="btn btn-ghost">View Site</a>
          <button className="btn btn-ghost" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <div className="dashboard-body">
        <div className="section-header">
          <h2>Projects ({projects.length})</h2>
          {!showAddForm && (
            <button className="btn btn-primary" onClick={() => { setShowAddForm(true); setEditingId(null) }}>
              + Add Project
            </button>
          )}
        </div>

        {showAddForm && (
          <ProjectForm
            initial={emptyForm}
            onSubmit={handleAdd}
            onCancel={() => setShowAddForm(false)}
            label="Add Project"
          />
        )}

        <div className="project-list">
          {projects.length === 0 && <p className="empty-state">No projects yet.</p>}
          {projects.map(project => (
            <div key={project.id} className="project-row-wrap">
              <div className={`project-row ${editingId === project.id ? 'project-row--editing' : ''}`}>
                {project.imageUrl && (
                  <img src={project.imageUrl} alt={project.title} className="project-row-image" />
                )}
                <div className="project-row-info">
                  <strong>{project.title}</strong>
                  {project.category && <span className="tag">{project.category}</span>}
                  <span>{project.description.slice(0, 80)}{project.description.length > 80 ? '…' : ''}</span>
                  {project.tags?.length > 0 && (
                    <div className="tags">
                      {project.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
                    </div>
                  )}
                </div>
                <div className="project-row-actions">
                  <button
                    className={`btn btn-sm ${editingId === project.id ? 'btn-primary' : 'btn-ghost'}`}
                    onClick={() => handleEditClick(project)}
                  >
                    {editingId === project.id ? '✕ Close' : 'Edit'}
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => deleteProject(project.id)}>Delete</button>
                </div>
              </div>

              {editingId === project.id && (
                <div className="inline-edit-wrap">
                  <ProjectForm
                    key={project.id}
                    initial={{
                      title: project.title,
                      description: project.description,
                      tags: project.tags?.join(', ') || '',
                      category: project.category || CATEGORIES[0],
                      imageUrl: project.imageUrl || '',
                      link: project.link || '',
                    }}
                    onSubmit={handleUpdate}
                    onCancel={() => setEditingId(null)}
                    label="Save Changes"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
