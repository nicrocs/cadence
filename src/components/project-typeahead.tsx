'use client'

import { useState, useEffect, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { getProjects } from '@/app/actions/projects'

type Project = { id: string; name: string; }

export function ProjectTypeahead({ defaultValue }: { defaultValue?: string }) {
  const [query, setQuery] = useState(defaultValue ?? '')
    const [suggestions, setSuggestions] = useState<Project[]>([])
    const [selectedProject, setSelectedProject] = useState<Project | null>(null)
    const containerRef = useRef(null)

    // derived from query and suggestions directly — no state needed
    const open = suggestions.length > 0 && query.length > 0
    console.log({ selectedProject })

    useEffect(() => {
        if (query.length < 1) return

        const timeout = setTimeout(() => {
            getProjects(query).then((results) => {
            setSuggestions(results)
            const exactMatch = results.find(
                (s) => s.name.toLowerCase() === query.toLowerCase()
            )
            if (exactMatch) setSelectedProject(exactMatch)
            })
        }, 200)

        return () => clearTimeout(timeout)
    }, [query])

    function handleSelect(project: Project) {
        setQuery(project.name)
        setSelectedProject(project)
        setSuggestions([])
    }

    function handleClear() {
        setQuery('')
        setSelectedProject(null)
        setSuggestions([])
    }

  return (
    <div ref={containerRef} className="flex flex-col gap-2">
      <div className="relative">
        <Input
          type="text"
          name="projectName"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setSelectedProject(null)
          }}
          placeholder="Song title (optional)"
          autoComplete="off"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
          >
            ✕
          </button>
        )}
        {open && suggestions.length > 0 && (
          <ul className="absolute z-10 w-full bg-white border rounded shadow mt-1">
            {suggestions.map((project) => (
              <li
                key={project.id}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm flex justify-between items-center"
                onMouseDown={() => handleSelect(project)}
              >
                <span>{project.name}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}