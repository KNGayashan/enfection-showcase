import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { gsap } from 'gsap'
import logoImg from '../assets/images/hero/enfection.png'
import momentroImg from '../assets/images/hero/momentro.png'

const PARTICLE_COUNT = 10000

// ── Helpers (module-level to avoid deep nesting) ──────────────────────────────


function getScatterPoints() {
  const pts = new Float32Array(PARTICLE_COUNT * 3)
  for (let i = 0; i < PARTICLE_COUNT * 3; i++) {
    pts[i] = (Math.random() - 0.5) * 20
  }
  return pts
}

function sampleImageToPoints(imageData) {
  const points = []
  for (let y = 0; y < 200; y++) {
    for (let x = 0; x < 200; x++) {
      const alpha = imageData[(y * 200 + x) * 4 + 3]
      if (alpha > 128) {
        points.push({
          x: (x - 100) * 0.03,
          y: (100 - y) * 0.03,
          z: (Math.random() - 0.5) * 0.5,
        })
      }
    }
  }
  const pts = new Float32Array(PARTICLE_COUNT * 3)
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const p = points[Math.floor((i * points.length) / PARTICLE_COUNT)]
    pts[i * 3]     = p.x
    pts[i * 3 + 1] = p.y
    pts[i * 3 + 2] = p.z
  }
  return pts
}

function getLogoPoints(url) {
  return new Promise((resolve) => {
    const img = new Image()
    img.src = url
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = 200
      canvas.height = 200
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, 200, 200)
      resolve(sampleImageToPoints(ctx.getImageData(0, 0, 200, 200).data))
    }
    img.onerror = () => resolve(null)
  })
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function ParticleEffect() {
  const mountRef = useRef(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const scene    = new THREE.Scene()
    const camera   = new THREE.PerspectiveCamera(75, mount.clientWidth / mount.clientHeight, 0.1, 1000)
    camera.position.z = 10

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)

    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(PARTICLE_COUNT * 3)
    for (let i = 0; i < PARTICLE_COUNT * 3; i++) positions[i] = (Math.random() - 0.5) * 20
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    const material = new THREE.PointsMaterial({
      color: 0xff4d00,
      size: 0.04,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })

    const particleGroup  = new THREE.Group()
    const particleSystem = new THREE.Points(geometry, material)
    particleGroup.add(particleSystem)
    scene.add(particleGroup)

    function morph(target) {
      gsap.to(geometry.attributes.position.array, {
        endArray: target,
        duration: 4,
        ease: 'power3.inOut',
        onUpdate: () => { geometry.attributes.position.needsUpdate = true },
      })
    }

    let tl = null

    Promise.all([getLogoPoints(logoImg), getLogoPoints(momentroImg)]).then((results) => {
      const shapes = results.filter(Boolean)
      tl = gsap.timeline({ repeat: -1 })

      // Each available logo shape → destroy
      shapes.forEach((shape) => {
        tl.call(() => {
          morph(shape)
          gsap.to(particleSystem.rotation, { y: particleSystem.rotation.y + Math.PI * 2, duration: 8, ease: 'none' })
        }).to({}, { duration: 8 })
        tl.call(() => morph(getScatterPoints())).to({}, { duration: 3 })
      })
    })

    let rafId
    function animate() {
      rafId = requestAnimationFrame(animate)
      particleGroup.rotation.y += 0.001
      particleGroup.position.y = Math.sin(Date.now() * 0.001) * 0.2
      renderer.render(scene, camera)
    }
    animate()

    function onResize() {
      camera.aspect = mount.clientWidth / mount.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(mount.clientWidth, mount.clientHeight)
    }
    const ro = new ResizeObserver(onResize)
    ro.observe(mount)

    return () => {
      cancelAnimationFrame(rafId)
      tl?.kill()
      ro.disconnect()
      renderer.dispose()
      geometry.dispose()
      material.dispose()
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={mountRef} className="particle-canvas" />
}
