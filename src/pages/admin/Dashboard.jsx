import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useProjects, CATEGORIES } from '../../context/ProjectContext'
import enfLabLogo from '../../assets/images/enf-lab-logo.jpg'

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
      <div className="project-form-grid">
        <input placeholder="Title *" value={form.title} onChange={f('title')} required />
        <select value={form.category} onChange={f('category')}>
          {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
      </div>
      <textarea placeholder="Description *" value={form.description} onChange={f('description')} rows={3} required />
      <input placeholder="Tags (comma separated, e.g. React, Node.js)" value={form.tags} onChange={f('tags')} />
      <div className="project-form-grid">
        <input placeholder="Image URL" value={form.imageUrl} onChange={f('imageUrl')} />
        <input placeholder="Project link" value={form.link} onChange={f('link')} />
      </div>
      <div className="form-actions">
        <button type="submit" className="btn btn-primary">{label}</button>
        <button type="button" className="btn btn-ghost dash-btn-ghost" onClick={onCancel}>Cancel</button>
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
        <div className="dashboard-header-left">
          <img src={enfLabLogo} alt="Enfection Labs" className="dashboard-logo" />
          <h1>Admin Dashboard</h1>
        </div>
        <div className="header-actions">
          <a href="/" target="_blank" rel="noopener noreferrer" className="btn btn-ghost dash-btn-ghost">View Site ↗</a>
          <button className="btn btn-ghost dash-btn-ghost" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <div className="dashboard-body">
        <div className="section-header">
          <div>
            <h2>Projects</h2>
            <span className="section-count">{projects.length} total</span>
          </div>
          {!showAddForm && (
            <button className="btn btn-primary" onClick={() => { setShowAddForm(true); setEditingId(null) }}>
              + Add Project
            </button>
          )}
        </div>

        {showAddForm && (
          <div className="add-form-wrap">
            <p className="add-form-label">New Project</p>
            <ProjectForm
              initial={emptyForm}
              onSubmit={handleAdd}
              onCancel={() => setShowAddForm(false)}
              label="Add Project"
            />
          </div>
        )}

        <div className="project-list">
          {projects.length === 0 && (
            <div className="dash-empty-state">
              <span>No projects yet. Add your first one above.</span>
            </div>
          )}
          {projects.map(project => (
            <div key={project.id} className={`project-card-wrap ${editingId === project.id ? 'project-card-wrap--editing' : ''}`}>
              <div className="dash-project-card">
                <div className="project-card-image">
                  {project.imageUrl
                    ? <img src={project.imageUrl} alt={project.title} />
                    : <div className="project-card-image-placeholder"><span>No Image</span></div>
                  }
                  {project.category && (
                    <span className="project-card-badge">{project.category}</span>
                  )}
                </div>

                <div className="project-card-body">
                  <h3 className="project-card-title">{project.title}</h3>
                  <p className="project-card-desc">
                    {project.description.slice(0, 110)}{project.description.length > 110 ? '…' : ''}
                  </p>

                  {project.tags?.length > 0 && (
                    <div className="project-card-tags">
                      {project.tags.map(tag => (
                        <span key={tag} className="project-card-tag">{tag}</span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="project-card-footer">
                  {project.link
                    ? <a href={project.link} target="_blank" rel="noopener noreferrer" className="project-card-link">Live Preview ↗</a>
                    : <span />
                  }
                  <div className="project-card-actions">
                    <button
                      className={`btn btn-sm ${editingId === project.id ? 'btn-active' : 'btn-ghost dash-btn-ghost'}`}
                      onClick={() => handleEditClick(project)}
                    >
                      {editingId === project.id ? '✕ Close' : 'Edit'}
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => deleteProject(project.id)}>Delete</button>
                  </div>
                </div>
              </div>

              {editingId === project.id && (
                <div className="inline-edit-wrap">
                  <p className="inline-edit-label">Editing: {project.title}</p>
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
