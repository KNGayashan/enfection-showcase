export default function ProjectCard({ project }) {
  return (
    <div className="project-card">
      {project.imageUrl && (
        <img src={project.imageUrl} alt={project.title} className="project-image" />
      )}
      <div className="project-body">
        <h2>{project.title}</h2>
        <p>{project.description?.split(' ').slice(0, 15).join(' ')}{project.description?.split(' ').length > 15 ? '…' : ''}</p>
        {project.tags?.length > 0 && (
          <div className="tags">
            {project.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
          </div>
        )}
        {project.link && (
          <a href={project.link} target="_blank" rel="noopener noreferrer" className="project-link">
            View Project →
          </a>
        )}
      </div>
    </div>
  )
}
