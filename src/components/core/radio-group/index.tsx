import * as RadixRadioGroup from '@radix-ui/react-radio-group'
import { cva, VariantProps } from 'class-variance-authority'

const radioGroupRootStyles = cva('flex', {
  variants: {
    direction: {
      row: 'flex-row',
      column: 'flex-col'
    }
  },
  defaultVariants: {
    direction: 'row'
  }
})

type RadioGroupRootProps = RadixRadioGroup.RadioGroupProps &
  VariantProps<typeof radioGroupRootStyles>

export const RadioGroupRoot = ({
  className,
  direction,
  ...props
}: RadioGroupRootProps) => {
  return (
    <RadixRadioGroup.Root
      className={radioGroupRootStyles({ direction, class: className })}
      {...props}
    />
  )
}

const radioGroupItemStyles = cva(
  'relative bg-gray-200 w-5 h-5 shadow-sm rounded-full'
)

export const RadioGroupItem = ({
  className,
  ...props
}: RadixRadioGroup.RadioGroupItemProps) => {
  return (
    <RadixRadioGroup.Item
      className={radioGroupItemStyles({ class: className })}
      {...props}
    />
  )
}

const radioGroupIndicatorStyles = cva(
  'absolute translate-x-[25%] flex justify-center items-center w-4/6 h-4/6 relative bg-gray-900 rounded-full'
)

export const RadioGroupIndicator = ({
  className,
  ...props
}: RadixRadioGroup.RadioIndicatorProps) => {
  return (
    <RadixRadioGroup.Indicator
      className={radioGroupIndicatorStyles({ class: className })}
      {...props}
    />
  )
}
