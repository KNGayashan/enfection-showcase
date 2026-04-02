/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react'

const ProjectContext = createContext(null)

const STORAGE_KEY = 'enfection_projects'

export const CATEGORIES = ['Games', 'Websites', 'Innovation']

const sampleProjects = [
  {
    id: '0c78daa6-2f6e-4509-ba84-4a15a6fd52e9',
    title: 'Real-time AR Image Tracking with 3D Visualization',
    description: 'Developed an Augmented Reality (AR) image tracking application that automatically activates the device camera when the app is opened. The system detects a predefined logo using image recognition and overlays an interactive 3D object on top of the detected image in real time. Users can interact with the 3D model by rotating, zooming, and controlling it through touch gestures. This project explores the use of AR technology for interactive visualization and digital experiences.',
    tags: ['React'],
    category: 'Innovation',
    imageUrl: 'https://projects.enfection.com/showcase-uploads/argirl.jpeg',
    link: 'https://projects.enfection.com/ar-girl/',
    createdAt: '2026-03-30T05:39:01.838Z',
  },
  {
    id: '878dcfdd-50fb-4659-acee-711c0e6703ff',
    title: 'Interactive 3D Environment with Object Control',
    description: 'Development of a 3D environment with interactive objects and image upload functionality.',
    tags: ['Next js'],
    category: 'Games',
    imageUrl: 'https://projects.enfection.com/showcase-uploads/plazza.jpeg',
    link: '',
    createdAt: '2026-03-30T07:59:53.593Z',
  },
  {
    id: 'b473d271-a1c7-4c47-a4de-bdfe9af3259d',
    title: '3D running game',
    description: 'endless running game developed with threejs',
    tags: ['React js'],
    category: 'Games',
    imageUrl: 'https://projects.enfection.com/showcase-uploads/runner.png',
    link: 'https://projects.enfection.com/runner/',
    createdAt: '2026-03-30T08:03:54.706Z',
  },
  {
    id: '547bab76-9547-4945-ae38-2fb3b33a07c2',
    title: 'Projectflow - Internal Tool',
    description: 'Successfully Implemented for a smooth flow of getting projects to the team. ',
    tags: ['Nextjs', 'TypeScript', 'Tailwind CSS', 'python', 'PostgreSQL'],
    category: 'Innovation',
    imageUrl: 'https://projects.enfection.com/showcase-uploads/projectworkflow.jpeg',
    link: 'http://projectflow-frontend-dev.s3-website.ap-south-1.amazonaws.com/',
    createdAt: '2026-03-30T08:06:41.313Z',
  },
  {
    id: '7d0296ac-934a-4da2-b071-eca15970b9f1',
    title: 'AI-Powered News Automation & Publishing System',
    description: 'Automated news collection, AI-based SEO rewriting, image generation, and WordPress publishing workflow.',
    tags: ['N8N'],
    category: 'Innovation',
    imageUrl: 'https://projects.enfection.com/showcase-uploads/ainews.jpeg',
    link: 'https://www.linkedin.com/posts/enfection-labs_ai-marketinginnovation-contentautomation-activity-7376878367373045761-JU3c?utm_source=share&utm_medium=member_desktop&rcm=ACoAACFZ2ZUBtfPrZaOLNo-C-DJs0CVU858TPvo',
    createdAt: '2026-03-30T08:13:25.083Z',
  },
  {
    id: '24baa26f-66c6-43f3-a90b-19375b57c366',
    title: 'AEO/GEO Auditing Tool',
    description: 'Audit Brands/Websites for AEO and GEO and generate visibility reports',
    tags: ['Django', 'Next.js', 'PostgreeSQL'],
    category: 'Innovation',
    imageUrl: 'https://projects.enfection.com/showcase-uploads/aeogeo.jpeg',
    link: 'https://web-auditor.enfection.com/',
    createdAt: '2026-03-30T08:19:30.554Z',
  },
  {
    id: '9dd2f41c-01f6-4268-b042-1eaba3e6da84',
    title: 'LinkedIn Lead Automation',
    description: 'Succefully implemented in order to find the leads according to the requirements.',
    tags: ['Reactjs', 'FASTAPI', 'Python'],
    category: 'Websites',
    imageUrl: 'https://projects.enfection.com/showcase-uploads/leadauto.png',
    link: 'https://linkedin-automation.momentro.com/',
    createdAt: '2026-03-30T08:22:12.538Z',
  },
  {
    id: '246bf45f-6d16-4c19-b582-6a81962e5f70',
    title: 'Whatsapp Booking ChatBot',
    description: 'Automated booking system ',
    tags: ['Python', 'FastAPI', 'MySQL', 'MongoDB'],
    category: 'Innovation',
    imageUrl: 'https://projects.enfection.com/showcase-uploads/whatsappsalon.png',
    link: '',
    createdAt: '2026-03-30T08:30:16.838Z',
  },
  {
    id: '2ace6b20-43d6-4d93-9357-992cf18a25c6',
    title: 'Supermarket Price comparison',
    description: 'compair item prices in three main supermarkets',
    tags: ['Python', 'FastApi', 'HTML', 'Vanillajs', 'MySQL'],
    category: 'Websites',
    imageUrl: 'https://projects.enfection.com/showcase-uploads/pricecompair.jpeg',
    link: '',
    createdAt: '2026-03-30T08:41:03.604Z',
  },
  {
    id: 'defa8815-8370-45be-a8a1-661075b52f4d',
    title: 'CV Analytics System',
    description: 'Design and implement an AI-integrated CV Analysis platform with automated skill extraction, candidate insights, and an Innovative Projects tracking module.',
    tags: ['python', 'FastAPI', 'React'],
    category: 'Innovation',
    imageUrl: 'https://projects.enfection.com/showcase-uploads/cv.png',
    link: '',
    createdAt: '2026-03-30T08:45:37.786Z',
  },
  {
    id: '8c2de6e0-ee30-4b52-902a-04ff999b5086',
    title: 'Sentiment Anlyzer Tool',
    description: 'This tool is already integrated to the momentro product. ',
    tags: ['Reactjs', 'fastAPI', 'Mongo'],
    category: 'Innovation',
    imageUrl: 'https://projects.enfection.com/showcase-uploads/mom.jpg',
    link: '',
    createdAt: '2026-03-30T08:48:30.308Z',
  },
  {
    id: 'f07d392d-a448-42cc-83d3-abd3d7f2b969',
    title: 'Storytelling Websites',
    description: 'Create storytelling, advanced animation websites beyond traditional websites',
    tags: ['React', 'Tailwind'],
    category: 'Websites',
    imageUrl: 'https://projects.enfection.com/showcase-uploads/story.jpeg',
    link: 'https://drinks-cafe-gsap-landing-page.vercel.app/',
    createdAt: '2026-03-30T08:51:42.167Z',
  },
  {
    id: '05195791-e72b-4656-8def-8745966b5746',
    title: 'Fincore Financial Analytics Platform',
    description: 'Financial Analytics Platform support to finace team. merge all company(enfection,momentro,intreget) reports',
    tags: ['Reactjs', 'PHP'],
    category: 'Websites',
    imageUrl: 'https://projects.enfection.com/showcase-uploads/fincore.png',
    link: 'https://fincore.enfection.com',
    createdAt: '2026-03-30T09:12:50.532Z',
  },
  {
    id: 'aca5bf0d-ec8b-4ea2-a950-044edcd4f1de',
    title: 'HR System',
    description: 'Fully functional HR system',
    tags: ['Reactjs', 'PHP'],
    category: 'Websites',
    imageUrl: 'https://projects.enfection.com/showcase-uploads/hr.png',
    link: 'https://hr.enfection.com/login',
    createdAt: '2026-03-30T09:31:47.124Z',
  },
  {
    id: 'd25d1da2-0463-4df5-906f-4c4bf00cbf14',
    title: 'Fruit Drop',
    description: 'truit catching game controlled with plam',
    tags: ['HTML', 'CSS', 'JS', 'Python'],
    category: 'Games',
    imageUrl: 'https://projects.enfection.com/showcase-uploads/fruitdrop.png',
    link: 'https://projects.enfection.com/fruitdrop/',
    createdAt: '2026-03-30T09:34:26.532Z',
  },
  {
    id: '6df6ca53-ac34-4682-a7f5-e11f84c485d5',
    title: 'Dettol Run',
    description: 'Endless running Game',
    tags: ['HTML', 'CSS', 'JS', 'Threejs'],
    category: 'Games',
    imageUrl: 'https://projects.enfection.com/showcase-uploads/dettolrun.png',
    link: 'https://projects.enfection.com/dettolrun/',
    createdAt: '2026-03-30T09:38:55.332Z',
  },
  {
    id: 'ec7660fb-74a5-4ec4-b5fa-fc62d04bf656',
    title: 'Desert Run',
    description: 'Endless Running Game',
    tags: ['Unity', 'C#'],
    category: 'Games',
    imageUrl: 'https://projects.enfection.com/showcase-uploads/desert.png',
    link: 'https://projects.enfection.com/desertrun/',
    createdAt: '2026-03-30T09:42:58.231Z',
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
