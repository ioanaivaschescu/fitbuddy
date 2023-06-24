import { useMemo } from 'react'

type Props = {
  name: string
}

const getInitialsFromName = (name: string) => {
  const [firstname, middlename, lastname] = name.split(' ')
  const initials = `${(firstname?.[0] || '').toLocaleUpperCase()}${(
    middlename?.[0] || ''
  ).toLocaleUpperCase()}${(lastname?.[0] || '').toLocaleUpperCase()}`

  return initials
}

const Avatar = ({ name }: Props) => {
  const initials = useMemo(() => getInitialsFromName(name), [name])

  return (
    <span className="bg-gray-200 p-3 font-semibold text-gray-600 rounded-full">
      {initials}
    </span>
  )
}

export default Avatar
