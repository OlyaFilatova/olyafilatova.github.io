import { SkillsContext } from "../../types/skills";

export default function Header({ skillsContext }: { skillsContext: SkillsContext }) {
  return (
    <header className="app__header">
      <div>
        <h1>Job Skills</h1>
        <p id="summary">{
          skillsContext.totalItems ?
          `${skillsContext.totalItems} skills` :
          'No skills saved ye'
        }</p>
      </div>
    </header>
  )
}