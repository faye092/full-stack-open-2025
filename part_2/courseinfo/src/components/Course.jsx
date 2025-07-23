const Header = ({ name }) => {
  return <h2>{name}</h2>;
}

const Content = ({ parts }) => {
  return (
    <>
      {parts.map((part) => (
        <Part key={part.id} part={part} />
      ))}
    </>
  )
}

const Part = ({part}) => {
  return (
    <p>
        {part.name} {part.exercises}
    </p>
  )
}

const Total = ({parts}) => {
  const totalAmount = parts.reduce((sum, part) => sum + part.exercises, 0)
  return (
    <>
      <p>
        total of {totalAmount} exercises
      </p>
    </>
  )
}

const Course = ({ course }) => {
  return (
    <>
      <Header name={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </>
  )
}

export default Course