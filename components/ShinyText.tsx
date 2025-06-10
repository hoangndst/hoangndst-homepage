import React from 'react'

interface ShinyTextProps {
  children: React.ReactNode
  disabled?: boolean
  speed?: number
  className?: string
}

const ShinyText: React.FC<ShinyTextProps> = ({
  children,
  disabled = false,
  speed = 5,
  className = '',
}) => {
  const animationDuration = `${speed}s`

  return (
    <div
      className={`inline-block bg-clip-text text-gray-700 dark:text-[#b5b5b5a4] ${disabled ? '' : 'animate-shine'} ${className}`}
      style={{
        backgroundImage:
          'linear-gradient(120deg, rgba(255, 255, 255, 0) 40%, rgba(255, 255, 255, 0.8) 50%, rgba(255, 255, 255, 0) 60%)',
        backgroundSize: '200% 100%',
        WebkitBackgroundClip: 'text',
        animationDuration: animationDuration,
      }}
    >
      {children}
    </div>
  )
}

export default ShinyText
