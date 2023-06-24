import React from 'react'
import * as RadixLabel from '@radix-ui/react-label'
import { cva, VariantProps } from 'class-variance-authority'

const labelStyles = cva('font-medium text-gray-600 cursor-pointer', {
  variants: {
    error: {
      true: 'text-red-500'
    }
  }
})

type Props = RadixLabel.PrimitiveLabelProps & VariantProps<typeof labelStyles>

const Label: React.FC<Props> = ({
  children,
  className,
  error = false,
  ...props
}) => {
  return (
    <RadixLabel.Root
      className={labelStyles({ class: className, error })}
      {...props}
    >
      {children}
    </RadixLabel.Root>
  )
}

export default Label
