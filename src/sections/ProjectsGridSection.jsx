import { useState } from 'react'
import { useProjects, CATEGORIES } from '../context/ProjectContext'
import ProjectCard from '../components/ProjectCard'

const ALL = 'All'
const PAGE_SIZE = 12

export default function ProjectsGridSection() {
  const { projects } = useProjects()
  const [active, setActive] = useState(ALL)
  const [page, setPage] = useState(0)
  const [dir, setDir] = useState(1)

  const filtered = active === ALL
    ? projects
    : projects.filter(p => p.category === active)

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const pageProjects = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  function changeCategory(cat) {
    setActive(cat)
    setPage(0)
    setDir(1)
  }

  function goTo(newPage, direction) {
    setDir(direction)
    setPage(newPage)
  }

  return (
    <section id="projects" className="projects_section">
      <div className="projects_filters">
        {[ALL, ...CATEGORIES].map(cat => (
          <button
            key={cat}
            className={`filter_btn ${active === cat ? 'filter_btn--active' : ''}`}
            onClick={() => changeCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="projects_page_wrap">
        <div
          key={`${page}-${dir}`}
          className="projects-grid"
          data-dir={dir}
        >
          {pageProjects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
          {filtered.length === 0 && (
            <p className="empty-state">No projects in this category yet.</p>
          )}
        </div>
      </div>

      {totalPages > 1 && (
        <div className="pg_nav">
          <button
            className="pg_arrow"
            onClick={() => goTo(page - 1, -1)}
            disabled={page === 0}
            aria-label="Previous page"
          >←</button>

          <div className="pg_dots">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                className={`pg_dot ${i === page ? 'pg_dot--active' : ''}`}
                onClick={() => goTo(i, i > page ? 1 : -1)}
                aria-label={`Page ${i + 1}`}
              />
            ))}
          </div>

          <button
            className="pg_arrow"
            onClick={() => goTo(page + 1, 1)}
            disabled={page === totalPages - 1}
            aria-label="Next page"
          >→</button>
        </div>
      )}
    </section>
  )
}
