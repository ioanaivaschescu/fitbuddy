import Link, { LinkProps } from 'next/link'
import { useRouter } from 'next/router'

type Props = {
  href: LinkProps['href']
  icon: JSX.Element
  name: string
}

const NavItem = ({ href, name, icon }: Props) => {
  const { pathname } = useRouter()
  const isActive = pathname.includes(href.toString())

  return (
    <Link href={href}>
      <li
        className={`flex flex-col items-center justify-center text-sm ${
          isActive && 'text-blue-500'
        }`}
      >
        {icon}
        <span>{name}</span>
      </li>
    </Link>
  )
}

export default NavItem
