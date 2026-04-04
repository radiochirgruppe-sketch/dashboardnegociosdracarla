export default function SectionHeading({ icon: Icon, title, badge, color = 'text-brand-400' }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className={`p-2 rounded-xl bg-gray-800 ${color}`}>
        <Icon size={18} />
      </div>
      <h2 className="text-base font-semibold text-white">{title}</h2>
      {badge && (
        <span className="ml-auto text-xs font-medium text-gray-500 bg-gray-800 px-2.5 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </div>
  )
}
