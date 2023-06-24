import ChevronDownIcon from '@icons/chevron-down'
import { Role } from '@prisma/client'
import {
  SelectRoot,
  SelectIcon,
  SelectTrigger,
  SelectValue,
  SelectPortal,
  SelectViewport,
  SelectGroup,
  SelectItem,
  SelectContent
} from '@components/core/select'
import { useCallback, useState } from 'react'
import { trpc } from '@utils/trpc'

const OPTIONS = [
  {
    label: 'User',
    value: 'USER'
  },
  {
    label: 'Trainer',
    value: 'TRAINER'
  },
  {
    label: 'Admin',
    value: 'ADMIN'
  }
]

type Props = {
  userId: string
  userRole: Role
}

const SelectRole = ({ userId, userRole }: Props) => {
  const [value, setValue] = useState<Role>(userRole)

  const context = trpc.useContext()
  const { mutateAsync } = trpc.admin.updateUserRole.useMutation({
    onSuccess() {
      context.admin.getUsers.invalidate()
    }
  })

  const onValueChange = useCallback(
    (newRole: Role) => {
      setValue(newRole)
      mutateAsync({ userId, role: newRole })
    },
    [userId, userRole]
  )

  return (
    <div>
      <SelectRoot value={value} onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select Role" />
          <SelectIcon>
            <ChevronDownIcon />
          </SelectIcon>
        </SelectTrigger>
        <SelectPortal>
          <SelectContent>
            <SelectViewport>
              <SelectGroup>
                {OPTIONS.map(({ label, value }) => (
                  <SelectItem key={`select-day-${value}`} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectViewport>
          </SelectContent>
        </SelectPortal>
      </SelectRoot>
    </div>
  )
}

export default SelectRole
