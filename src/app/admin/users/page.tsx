import { prisma } from "@/lib/prisma"
import { formatDate } from "@/lib/utils"

type UserRow = {
	id: string
	email: string
	role: string
	createdAt: Date
}

export default async function AdminUsersPage() {
	const users: UserRow[] = await prisma.user.findMany({
		orderBy: { createdAt: "desc" },
	})

	return (
		<div className="flex flex-col gap-6">
			<h1 className="text-h2 text-white">Users</h1>

			<div className="overflow-x-auto rounded-card border border-admin-border">
				<table className="w-full text-small">
					<thead>
						<tr className="border-b border-admin-border bg-admin-surface text-left text-admin-muted">
							<th className="p-4">Email</th>
							<th className="p-4">Role</th>
							<th className="p-4">Joined</th>
						</tr>
					</thead>

					<tbody>
						{users.map((user: UserRow) => (
							<tr
								key={user.id}
								className="border-b border-admin-border last:border-0"
							>
								<td className="p-4 text-white">{user.email}</td>
								<td className="p-4 text-admin-muted">{user.role}</td>
								<td className="p-4 text-admin-muted">
									{formatDate(user.createdAt)}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	)
}