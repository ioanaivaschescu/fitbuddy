import React from 'react'
import type { ButtonVariants } from './styles'
import { buttonStyles } from './styles'

type ButtonProps = {
    icon?: React.ReactNode
} & ButtonVariants &
  React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >

const Button = ({ children, icon, className, variant, size, ...props }: ButtonProps) => {
  return (
    <button
      className={buttonStyles({ variant, size, class: className })}
      {...props}
    >
        {icon}
        <span className="w-full">{children}</span>
    </button>
  )
}

export default Button
