import { getSiteSettings } from "@/services/settingsService"
import { SettingsForm } from "@/components/admin/SettingsForm"

export default async function AdminSettingsPage() {
	const settings = await getSiteSettings()

	return (
		<div className="flex flex-col gap-6">
			<h1 className="text-h2 text-white">Settings</h1>
			<p className="max-w-2xl text-small text-admin-muted">
				These values are stored in the SiteSettings row and read everywhere the site needs branding, SEO defaults, ad
				provider config, or affiliate config — changing them here never requires a code change (§51).
			</p>
			<SettingsForm initialSettings={settings} />
		</div>
	)
}
