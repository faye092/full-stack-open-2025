import { useState } from 'react'


const Button = ({handleClick, feedback}) => {
  <button onClick={handleClick}>{feedback}</button>
}

const StatisticLine = ({text, value}) => {
  return(
    <tr>
      <td>
        {text}
        {value}
      </td>
    </tr>
  )
}

const Statistics = ({good, neutral, bad}) => {
  const all = good + neutral + bad
  const average = ((good * 1 + neutral * 0 + bad * (-1))/all).toFixed(1)
  const positive = (((good * 1)/all) * 100).toFixed(1)

  if (all == 0) {
    return <p>No feedback given</p>
  }

  return(
    <table>
      <tbody>
        <StatisticLine text="good" value ={good} />
        <StatisticLine text="neutral" value ={neutral} />
        <StatisticLine text="bad" value ={bad} />
        <StatisticLine text="all" value ={all} />
        <StatisticLine text="average" value ={average} />
        <StatisticLine text="positive" value ={positive +" %"} />
      </tbody>
    </table>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const clickToGood = () => {
    setGood(good + 1)
  }
  const clickToNeutral = () => {
    setNeutral(neutral + 1)
  }
  const clickToBad = () => {
    setBad(bad + 1)
  }

  return (
    <>
      <h1>give feedback</h1>
      <Button handleClick={clickToGood} feedback="good"/>
      <Button handleClick={clickToNeutral} feedback="neutral"/>
      <Button handleClick={clickToBad} feedback="bad"/>
      <h1>statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad}/>
    </>
  )
}

export default App