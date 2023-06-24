import React, {
  DetailedHTMLProps,
  forwardRef,
  TextareaHTMLAttributes
} from 'react'
import { AdditionalProps, inputStyles } from '@components/core/input'
import { VariantProps } from 'class-variance-authority'
import Label from '@components/core/label'

type TextareaProps = DetailedHTMLProps<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  HTMLTextAreaElement
>

type Props = TextareaProps & AdditionalProps & VariantProps<typeof inputStyles>

const Textarea = forwardRef<HTMLTextAreaElement, Props>(
  (
    {
      id,
      rows,
      className,
      labelMessage,
      error = false,
      errorMessage,
      ...props
    },
    ref
  ) => {
    return (
      <div>
        <div className="flex flex-col gap-2">
          <Label htmlFor={id}>{labelMessage}</Label>
          <textarea
            ref={ref}
            rows={rows && rows > 3 ? rows : 3}
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
Textarea.displayName = 'Textarea'

export default Textarea
