import type {VariantProps} from 'class-variance-authority'
import {cva} from 'class-variance-authority'

export const buttonStyles = cva(['border rounded-md', 'text-base', 'font-medium', 'flex', 'items-center', 'space-x-2'], {
    variants: {
      variant: {
        primary: ['bg-gray-900', 
        'text-white', 
        'hover:bg-gray-700', 
        'focus:outline focus:outline-gray-900 focus:outline-offset-2',
        'disabled:bg-gray-600 diasbled:text-gray-200 disabled:cursor-not-allowed'
    ],
        secondary: ['border border-gray-200',
        'text-gray-900',
        'hover:bg-gray-50',
        'focus:outline focus:outline-gray-200 focus:outline-offset-2',
        'disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed'
    ],
      },
      size: {
        small: 'text-sm px-2 py-1 space-x-1',
        medium: 'px-4 py-2',
        large: 'px-6 py-3'
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "medium",
    },
  });

export type ButtonVariants = VariantProps<typeof buttonStyles>


