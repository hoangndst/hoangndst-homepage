'use client'
import React, { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import { Mesh } from 'three'

function GopherModel() {
  const gltf = useGLTF('/static/images/gopher.glb')
  const mesh = useRef<Mesh>(null!)
  useFrame(() => {
    mesh.current.rotation.y += 0.01
  })
  return (
    <mesh ref={mesh}>
      <primitive object={gltf.scene} />
    </mesh>
  )
}

export default function Gopher() {
  return (
    <div
      className="flex items-center justify-center"
      style={{ maxHeight: '200px', maxWidth: '400px' }}
    >
      <Canvas camera={{ position: [0, 0, 1], fov: 50 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 10, 7]} intensity={1} />
        <Suspense fallback={null}>
          <GopherModel />
        </Suspense>
        <OrbitControls minDistance={1} />
      </Canvas>
    </div>
  )
}
