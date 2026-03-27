import { createContext, useContext, useState } from 'react'

const ProjectContext = createContext(null)

const STORAGE_KEY = 'enfection_projects'

export const CATEGORIES = ['Games', 'Websites', 'Innovation']

const sampleProjects = [
  {
    id: '1',
    title: 'Sample Project',
    description: 'This is a sample project. Replace it from the admin dashboard.',
    tags: ['React', 'Vite'],
    category: 'Websites',
    imageUrl: '',
    link: '',
    createdAt: new Date().toISOString(),
  },
]

export function ProjectProvider({ children }) {
  const [projects, setProjects] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : sampleProjects
    } catch {
      return sampleProjects
    }
  })

  function save(updated) {
    setProjects(updated)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  }

  function addProject(project) {
    const newProject = { ...project, id: crypto.randomUUID(), createdAt: new Date().toISOString() }
    save([...projects, newProject])
  }

  function updateProject(id, data) {
    save(projects.map(p => p.id === id ? { ...p, ...data } : p))
  }

  function deleteProject(id) {
    save(projects.filter(p => p.id !== id))
  }

  return (
    <ProjectContext.Provider value={{ projects, addProject, updateProject, deleteProject }}>
      {children}
    </ProjectContext.Provider>
  )
}

export function useProjects() {
  return useContext(ProjectContext)
}
