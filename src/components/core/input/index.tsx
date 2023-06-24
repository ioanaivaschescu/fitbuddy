import React, {
  DetailedHTMLProps,
  forwardRef,
  InputHTMLAttributes
} from 'react'
import { cva, VariantProps } from 'class-variance-authority'
import Label from '@components/core/label'

export const inputStyles = cva(
  'px-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring focus:ring-offset-2 focus:ring-gray-300',
  {
    variants: {
      error: {
        true: 'border-red-400 focus:ring-red-200'
      }
    },
    defaultVariants: {
      error: false
    }
  }
)

type InputProps = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>

export type AdditionalProps = {
  labelMessage?: string
  errorMessage?: string
}

type Props = InputProps & AdditionalProps & VariantProps<typeof inputStyles>

const Input = forwardRef<HTMLInputElement, Props>(
  (
    { id, className, labelMessage, error = false, errorMessage, ...props },
    ref
  ) => {
    return (
      <div>
        <div className="flex flex-col gap-2">
          <Label error={error} htmlFor={id}>
            {labelMessage}
          </Label>
          <input
            ref={ref}
            id={id}
            className={inputStyles({ error })}
            {...props}
          />
        </div>
        <span className="text-sm text-red-400">{errorMessage}</span>
      </div>
    )
  }
)
Input.displayName = 'Input'

export default Input
