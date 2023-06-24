import CheckIcon from '@icons/check'
import * as RadixSelect from '@radix-ui/react-select'
import { cva, VariantProps } from 'class-variance-authority'
import { forwardRef } from 'react'

export const SelectRoot = (props: RadixSelect.SelectProps) => (
  <RadixSelect.Root {...props} />
)

export const SelectValue = (props: RadixSelect.SelectValueProps) => (
  <RadixSelect.Value {...props} />
)

export const SelectPortal = (props: RadixSelect.PortalProps) => (
  <RadixSelect.Portal {...props} />
)

const selectGroupStyles = cva('flex flex-col gap-4')
export const SelectGroup = ({
  className,
  ...props
}: RadixSelect.SelectGroupProps) => (
  <RadixSelect.Group
    className={selectGroupStyles({ class: className })}
    {...props}
  />
)

const selectTriggerStyles = cva(
  'flex items-center justify-center gap-4 rounded-md shadow-ms border border-gray-200 py-2 px-4 text-sm font-semibold',
  {
    variants: {
      error: {
        true: 'border-red-400 text-red-400'
      }
    },
    defaultVariants: {
      error: false
    }
  }
)
type SelectTriggerVariants = VariantProps<typeof selectTriggerStyles>
export const SelectTrigger = ({
  className,
  error = false,
  ...props
}: RadixSelect.SelectTriggerProps & SelectTriggerVariants) => (
  <RadixSelect.Trigger
    className={selectTriggerStyles({ class: className, error })}
    {...props}
  />
)

const selectIconStyles = cva('text-gray-500')
export const SelectIcon = ({
  className,
  ...props
}: RadixSelect.SelectIconProps) => (
  <RadixSelect.Icon
    className={selectIconStyles({ class: className })}
    {...props}
  />
)

const selectContentStyles = cva(
  'overflow-hidden bg-gray-100 border border-gray-300 rounded-md shadow-md text-sm font-medium'
)
export const SelectContent = ({
  className,
  ...props
}: RadixSelect.SelectContentProps) => (
  <RadixSelect.Content
    className={selectContentStyles({ class: className })}
    {...props}
  />
)

const selectViewportStyles = cva('p-4')
export const SelectViewport = ({
  className,
  ...props
}: RadixSelect.SelectViewportProps) => (
  <RadixSelect.Viewport
    className={selectViewportStyles({ class: className })}
    {...props}
  />
)

const selectItemStyles = cva(
  'text-grey-500 rounded-md flex items-center justify-between px-4'
)
export const SelectItem = forwardRef<
  HTMLDivElement,
  RadixSelect.SelectItemProps
>(({ className, children, ...props }, ref) => {
  return (
    <RadixSelect.Item
      className={selectItemStyles({ class: className })}
      {...props}
    >
      <RadixSelect.ItemText>{children}</RadixSelect.ItemText>
      <RadixSelect.ItemIndicator>
        <CheckIcon />
      </RadixSelect.ItemIndicator>
    </RadixSelect.Item>
  )
})
