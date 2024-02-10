/* Must keep react import even though it's not directly used */
import { React, compileReactStatic as compileReactStatic_} from './deps.ts'

export const compileReactStatic = async (path: string, watch?: boolean): Promise<string> => {
  // Randomize the path so that it's unique (and thus reimported each time)
  const pathUnique = watch ? `${path}?v=${Math.random().toString(36).substring(7)}` : path
  
  // eval the JS, then run through compileReactStatic
  const App = await import(pathUnique).then((m) => m.default)
  const compiled = compileReactStatic_(<App />)
  return '<!DOCTYPE html>' + compiled
}