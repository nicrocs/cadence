'use client'

import { useState, useEffect, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { getProjects } from '@/app/actions/projects'

export type Project = { id: string; name: string; }
interface ProjectTypeaheadProps { 
  defaultValue?: string, 
  onSelect?: (project: Project | null) => void
  onChange?: (value: string) => void
  inputClassName?: string
}
export function ProjectTypeahead({
  defaultValue,
  onSelect,
  onChange,
  inputClassName,
}: ProjectTypeaheadProps) {
  const [query, setQuery] = useState(defaultValue ?? '')
    const [suggestions, setSuggestions] = useState<Project[]>([])
    // const [selectedProject, setSelectedProject] = useState<Project | null>(null)
    const containerRef = useRef(null)

    // derived from query and suggestions directly — no state needed
    const open = suggestions.length > 0 && query.length > 0

    useEffect(() => {
        if (query.length < 1) return

        const timeout = setTimeout(() => {
            getProjects(query).then((results) => {
              setSuggestions(results)
              const exactMatch = results.find(
                  (s) => s.name.toLowerCase() === query.toLowerCase()
              )
              if (exactMatch) onSelect?.(exactMatch)
            })
        }, 200)

        return () => clearTimeout(timeout)
    }, [query, onSelect])

    function handleSelect(project: Project) {
        setQuery(project.name)
        onSelect?.(project)
        setSuggestions([])
    }

    function handleClear() {
        setQuery('')
        onSelect?.(null)
        setSuggestions([])
    }

  return (
    <div ref={containerRef} className="flex flex-col gap-2">
      <div className="relative">
        <Input
          id="projectName"
          type="text"
          name="projectName"
          value={query}
          className={inputClassName}
          onChange={(e) => {
            setQuery(e.target.value)
            onSelect?.(null)
            onChange?.(e.target.value)
          }}
          placeholder="Project name (optional)"
          autoComplete="off"
        />
        {query && (
          <Button
            type="button"
            size='sm'
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            ✕
          </Button>
        )}
        {open && suggestions.length > 0 && (
          <ul className="absolute z-10 w-full bg-white border rounded shadow mt-1">
            {suggestions.map((project) => (
              <li
                key={project.id}
                className="flex cursor-pointer items-center justify-between px-3 py-2 text-sm hover:bg-accent"
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
