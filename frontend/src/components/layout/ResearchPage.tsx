interface ResearchPageProps {
  title: string
  section: string
  description: string
}

export default function ResearchPage({
  title,
  section,
  description,
}: ResearchPageProps) {
  return (
    <div className="px-4 py-7 sm:px-6 lg:px-8">

      <div className="mb-7">
        <div className="text-xs font-semibold uppercase tracking-wider text-[#55749c]">
          {section}
        </div>

        <h1 className="mt-2 text-2xl font-bold text-slate-900">
          {title}
        </h1>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
          {description}
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="text-sm font-semibold text-slate-900">
          BATI Research Module
        </div>

        <div className="mt-2 text-sm text-slate-500">
          Experimental implementation environment.
        </div>
      </div>

    </div>
  )
}