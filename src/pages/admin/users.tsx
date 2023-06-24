import SelectRole from '@components/select-role'
import MainLayout from '@layout/main'
import { NextPageWithLayout } from '@pages/_app'
import { trpc } from '@utils/trpc'
import { ReactElement } from 'react'

const Users: NextPageWithLayout = () => {
  const { data: users } = trpc.admin.getUsers.useQuery()

  return (
    <div className="px-4">
      <div>
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            User management
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Here you can see a full list of users and change their role.
          </p>
        </div>
      </div>
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto">
          <div className="inline-block min-w-full py-2 align-middle">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr className="text-left text-sm font-semibold text-gray-900">
                    <th scope="col" className="py-3 pl-4 pr-3">
                      Name
                    </th>
                    <th scope="col" className="px-3 py-3">
                      Email
                    </th>
                    <th scope="col" className="px-3 py-3">
                      Role
                    </th>
                    <th scope="col" className="relative py-4 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white text-sm text-gray-500">
                  {users?.map((user) => (
                    <tr key={user.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3">
                        {user.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4">
                        {user.email}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4">
                        <SelectRole userId={user.id} userRole={user.role} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

Users.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout title="Users">{page}</MainLayout>
}

export default Users
